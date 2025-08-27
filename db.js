const mysql = require("mysql2/promise");

require("dotenv").config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 10000,
  ssl: { rejectUnauthorized: false } // only if hosting requires SSL
});

async function initDB() {
  
  try {
    await pool.query("SELECT 1");
    console.log("✅ MySQL Database Connected");
  } catch (err) {
    console.error("❌ MySQL Connection Error:", err.message);
    throw err;
  }
}

// Function to get all users
async function getAllUsers() {
  try {
    const [rows] = await pool.query("SELECT * FROM sensegeofence_Test.test_users");
    return rows;
  } catch (err) {
    console.error("❌ Error fetching users:", err.message);
    throw err;
  }
}

module.exports = { pool, initDB, getAllUsers };
