// Backend/src/services/ocr_services.js
import axios from "axios";
import FormData from "form-data";
import fs from "fs";

export const extractTextFromImage = async (imagePath) => {
  const formData = new FormData();
  formData.append("image", fs.createReadStream(imagePath));

  const response = await axios.post(
    "http://127.0.0.1:5001/extract",
    formData,
    { headers: formData.getHeaders() }
  );

  return response.data;
};
