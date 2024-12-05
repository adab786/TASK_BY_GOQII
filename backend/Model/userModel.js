// models/userModel.js
const db = require("../services/db");
const bcrypt = require("bcryptjs");

// Fetch all users
const getAllUsers = (callback) => {
  db.query("SELECT * FROM users", callback);
};

// Create a new user
const createUser = (name, email, password, dob, callback) => {
  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) return callback(err);

    const query =
      "INSERT INTO users (name, email, password, dob) VALUES (?, ?, ?, ?)";
    db.query(query, [name, email, hashedPassword, dob], callback);
  });
};

// Get user by ID
const getUserById = (id, callback) => {
  db.query("SELECT * FROM users WHERE id = ?", [id], callback);
};

// Update user
const updateUser = (id, name, email, password, dob, callback) => {
  const updatedFields = [];
  const queryValues = [];

  if (name) {
    updatedFields.push("name = ?");
    queryValues.push(name);
  }
  if (email) {
    updatedFields.push("email = ?");
    queryValues.push(email);
  }
  if (dob) {
    updatedFields.push("dob = ?");
    queryValues.push(dob);
  }
  if (password) {
    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) return callback(err);

      updatedFields.push("password = ?");
      queryValues.push(hashedPassword);
      queryValues.push(id); // Add ID for the WHERE clause

      const query =
        "UPDATE users SET " + updatedFields.join(", ") + " WHERE id = ?";
      db.query(query, queryValues, callback);
    });
    return; // Early return to avoid sending response before hashing completes
  }

  queryValues.push(id); // Add ID for the WHERE clause
  const query =
    "UPDATE users SET " + updatedFields.join(", ") + " WHERE id = ?";
  db.query(query, queryValues, callback);
};

// Delete user
const deleteUser = (id, callback) => {
  db.query("DELETE FROM users WHERE id = ?", [id], callback);
};

module.exports = {
  getAllUsers,
  createUser,
  getUserById,
  updateUser,
  deleteUser,
};
