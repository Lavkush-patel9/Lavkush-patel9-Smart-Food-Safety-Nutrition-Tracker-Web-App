// utils/health_score.jsx

/**
 * 🔥 HEALTH SCORE CALCULATOR (PURE FUNCTION)
 * No global dependency (userProfile/result/product removed)
 */

// -------------------- MAIN SCORE FUNCTION --------------------

export function calculateHealthScore(nutrients, userProfile = {}, result = {}) {
  let score = 100;

  const age = userProfile?.age || 25;
  const conditions = userProfile?.health_conditions || [];

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
    const value = nutrients?.[key];
    let limit = limits[key];

    if (value == null) return;

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

    // 🔴 SCORING RULES
    if (value > limit) {
      score -= 20;
      if (value > limit * 1.5) score -= 10;
    } else if (value > limit * 0.7) {
      score -= 10;
    }

    // 🟢 BONUS
    if (key === "protein" && value > limit * 0.1) score += 5;
    if (key === "fiber" && value > limit * 0.1) score += 5;
  });

  // ⚠ BACKEND ALERTS PENALTY
  if (result?.alerts?.length) {
    score -= result.alerts.length * 10;
  }

  // 🔥 ULTRA PROCESSED PENALTY
  if (
    result?.alerts?.some((a) =>
      typeof a === "object"
        ? a.message?.toLowerCase().includes("ultra")
        : String(a).toLowerCase().includes("ultra")
    )
  ) {
    score -= 15;
  }

  return Math.max(0, Math.min(100, score));
}

// -------------------- SUGGESTION --------------------

export function getFoodSuggestion(score) {
  if (score >= 80) {
    return { text: "✅ Safe to Eat", color: "green" , message: "this is good to eat"};
  }
  if (score >= 60) {
    return { text: "⚠ Eat in Moderation", color: "orange" , message: "this not for daily eat"};
  }
  return { text: "❌ Avoid This Food", color: "red" , message: "avoid this is harmfull for health"};
}

// -------------------- NUTRIENT ADVICE --------------------

export function getNutrientAdvice(nutrients = {}) {
  const advice = [];

  if (nutrients.sugar > 25) {
    advice.push("⚠ High Sugar – Avoid for diabetes");
  }

  if (nutrients.sodium > 1500) {
    advice.push("⚠ High Sodium – Risk for BP patients");
  }

  if (nutrients.fiber < 5) {
    advice.push("🥗 Low Fiber – Add fruits & vegetables");
  }

  if (nutrients.protein < 5) {
    advice.push("💪 Low Protein – Include protein-rich foods");
  }

  return advice;
} 