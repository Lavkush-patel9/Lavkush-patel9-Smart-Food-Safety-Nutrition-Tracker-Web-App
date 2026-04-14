/**
 * 🔥 HEALTH SCORE CALCULATOR (PURE FUNCTION)
 * FINAL FIXED VERSION (No more 100 bug)
 */

function getNutritionScore(data) {
  let score = 50;

  const {
    calories = 0,
    sugar = 0,
    fat = 0,
    sodium = 0,
    saturatedFat = 0,
    transFat = 0,
    cholesterol = 0,
    fiber = 0,
    protein = 0,
    calcium = 0,
    iron = 0,
    potassium = 0
  } = data;

  if (calories > 400) score -= 15;
  else if (calories > 250) score -= 10;
  else if (calories >= 100 && calories <= 250) score += 10;
  else if (calories < 50) score -= 5;

  if (sugar > 25) score -= 15;
  else if (sugar > 15) score -= 10;

  if (fat > 20) score -= 10;

  if (sodium > 600) score -= 15;
  else if (sodium > 300) score -= 10;

  if (saturatedFat > 10) score -= 10;

  if (transFat > 0) score -= 20;

  if (cholesterol > 300) score -= 10;

  if (fiber >= 5) score += 10;
  if (protein >= 10) score += 10;

  if (calcium >= 100) score += 5;
  if (iron >= 2) score += 5;
  if (potassium >= 300) score += 5;

  return Math.max(0, Math.min(100, score));
}

function getAgeScore(age, data) {
  let score = 50;

  const { calories = 0, sugar = 0, fat = 0, sodium = 0, fiber = 0, calcium = 0, protein = 0 } = data;

  if (age > 40 && sugar > 20) score -= 15;
  if (age > 40 && fat > 15) score -= 10;

  if (age > 60 && sodium > 300) score -= 20;

  if (age > 40 && calories > 300) score -= 10;
  if (age > 60 && calories > 250) score -= 15;

  if (age > 40 && fiber >= 5) score += 10;
  if (age > 50 && calcium >= 100) score += 5;

  if (age < 18 && protein >= 10) score += 10;
  if (age < 18 && calories >= 200) score += 10;

  return Math.max(0, Math.min(100, score));
}

function getHealthScore(condition, data) {
  let score = 50;

  const { calories = 0, sugar = 0, fat = 0, sodium = 0, fiber = 0, potassium = 0 } = data;

  if (condition === "diabetes" && sugar > 10) score -= 20;
  if (condition === "bp" && sodium > 300) score -= 20;
  if (condition === "heart" && fat > 10) score -= 20;

  if (calories > 300) score -= 10;

  if (condition === "diabetes" && fiber >= 5) score += 10;
  if (condition === "bp" && potassium >= 300) score += 10;
  if (condition === "heart" && fat < 10) score += 10;

  return Math.max(0, Math.min(100, score));
}

function calculateHealthScore(nutrients = {}, userProfile = {}, result = {}) {

  const age = userProfile?.age || 25;
  const condition = userProfile?.health_conditions?.[0] || "normal";

  const nutritionScore = getNutritionScore(nutrients);
  const ageScore = getAgeScore(age, nutrients);
  const healthScore = getHealthScore(condition, nutrients);

  const finalScore = Math.round(
    (nutritionScore + ageScore + healthScore) / 3
  );

  return finalScore;
}

// -------------------- SUGGESTION --------------------

function getFoodSuggestion(score) {
  if (score >= 85) {
    return { text: "✅ Excellent Choice", color: "green" , message: "This food is healthy and balanced."};
  }
  if (score >= 70) {
    return { text: "👍 Good to Eat", color: "lightgreen" , message: "Healthy and safe for regular eating."};
  }
  if (score >= 50) {
    return { text: "⚠ Eat in Moderation", color: "orange" , message: "Consume occasionally, not daily."};
  }
  return { text: "❌ Avoid This Food", color: "red" , message: "This food may harm your health."};
}


// -------------------- NUTRIENT ADVICE --------------------

function getNutrientAdvice(nutrients = {}, userProfile = {}) {
  const advice = [];
  const conditions = userProfile?.health_conditions || [];

  if ((nutrients.sugar || 0) > 25) {
    advice.push("⚠ High Sugar – Reduce sweets & sugary drinks");
  }

  if ((nutrients.sodium || 0) > 300) {
    advice.push("⚠ High Sodium – Avoid salty foods");
  }

  if ((nutrients.fiber || 0) < 5) {
    advice.push("🥗 Low Fiber – Add fruits & vegetables");
  }

  if ((nutrients.protein || 0) < 5) {
    advice.push("💪 Low Protein – Include protein-rich foods");
  }

  if ((nutrients.fat || 0) > 20) {
    advice.push("🧈 High Fat – Reduce oily food");
  }

  if ((nutrients.calories || 0) > 300) {
    advice.push("🔥 High Calories – Avoid overeating");
  }

  // 🏥 Condition-based advice
  if (conditions.includes("diabetes")) {
    advice.push("🚨 Follow low sugar diet");
  }

  if (conditions.includes("bp")) {
    advice.push("🧂 Control salt intake");
  }

  if (conditions.includes("heart")) {
    advice.push("❤️ Avoid cholesterol-rich foods");
  }

  return advice;
}

// -------------------- EXPORTS --------------------

module.exports = {
  calculateHealthScore,
  getFoodSuggestion,
  getNutrientAdvice,
};