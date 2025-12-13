const bcrypt = require("bcrypt");

async function run() {
  const password = "admin123@"; // jo aap login me likh rahe ho
  const hashed = await bcrypt.hash(password, 10);
  console.log("Hashed Password:", hashed);
}

run();
