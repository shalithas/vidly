const mongoose = require("mongoose");
const Joi = require("joi");

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 255,
    trim: true
  }
});

exports.genreSchema = schema;

exports.Genre = mongoose.model("Genre", schema);

exports.validate = function validateGenre(genre) {
  const schema = {
    name: Joi.string()
      .min(3)
      .required()
  };

  return Joi.validate(genre, schema);
};
