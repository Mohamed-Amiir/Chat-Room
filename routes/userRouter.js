const express = require("express");
const router = express.Router();
const userController = require("../controllers/userControllers");
const validate = require("../middlewares/userValdMW");

// Customer registration
router.post("/signup", validate, userController.userSignup);

// Customer login
router.post("/login", userController.userLogin);

module.exports = router;
