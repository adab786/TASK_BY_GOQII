// app.js

const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const db = require("../backend/database/db");
const app = express();

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Get all users (READ)
app.get("/users", (req, res) => {
  db.query("SELECT * FROM users", (err, results) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Error fetching users", error: err });
    }
    res.status(200).json(results);
  });
});

// Create a new user (CREATE)
app.post("/users", (req, res) => {
  const { name, email, password, dob } = req.body;

  // Validate required fields
  if (!name || !email || !password || !dob) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  // Hash the password before saving it to the database
  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Error hashing password", error: err });
    }

    const query =
      "INSERT INTO users (name, email, password, dob) VALUES (?, ?, ?, ?)";
    db.query(query, [name, email, hashedPassword, dob], (err, results) => {
      if (err) {
        return res
          .status(500)
          .json({ message: "Error creating user", error: err });
      }
      res.status(201).json({
        message: "User created successfully",
        userId: results.insertId,
      });
    });
  });
});

// Update an existing user (UPDATE)
app.put("/users/:id", (req, res) => {
  const { id } = req.params;
  const { name, email, password, dob } = req.body;

  // Validate that the user exists
  db.query("SELECT * FROM users WHERE id = ?", [id], (err, results) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Error finding user", error: err });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    // If password is provided, hash it
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
        if (err) {
          return res
            .status(500)
            .json({ message: "Error hashing password", error: err });
        }
        updatedFields.push("password = ?");
        queryValues.push(hashedPassword);

        queryValues.push(id); // Add the user ID at the end for the WHERE clause

        const query =
          "UPDATE users SET " + updatedFields.join(", ") + " WHERE id = ?";
        db.query(query, queryValues, (err, results) => {
          if (err) {
            return res
              .status(500)
              .json({ message: "Error updating user", error: err });
          }
          res.status(200).json({ message: "User updated successfully" });
        });
      });
      return; // Exit early to avoid sending response before hashing completes
    }

    // If no password is provided, update other fields
    queryValues.push(id); // Add the user ID at the end for the WHERE clause
    const query =
      "UPDATE users SET " + updatedFields.join(", ") + " WHERE id = ?";
    db.query(query, queryValues, (err, results) => {
      if (err) {
        return res
          .status(500)
          .json({ message: "Error updating user", error: err });
      }
      res.status(200).json({ message: "User updated successfully" });
    });
  });
});

// Delete a user (DELETE)
app.delete("/users/:id", (req, res) => {
  const { id } = req.params;

  db.query("DELETE FROM users WHERE id = ?", [id], (err, results) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Error deleting user", error: err });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
