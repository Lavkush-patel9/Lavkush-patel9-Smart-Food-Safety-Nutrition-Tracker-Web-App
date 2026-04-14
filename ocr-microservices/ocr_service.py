# ocr_service.py
from flask import Flask, request, jsonify
from flask_cors import CORS
import io
import cv2
import pytesseract
from PIL import Image
import numpy as np
import re
import requests

# optional: zxing-cpp if installed
try:
    import zxingcpp
    ZXING_AVAILABLE = True
except Exception:
    ZXING_AVAILABLE = False

app = Flask(__name__)
CORS(app)

# ✅ Nutrition reference and analysis utilities
recommended_limits = {
    "Calories": 2000,
    "Carbohydrate": 275,
    "Fiber": 30,
    "Protein": 50,
    "Total Fat": 70,
    "Saturated Fat": 20,
    "Trans Fat": 2,
    "Cholesterol": 300,
    "Sugar": 50,
    "Sodium": 2300,
    "Potassium": 4700,
    "Calcium": 1000,
    "Iron": 18,
    "Vitamin C": 90,
    "Vitamin D": 20,
    "Vitamin B12": 2.4,
    "Magnesium": 400,
    "Zinc": 11,
}

def analyze_nutrition(nutrition):
    health = {}
    limits = {"fat": 70, "sugar": 50, "salt": 6, "protein": 50, "fiber": 30}

    for nutrient, value in nutrition.items():
        limit = limits.get(nutrient.lower())
        if limit:
            try:
                # extract numeric value safely
                numeric_value = float(value.get("value", 0)) if isinstance(value, dict) else float(value)
            except Exception:
                numeric_value = 0
            percent = (numeric_value / limit) * 100
            health[nutrient] = f"{percent:.2f}%"
        else:
            health[nutrient] = "N/A"

    return health


def overall_health_score(analysis):
    if not analysis:
        return 0
    score = 0
    total = len(analysis)
    for n in analysis.values():
        if isinstance(n, str) and "%" in n:
            try:
                val = float(n.replace("%", ""))
                if val < 50:
                    score += 1
                elif val < 100:
                    score += 0.5
            except:
                pass
    return round((score / total) * 100, 1)


# -----------------------------------------------------------
# Safe float helper
# -----------------------------------------------------------
def safe_float(value):
    try:
        return float(value) if value not in [None, ""] else 0.0
    except (ValueError, TypeError):
        return 0.0


# -----------------------------------------------------------
# Fetch product info from OpenFoodFacts
# -----------------------------------------------------------
def fetch_product_info(barcode):
    try:
        barcode = barcode.strip()
        print("Calling API for barcode:", barcode)
        url = f"https://world.openfoodfacts.org/api/v2/product/{barcode}"
        response = requests.get(url)
        print("API status:", response.status_code)

        if response.status_code == 200:
            data = response.json()
            product = data.get("product", {})
            if product:
                nutriments = product.get("nutriments", {})
                ingredients = (
                    product.get("ingredients_text_en")
                    or product.get("ingredients_text")
                    or product.get("ingredients_hierarchy")
                    or "Not available"
                )

                nutrition = {
                    "Calories": safe_float(nutriments.get("energy-kcal_100g")),
                    "Sugar": safe_float(nutriments.get("sugars_100g")),
                    "Sodium": safe_float(nutriments.get("sodium_100g")),
                    "Total Fat": safe_float(nutriments.get("fat_100g")),
                    "Protein": safe_float(nutriments.get("proteins_100g")),
                    "Carbohydrate": safe_float(nutriments.get("carbohydrates_100g")),
                    "Fiber": safe_float(nutriments.get("fiber_100g")),
                    "Saturated Fat": safe_float(nutriments.get("saturated-fat_100g")),
                    "Trans Fat": safe_float(nutriments.get("trans-fat_100g")),
                    "Cholesterol": safe_float(nutriments.get("cholesterol_100g")),
                    "Calcium": safe_float(nutriments.get("calcium_100g")),
                    "Iron": safe_float(nutriments.get("iron_100g")),
                    "Potassium": safe_float(nutriments.get("potassium_100g")),
                    "Vitamin C": safe_float(nutriments.get("vitamin-c_100g")),
                    "Vitamin D": safe_float(nutriments.get("vitamin-d_100g")),
                    "Vitamin B12": safe_float(nutriments.get("vitamin-b12_100g")),
                    "Magnesium": safe_float(nutriments.get("magnesium_100g")),
                    "Zinc": safe_float(nutriments.get("zinc_100g")),
                }

                analysis = analyze_nutrition(nutrition)
                score = overall_health_score(analysis)

                return {
                    "name": product.get("product_name", "Unknown"),
                    "brand": product.get("brands", "Unknown"),
                    "ingredients": ingredients,
                    "nutrition": nutrition,
                    "overall_health_score": score,
                    "image": product.get("image_front_url"),
                    "allergens": product.get("allergens", "")
                }

    except Exception as e:
        print("Error:", str(e))
    return None


# -----------------------------------------------------------
# OCR + barcode helpers
# -----------------------------------------------------------
def read_image_from_request(file_storage):
    in_memory_file = io.BytesIO()
    file_storage.save(in_memory_file)
    in_memory_file.seek(0)
    pil = Image.open(in_memory_file).convert("RGB")
    img = cv2.cvtColor(np.array(pil), cv2.COLOR_RGB2BGR)
    return img


def preprocess_for_ocr(cv2_img):
    h, w = cv2_img.shape[:2]
    if max(h, w) < 1000:
        scale = 1000.0 / max(h, w)
        cv2_img = cv2.resize(cv2_img, (int(w * scale), int(h * scale)), interpolation=cv2.INTER_CUBIC)
    gray = cv2.cvtColor(cv2_img, cv2.COLOR_BGR2GRAY)
    try:
        clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
        gray = clahe.apply(gray)
    except Exception:
        pass
    blur = cv2.GaussianBlur(gray, (3, 3), 0)
    _, th = cv2.threshold(blur, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
    if np.mean(th) < 127:
        th = cv2.bitwise_not(th)
    return th


def ocr_full_and_words(cv2_img, lang="eng"):
    pre = preprocess_for_ocr(cv2_img)
    try:
        full_text = pytesseract.image_to_string(pre, lang=lang)
    except Exception:
        full_text = pytesseract.image_to_string(pre)
    try:
        data = pytesseract.image_to_data(pre, output_type=pytesseract.Output.DICT, lang=lang)
    except Exception:
        data = pytesseract.image_to_data(pre, output_type=pytesseract.Output.DICT)
    words = []
    n = len(data.get('text', []))
    for i in range(n):
        txt = str(data['text'][i]).strip()
        if not txt:
            continue
        try:
            conf = float(data['conf'][i])
        except:
            conf = None
        box = {
            "left": int(data['left'][i]),
            "top": int(data['top'][i]),
            "width": int(data['width'][i]),
            "height": int(data['height'][i])
        }
        words.append({"text": txt, "confidence": conf, "box": box})
    return full_text, words


def detect_barcode(cv2_img):
    results = []
    try:
        qr = cv2.QRCodeDetector()
        data, _, _ = qr.detectAndDecode(cv2_img)
        if data:
            results.append({"type": "QR_CODE", "data": data, "engine": "opencv_qr"})
    except:
        pass
    if ZXING_AVAILABLE:
        try:
            ok, buf = cv2.imencode('.png', cv2_img)
            if ok:
                zres = zxingcpp.read_barcodes(buf.tobytes())
                for r in zres:
                    text = getattr(r, "text", "")
                    fmt = getattr(r, "format", None)
                    if text:
                        results.append({"type": fmt, "data": text, "engine": "zxing-cpp"})
        except:
            pass
    return results


NUTRI_KEYS = [
    "calorie", "calories", "total fat", "fat", "saturated fat", "sat fat",
    "trans fat", "cholesterol", "sodium",
    "total carbohydrate", "carbohydrate", "carbs",
    "dietary fiber", "fiber", "sugars", "sugar", "total sugars",
    "protein", "serving size"
]


def parse_nutrition_from_text(full_text):
    lines = [ln.strip() for ln in full_text.splitlines() if ln.strip()]
    low_lines = [ln.lower() for ln in lines]
    nutrition = {}
    for ln in low_lines:
        for key in NUTRI_KEYS:
            if key in ln:
                m = re.search(r'(\d+(\.\d+)?)\s*(g|mg|kcal|cal|%)?', ln)
                if m:
                    nutrition[key] = {"raw_line": ln, "value": m.group(1), "unit": (m.group(3) or "").lower()}
                break
    nice = {}
    mapping = {
        "calories": "Calories", "calorie": "Calories",
        "fat": "Total Fat", "total fat": "Total Fat",
        "saturated fat": "Saturated Fat", "sat fat": "Saturated Fat",
        "trans fat": "Trans Fat",
        "cholesterol": "Cholesterol",
        "sodium": "Sodium",
        "carbohydrate": "Total Carbohydrate", "total carbohydrate": "Total Carbohydrate", "carbs": "Total Carbohydrate",
        "fiber": "Dietary Fiber", "dietary fiber": "Dietary Fiber",
        "sugar": "Sugar", "sugars": "Sugar", "total sugars": "Sugar",
        "protein": "Protein",
        "serving size": "Serving Size"
    }
    for k, v in nutrition.items():
        nice_key = mapping.get(k, k.title())
        nice[nice_key] = v
    return nice


def extract_brand_and_ingredients(full_text):
    lines = [ln.strip() for ln in full_text.splitlines() if ln.strip()]
    brand = lines[0] if lines else None
    ingredients = None
    for ln in lines:
        if "ingredient" in ln.lower():
            ingredients = ln
            break
    bc_match = re.search(r'\b(\d{8,13})\b', full_text)
    bc = bc_match.group(1) if bc_match else None
    return brand, ingredients, bc


@app.route("/extract", methods=["POST"])
def extract():
    if "image" not in request.files:
        return jsonify({"ok": False, "error": "Image not found"}), 400
    file = request.files["image"]
    manual_barcode = request.form.get("barcode")
    img = read_image_from_request(file)
    full_text, words = ocr_full_and_words(img)
    nutrition = parse_nutrition_from_text(full_text)
    brand, ingredients, bc_from_text = extract_brand_and_ingredients(full_text)
    barcodes = detect_barcode(img)
    if manual_barcode:
        barcodes.append({"type": "MANUAL_INPUT", "data": manual_barcode, "engine": "user"})
    if not barcodes and bc_from_text:
        barcodes.append({"type": "TEXT_MATCH", "data": bc_from_text, "engine": "ocr"})
    health = analyze_nutrition(nutrition)

    product_info = None
    if barcodes:
        product_info = fetch_product_info(barcodes[0]["data"])
        print("Fetched product info:", product_info)

    print("🔍 OCR OUTPUT:", {
        "product": {"name": brand, "ingredients": ingredients},
        "nutrition": nutrition,
        "barcodes": barcodes
    })

        # ✅ Send data to main backend for saving
    try:
        if product_info:
            save_payload = {
                "barcode": barcodes[0]["data"] if barcodes else "",
                "product_name": product_info.get("name", "Unknown"),
                "brand": product_info.get("brand", "Unknown"),
                "calories": product_info["nutrition"].get("Calories",             0),
                "sugar": product_info["nutrition"].get("Sugar", 0),
                "protein": product_info["nutrition"].get("Protein", 0)
                
            }

            # Replace this URL with your backend API URL
            backend_url = "https://lavkush-patel9-smart-food-safety-wd7y.onrender.com/api/logs/add"
            backend_response = requests.post(backend_url, json=save_payload)
            print("✅ Data sent to backend, status:", backend_response.status_code)
        else:
            print("⚠️ No product info available to save.")
    except Exception as e:
        print("❌ Error sending data to backend:", e)


    return jsonify({
        "ok": True,
        "product": {
        "name": product_info.get("name", brand if brand else "Unknown") if product_info else brand,
        "brand": product_info.get("brand", "Unknown") if product_info else "Unknown",
        "ingredients": product_info.get("ingredients", ingredients if ingredients else "Not detected") if product_info else ingredients},
        "nutrition": nutrition,
        "barcodes": barcodes,
        "health": health,
        "product_info": product_info,
        "raw_text": full_text,
        "words": words
    }), 200


@app.route("/health", methods=["GET"])
def health_check():
    return jsonify({"ok": True, "message": "ocr service alive"})


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=True)
