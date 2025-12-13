// check_hash.js
const bcrypt = require("bcrypt");

const candidate = "admin123@"; // jo plain password test karna hai
const hashFromDB =
  "$2b$10$fyGVl2keWUD3odH4uTCQP.CDXjSkZFTA2gNOLFqFRetx23iEbBKlC";
// Replace the above hash with the exact hash shown in your MySQL for username 'admin'

bcrypt
  .compare(candidate, hashFromDB)
  .then((res) => {
    console.log("Match?:", res); // true or false
  })
  .catch((err) => {
    console.error("Error:", err);
  });
