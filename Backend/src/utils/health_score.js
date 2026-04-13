/**
 * 🔥 HEALTH SCORE CALCULATOR (PURE FUNCTION)
 * FINAL FIXED VERSION (No more 100 bug)
 */

function calculateHealthScore(nutrients = {}, userProfile = {}, result = {}) {
  let score = 100;

  const age = userProfile?.age || 25;
  const conditions = userProfile?.health_conditions || [];

  console.log("🧠 Nutrients:", nutrients);
  console.log("⚠ Alerts:", result?.alerts);

  const limits = {
    calories: 2000,
    sugar: 50,
    protein: 60,
    carbs: 300,
    fat: 70,
    fiber: 30,
    sodium: 2300,
    cholesterol: 300,
  };

  Object.keys(limits).forEach((key) => {
    let value = nutrients?.[key];

    // ✅ ensure number
    value = parseFloat(value);
    if (isNaN(value)) {
      console.log(`❌ ${key} skipped`);
      return;
    }

    console.log(`➡ ${key}:`, value);

    let limit = limits[key];

    // 👶 CHILD
    if (age < 18) {
      if (key === "sugar") limit *= 0.5;
      if (key === "calories") limit *= 0.9;
    }

    // 👴 SENIOR
    if (age > 50) {
      if (key === "sodium") limit *= 0.7;
      if (key === "cholesterol") limit *= 0.7;
    }

    // 🚨 CONDITIONS
    if (conditions.includes("diabetes") && key === "sugar") {
      limit *= 0.5;
    }

    if (conditions.includes("hypertension") && key === "sodium") {
      limit *= 0.6;
    }

    if (conditions.includes("heart") && key === "cholesterol") {
      limit *= 0.7;
    }

    // 🔴 FINAL SCORING RULES (FIXED)
    if (key === "sugar") {
      if (value > 20) {
        score -= 20;
        console.log("🚨 Sugar > 20 → -20");

        if (value > 30) {
          score -= 10;
          console.log("🚨 Sugar > 30 → extra -10");
        }
      }
    }
    else if (key === "sodium") {
      if (value > 600) {
        score -= 15;
        console.log("🧂 High sodium → -15");
      }
    }
    else {
      if (value > limit) {
        score -= 15;

        if (value > limit * 1.5) {
          score -= 10;
        }
      } else if (value > limit * 0.7) {
        score -= 5;
      }
    }

    // 🟢 BONUS
    if (key === "protein" && value > 5) {
      score += 2;
      console.log("💪 Protein bonus +2");
    }

    if (key === "fiber" && value > 5) {
      score += 2;
      console.log("🥗 Fiber bonus +2");
    }
  });

  // ⚠ ALERTS PENALTY
  if (Array.isArray(result?.alerts) && result.alerts.length > 0) {
    const penalty = result.alerts.length * 10;
    score -= penalty;
    console.log(`⚠ Alerts penalty: -${penalty}`);
  }

  // 🔥 ULTRA PROCESSED PENALTY
  if (
    Array.isArray(result?.alerts) &&
    result.alerts.some((a) =>
      typeof a === "object"
        ? a.message?.toLowerCase().includes("ultra")
        : String(a).toLowerCase().includes("ultra")
    )
  ) {
    score -= 15;
    console.log("🚨 Ultra processed penalty -15");
  }

  // 🔥 FINAL CLAMP
  score = Math.max(0, Math.min(100, score));

  console.log("✅ Final Score:", score);

  return Math.round(score);
}

// -------------------- SUGGESTION --------------------

function getFoodSuggestion(score) {
  if (score >= 80) {
    return { text: "✅ Safe to Eat", color: "green" };
  }
  if (score >= 60) {
    return { text: "⚠ Eat in Moderation", color: "orange" };
  }
  return { text: "❌ Avoid This Food", color: "red" };
}

// -------------------- NUTRIENT ADVICE --------------------

function getNutrientAdvice(nutrients = {}) {
  const advice = [];

  if ((nutrients.sugar || 0) > 25) {
    advice.push("⚠ High Sugar – Avoid for diabetes");
  }

  if ((nutrients.sodium || 0) > 1500) {
    advice.push("⚠ High Sodium – Risk for BP patients");
  }

  if ((nutrients.fiber || 0) < 5) {
    advice.push("🥗 Low Fiber – Add fruits & vegetables");
  }

  if ((nutrients.protein || 0) < 5) {
    advice.push("💪 Low Protein – Include protein-rich foods");
  }

  return advice;
}

// -------------------- EXPORTS --------------------

module.exports = {
  calculateHealthScore,
  getFoodSuggestion,
  getNutrientAdvice,
};