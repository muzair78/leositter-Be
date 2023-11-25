const express = require("express");
const authRoutes = require("./AuthRoutes");
const userRoutes = require("./UserRoutes");

let router = express.Router();

router.use("/auth", authRoutes);
router.use("/user", userRoutes);

module.exports = router;
