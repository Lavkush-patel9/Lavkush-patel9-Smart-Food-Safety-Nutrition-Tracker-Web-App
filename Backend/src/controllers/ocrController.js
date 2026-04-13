const axios = require("axios");
const FormData = require("form-data");
const pool = require("../config/db");

const {
  calculateHealthScore,
  getFoodSuggestion,
  getNutrientAdvice,
} = require("../utils/health_score");

exports.uploadImage = async (req, res) => {
  try {
    console.log("📥 OCR Controller reached...");

    const file = req.file;
    const barcode = req.body.barcode?.trim() || null;
    const userId = req.user?.id || 1;

    if (!file && !barcode) {
      return res.status(400).json({ error: "No image or barcode provided" });
    }

    let productData = null;

    // 🟢 STEP 1: OpenFoodFacts API
    if (barcode) {
      try {
        const offRes = await axios.get(
          `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`
        );

        if (offRes.data.status === 1) {
          const p = offRes.data.product;

          productData = {
            name: p.product_name || "Unknown Product",
            barcode,
            calories: p.nutriments["energy-kcal_100g"] || 0,
            sugar: p.nutriments["sugars_100g"] || 0,
            protein: p.nutriments["proteins_100g"] || 0,
            carbs: p.nutriments["carbohydrates_100g"] || 0,
            fat: p.nutriments["fat_100g"] || 0,
            sodium: p.nutriments["sodium_100g"] || 0,
            ingredients_text: p.ingredients_text || "",
            source: "OpenFoodFacts",
          };
        }
      } catch (err) {
        console.log("❌ OFF API error:", err.message);
      }
    }

    // 🟠 STEP 2: OCR fallback
    if (!productData) {
      const formData = new FormData();

      if (file) {
        formData.append("image", file.buffer, {
          filename: "upload.jpg",
        });
      }

      if (barcode) {
        formData.append("barcode", barcode);
      }

      const flaskRes = await axios.post(
        "http://127.0.0.1:5001/extract",
        formData,
        { headers: formData.getHeaders() }
      );

      const data = flaskRes.data;

      productData = {
        name: data.product?.name || "Unknown Product",
        barcode: barcode || data.barcodes?.[0]?.data || null,
        calories: data.nutrition?.calories || 0,
        sugar: data.nutrition?.sugar || 0,
        protein: data.nutrition?.protein || 0,
        carbs: data.nutrition?.carbs || 0,
        fat: data.nutrition?.fat || 0,
        sodium: data.nutrition?.sodium || 0,
        brand: data.product?.brand || "Unknown",
        ingredients_text: data.text || "",
        source: "OCR",
      };
    }

    // 🔵 STEP 3: USER PROFILE
    const [[userProfile]] = await pool.query(
      "SELECT age, health_condition, goal FROM users WHERE id = ?",
      [userId]
    );

    const userAge = userProfile?.age || 25;
    const healthCond = userProfile?.health_condition || "none";
    const userGoal = userProfile?.goal || "maintenance";

    // 🔴 STEP 4: ALERT SYSTEM (PEHLE YE HOGA)
    const alerts = [];
    let healthRisk = "Low";
    let riskColor = "#10b981";

    const additives =
      /preservative|artificial|flavor|E[0-9]{3}|additive|colorant|emulsifier/i;

    if (additives.test(productData.ingredients_text)) {
      alerts.push({
        type: "ULTRA_PROCESSED",
        message: "🚨 Ultra-Processed Food detected",
      });
      healthRisk = "Medium";
      riskColor = "#f59e0b";
    }

    let sugarLimit = 20;
    if (healthCond === "diabetes") sugarLimit = 5;

    if (productData.sugar > sugarLimit) {
      alerts.push({
        type: "HIGH_SUGAR",
        message: `⚠ High Sugar (> ${sugarLimit}g)`,
      });
      healthRisk = "High";
      riskColor = "#ef4444";
    }

    if (
      productData.sodium > 600 ||
      (healthCond === "hypertension" && productData.sodium > 300)
    ) {
      alerts.push({
        type: "HIGH_SODIUM",
        message: "🧂 High Sodium detected",
      });
    }

    if (userGoal === "muscle_gain" && productData.protein < 5) {
      alerts.push({
        type: "LOW_PROTEIN",
        message: "💪 Low Protein",
      });
    }

    if (userGoal === "weight_loss" && productData.calories > 300) {
      alerts.push({
        type: "HIGH_CALORIES",
        message: "🏃 High calories for weight loss",
      });
    }

    // 🔥 STEP 5: HEALTH SCORE (ALERTS KE BAAD)
    const health_score = calculateHealthScore(
      productData,
      {
        age: userAge,
        health_conditions:
          healthCond === "none" ? [] : [healthCond],
      },
      { alerts }
    );

    const suggestion = getFoodSuggestion(health_score);
    const adviceList = getNutrientAdvice(productData);

    // 💾 STEP 6: DB INSERT
    await pool.query(
      `INSERT INTO user_logs 
      (user_id, product_name, calories, sugar, protein, date, barcode, fat, carbs, sodium, health_score)
      VALUES (?, ?, ?, ?, ?, NOW(), ?, ?, ?, ?, ?)`,
      [
        userId,
        productData.name,
        productData.calories,
        productData.sugar,
        productData.protein,
        productData.barcode,
        productData.fat,
        productData.carbs,
        productData.sodium,
        health_score
      ]
    );

    // 🟢 STEP 7: RESPONSE
    res.status(200).json({
      product: productData,
      health_score,
      suggestion,
      adviceList,
      alerts,
      healthRisk,
      riskColor,
    });

  } catch (err) {
    console.error("❌ OCR Error:", err.message);
    res.status(500).json({
      error: "Internal server error",
      details: err.message,
    });
  }
};