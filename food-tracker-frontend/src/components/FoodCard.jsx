import React from "react";

const FoodCard = ({ food }) => {
  return (
    <div className="p-4 bg-white rounded-xl shadow-md hover:shadow-lg transition">
      <h3 className="text-lg font-semibold">{food.food_name}</h3>
      <p>Calories: {food.calories} kcal</p>
      <p>Protein: {food.protein} g</p>
      <p>Carbs: {food.carbs} g</p>
      <p>Fat: {food.fat} g</p>
      <p className="text-sm text-gray-500 mt-2">
        {new Date(food.created_at).toLocaleDateString()}
      </p>
    </div>
  );
};

export default FoodCard;
