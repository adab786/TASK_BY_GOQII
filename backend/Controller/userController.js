// controllers/userController.js
const userModel = require("../Model/userModel");

// Get all users
const getUsers = (req, res) => {
  userModel.getAllUsers((err, results) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Error fetching users", error: err });
    }
    res.status(200).json(results);
  });
};

// Create a new user
const createUser = (req, res) => {
  const { name, email, password, dob } = req.body;

  if (!name || !email || !password || !dob) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  userModel.createUser(name, email, password, dob, (err, results) => {
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
};

// Update an existing user
const updateUser = (req, res) => {
  const { id } = req.params;
  const { name, email, password, dob } = req.body;

  userModel.getUserById(id, (err, results) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Error finding user", error: err });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    userModel.updateUser(id, name, email, password, dob, (err, results) => {
      if (err) {
        return res
          .status(500)
          .json({ message: "Error updating user", error: err });
      }
      res.status(200).json({ message: "User updated successfully" });
    });
  });
};

// Delete a user
const deleteUser = (req, res) => {
  const { id } = req.params;

  userModel.deleteUser(id, (err, results) => {
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
};

module.exports = { getUsers, createUser, updateUser, deleteUser };
