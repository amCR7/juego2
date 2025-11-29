// backend/db.js
import mysql from "mysql2/promise";

const db = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "duelo",
  password: process.env.DB_PASSWORD || "root",
  database: process.env.DB_NAME || "mydb",
});

export default db;
