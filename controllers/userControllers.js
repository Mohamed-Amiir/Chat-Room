const User = require("../models/user");
const bcrypt = require("bcrypt");
const config = require("config");
const jwt = require("jsonwebtoken");

// POST /api/customers/register
const userSignup = async (req, res) => {
  try {
    // Check if the user already exists
    let existingUser = await User.findOne({ email: req.body.email }).exec();
    if (existingUser) {
      return res.status(400).json({ error: "User already registered" });
    } else {
      const { name, email, password, address, phone } = req.body;

      // Hash the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create a new user
      const newUser = new User({
        name: name,
        email: email,
        password: hashedPassword,
        address: address,
      });

      await newUser.save();

      // Generate and send a JSON Web Token (JWT)
      const token = newUser.generateAuthToken();
      res.json({ token });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Registration failed" });
  }
};

// POST /api/customers/login
const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user by email
    const user = await User.findOne({ email: email }).exec();
    if (!user) {
      return res.status(400).json({ error: "Invalid email" });
    }

    // Check the password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ error: "Invalid password" });
    }

    // Generate and send a JSON Web Token (JWT)
    const token = user.generateAuthToken();
    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Login failed" });
  }
};

module.exports = {
  userSignup,
  userLogin,
};
