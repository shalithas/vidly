const mongoose = require("mongoose");
const Joi = require("joi");

exports.Rental = mongoose.model(
  "Rental",
  new mongoose.Schema({
    customer: {
      type: new mongoose.Schema({
        name: {
          type: String,
          required: true,
          minlength: 5,
          maxlength: 50
        },
        isGold: {
          type: Boolean,
          default: false
        },
        phone: {
          type: String,
          required: true,
          minlength: 5,
          maxlength: 50
        }
      })
    },
    movie: {
      type: new mongoose.Schema({
        title: {
          type: String,
          required: true,
          minlength: 5,
          maxlength: 50
        },
        dailyRentalRate: {
          type: Number,
          required: true,
          min: 0,
          max: 255
        }
      })
    },
    dateOut: {
      type: Date,
      default: Date.now,
      required: true
    },
    dateIn: {
      type: Date
    },
    rentalFee: {
      type: Number,
      min: 0
    }
  })
);

exports.validate = rental => {
  const schema = {
    movieId: Joi.objectId().required(),
    customerId: Joi.objectId().required()
  };

  return Joi.validate(rental, schema);
};
