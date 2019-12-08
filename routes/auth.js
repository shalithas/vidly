const express = require("express");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const Joi = require("joi");

const router = express.Router();
const { User } = require("../models/user");

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const { email, password } = req.body;

  let user = await User.findOne({ email: email });
  if (!user) {
    return res.status(400).send("User invalid email for password");
  }

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    return res.status(400).send("User invalid email for password");
  }

  res.send({ success: true, token: user.genarateAuthKey() });
});

function validate(req) {
  const schema = {
    email: Joi.string()
      .min(5)
      .max(255)
      .required()
      .email(),
    password: Joi.string()
      .required()
      .min(5)
      .max(1024)
  };

  return Joi.validate(req, schema);
}

module.exports = router;
