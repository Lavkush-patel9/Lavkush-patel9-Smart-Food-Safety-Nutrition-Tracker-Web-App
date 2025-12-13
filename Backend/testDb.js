const pool = require("./src/config/db");

async function test() {
  try {
    const [rows] = await pool.query("Select Now() AS now");
    console.log("DB Test Successful:", rows[0]);
  } catch (err) {
    console.log("DB Test Failed:", err);
  }
}
test();
