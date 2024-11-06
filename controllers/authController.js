const express = require("express");
const User = require("../models/userService");
const bcrypt = require("bcrypt");

const authController = {
  registerUser: async (req, res) => {
    console.log(req.body); // Kiểm tra nội dung của req.body
    try {
      const { username, email, password } = req.body; // Destructure req.body
      if (!username || !email || !password) {
        return res.status(400).send("All fields are required");
      }
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);

      const user = await new User({
        username: req.body.username,
        password: hashedPassword,
        email: req.body.email,
      });

      await user.save();
      res.send("Signup successfully!!!");
    } catch (error) {
      console.error(error); // In ra lỗi chi tiết
      res.send("Signup failed!!!");
    }
  },
};
module.exports = authController;
