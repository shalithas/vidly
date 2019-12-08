const express = require("express");
const _ = require("lodash");
const bcrypt = require('bcrypt');

const authMiddleware = require('../middleware/auth');

const router = express.Router();
const { User, validate } = require("../models/user");

router.get("/me", authMiddleware, async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  res.send(user);
}), 

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (user) {
    res.status(400).send("User already exists");
    return;
  }

  user = new User(_.pick(req.body, ["name", "email", "password"]));
  const salt = await bcrypt.genSalt();
  user.password = await bcrypt.hash(user.password, salt);

  await user.save();

  res.header('x-auth-token', user.genarateAuthKey()).send(_.pick(user, ["_id", "name", "email"]));
});

module.exports = router;
