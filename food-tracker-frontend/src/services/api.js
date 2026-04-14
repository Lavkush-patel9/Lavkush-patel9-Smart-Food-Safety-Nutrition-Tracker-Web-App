// food-tracker-frontend/src/services/api.js
import axios from "axios";

const API = axios.create({
  baseURL: "https://lavkush-patel9-smart-food-safety-wd7y.onrender.com/api"
});

export default API;
