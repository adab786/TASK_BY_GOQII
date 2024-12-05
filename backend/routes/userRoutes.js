// routes/userRoutes.js
const express = require("express");
// const userController = require("../Controller/userController");
const router = express.Router();
const {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
} = require("../Controller/userController");

router.get("/users", getUsers);
router.post("/users", createUser);
router.put("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);

module.exports = router;
