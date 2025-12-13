// Backend/src/controllers/ocrController.js
const axios = require("axios");
const FormData = require("form-data");
const pool = require("../config/db"); // ✅ MySQL connection pool
const fs = require("fs");

exports.uploadImage = async (req, res) => {
  try {
    console.log("📥 OCR Controller reached...");

    const file = req.file;
    const barcode = req.body.barcode?.trim() || null;
    const userId = req.user?.id || 1; // fallback for local testing

    if (!file && !barcode) {
      return res.status(400).json({ error: "No image or barcode provided" });
    }

    let productData = null;

    // 🟢 STEP 1: Try OpenFoodFacts using barcode
    if (barcode) {
      console.log(`🔍 Checking OpenFoodFacts for barcode: ${barcode}`);
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
            fiber: p.nutriments["fiber_100g"] || 0,
            sodium: p.nutriments["sodium_100g"] || 0,
            cholesterol: p.nutriments["cholesterol_100g"] || 0,
            calcium: p.nutriments["calcium_100g"] || 0,
            iron: p.nutriments["iron_100g"] || 0,
            vitamin_c: p.nutriments["vitamin-c_100g"] || 0,
            source: "OpenFoodFacts",
          };

          console.log(
            "✅ Product found in OpenFoodFacts with nutrients:",
            productData
          );
          console.log(
            "🧾 Ingredients received from OCR/Flask:",
            productData.ingredients
          );
        } else {
          console.log(
            "⚠️ Product not found in OpenFoodFacts, moving to OCR..."
          );
        }
      } catch (apiErr) {
        console.log("❌ OpenFoodFacts API error:", apiErr.message);
      }
    }

    // 🟠 STEP 2: If not found → OCR microservice
    if (!productData) {
      console.log("📸 Sending image to Flask OCR microservice...");
      const formData = new FormData();
      if (file)
        formData.append("image", file.buffer, { filename: "upload.jpg" });
      if (barcode) formData.append("barcode", barcode);

      const flaskRes = await axios.post(
        "http://127.0.0.1:5001/extract",
        formData,
        {
          headers: formData.getHeaders(),
        }
      );

      const data = flaskRes.data;
      console.log("📦 Flask OCR Response:", data);

      productData = {
        name: data.product?.name || "Unknown Product",
        barcode: barcode || data.barcodes?.[0]?.data || null,
        calories: data.nutrition?.Calories || data.nutrition?.calories || 0,
        sugar: data.nutrition?.Sugar || data.nutrition?.sugar || 0,
        protein: data.nutrition?.Protein || data.nutrition?.protein || 0,
        carbs: data.nutrition?.Carbs || data.nutrition?.carbs || 0,
        brand: data.product?.brand || "Unknown",
        image_url: null,
        ingredients_text: data.text || "",
        source: "OCR",
      };
    }

    // 🟣 STEP 3: Save data (depending on admin/user)
    let insertProd = null;

    if (req.user.role === "admin") {
      const [result] = await pool.query(
        `INSERT INTO products (name, barcode, calories, carbs, sugar, protein, brand, image_url, ingredients_text)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          productData.name,
          productData.barcode,
          productData.calories,
          productData.carbs,
          productData.sugar,
          productData.protein,
          productData.brand,
          productData.image_url,
          productData.ingredients_text,
        ]
      );
      insertProd = result.insertId;
      console.log("✅ Product inserted into products table:", insertProd);
    }

    // 🟤 STEP 4: Always save in user_logs
    await pool.query(
      `INSERT INTO user_logs 
  (user_id, product_name, calories, sugar, protein, date, barcode, fat, carbs, fiber, sodium, cholesterol, calcium, iron, vitamin_c)
  VALUES (?, ?, ?, ?, ?, NOW(), ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId,
        productData.name,
        productData.calories,
        productData.sugar,
        productData.protein,
        productData.barcode,
        productData.fat || 0,
        productData.carbs || 0,
        productData.fiber || 0,
        productData.sodium || 0,
        productData.cholesterol || 0,
        productData.calcium || 0,
        productData.iron || 0,
        productData.vitamin_c || 0,
      ]
    );
    console.log(`✅ Log saved for user ${userId} - ${productData.name}`);

    // 🔴 STEP 5: Create alerts
    const alerts = [];
    if (productData.sugar > 22)
      alerts.push({ type: "HIGH_SUGAR", message: "High sugar content" });
    if (productData.calories > 300)
      alerts.push({ type: "HIGH_CALORIES", message: "High calorie content" });
    if (!productData.barcode)
      alerts.push({ type: "NO_BARCODE", message: "Barcode missing" });

    // 🟢 STEP 6: Send Final Response
    res.status(200).json({
      message: "Product processed successfully",
      source: productData.source,
      product: productData,
      inserted_product_id: insertProd || null,
      alerts,
    });
  } catch (err) {
    console.error("❌ Error in uploadImage:", err.message);
    res.status(500).json({
      error: "Internal server error",
      details: err.message,
    });
  }
};
