import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

// 📊 Recharts import
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(
          `https://lavkush-patel9-smart-food-safety-wd7y.onrender.com/api/products/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setProduct(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchProduct();
  }, [id]);

  if (!product) {
    return <h2 style={{ textAlign: "center", marginTop: 50 }}>Loading...</h2>;
  }

  // 📊 BAR DATA
  const barData = [
    { name: "Calories", value: product.calories },
    { name: "Carbs", value: product.carbs },
    { name: "Sugar", value: product.sugar },
    { name: "Protein", value: product.protein },
    { name: "Fat", value: product.fat },
  ];

  // 🥧 PIE DATA
  const pieData = [
    { name: "Carbs", value: product.carbs },
    { name: "Protein", value: product.protein },
    { name: "Fat", value: product.fat },
    { name: "Sugar", value: product.sugar },
  ];

  const COLORS = ["#4f46e5", "#16a34a", "#f59e0b", "#ef4444"];

  return (
    <div style={{ maxWidth: "900px", margin: "30px auto", padding: "20px" }}>
      
      {/* CARD */}
      <div
        style={{
          boxShadow: "0 6px 18px rgba(0,0,0,0.1)",
          borderRadius: "12px",
          padding: "20px",
          background: "#fff",
        }}
      >

        {/* TITLE */}
        <h1 style={{ textAlign: "center" }}>{product.name}</h1>

        <hr />

        {/* DETAILS */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "12px",
            marginTop: "20px",
            fontSize: "16px",
          }}
        >
          <p><b>ID:</b> {product.id}</p>
          <p><b>Calories:</b> {product.calories}</p>
          <p><b>Carbs:</b> {product.carbs}</p>
          <p><b>Sugar:</b> {product.sugar}</p>
          <p><b>Protein:</b> {product.protein}</p>
          <p><b>Fat:</b> {product.fat}</p>
          <p><b>Sodium:</b> {product.sodium}</p>
          <p><b>Barcode:</b> {product.barcode}</p>
        </div>

        <hr />

        {/* 📊 BAR CHART */}
        <h3>📊 Nutrition Comparison</h3>
        <div style={{ width: "100%", height: 300 }}>
          <ResponsiveContainer>
            <BarChart data={barData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#4f46e5" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <hr />

        {/* 🥧 PIE CHART */}
        <h3>🥧 Nutrition Distribution</h3>
        <div style={{ width: "100%", height: 300 }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                outerRadius={120}
                label
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <hr />

        {/* INGREDIENTS */}
        <div>
          <h3>Ingredients</h3>
          <p style={{ color: "#555" }}>
            {product.ingredients_text || "No ingredients available"}
          </p>
        </div>

      </div>
    </div>
  );
};

export default ProductDetail;