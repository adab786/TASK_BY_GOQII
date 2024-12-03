// db.js

require("dotenv").config(); // Load environment variables from .env file

const mysql = require("mysql2");

// MySQL connection configuration using environment variables
const connection = mysql.createConnection({
  host: process.env.DB_HOST, // Database host from .env
  user: process.env.DB_USER, // Database user from .env
  password: process.env.DB_PASSWORD, // Database password from .env
  database: process.env.DB_NAME, // Database name from .env
  port: process.env.DB_PORT, // Database port from .env
});

connection.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err.stack);
    return;
  }
  console.log("Connected to the MySQL database.");
});

module.exports = connection;
