const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const config = require("config");
const Joi = require("joi");
const PasswordComplexity = require("joi-password-complexity");
// TODO: implement password complexity

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  isAdmin: {
    type: Boolean,
    default: false
  }
});

// Adding custom method to User schema gen auth token
userSchema.methods.genarateAuthKey = function(){
  return jwt.sign({ _id: this._id, isAdmin: this.isAdmin }, config.get("jwtPrivateKey"));
}

const User = mongoose.model("User", userSchema);

function validate(user) {
  const schema = {
    name: Joi.string()
      .min(5)
      .max(50)
      .required(),
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

  return Joi.validate(user, schema);
}

exports.User = User;
exports.validate = validate;
