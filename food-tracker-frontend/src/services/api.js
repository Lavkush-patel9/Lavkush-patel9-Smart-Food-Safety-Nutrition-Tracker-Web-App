// food-tracker-frontend/src/services/api.js
import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:5000/api"
});

export default API;
