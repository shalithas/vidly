const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Fawn = require("fawn");

const authMiddleware = require('../middleware/auth');

const { Movie } = require("../models/movie");
const { Customer } = require("../models/customer");
const { Rental, validate } = require("../models/rental");

Fawn.init(mongoose);

router.get("/", async (req, res) => {
  const rentals = await Rental.find().sort("-outDate");
  res.send(rentals);
});

router.post("/", authMiddleware, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const customer = await Customer.findById(req.body.customerId);
  if (!customer) return res.status(422).send("Customer not found");

  const movie = await Movie.findById(req.body.movieId);
  if (!movie) return res.status(422).send("Movie not found");

  const rental = new Rental({
    customer: {
      _id: customer._id,
      name: customer.name,
      phone: customer.phone,
      isGold: customer.isGold
    },
    movie: {
      _id: movie._id,
      title: movie.title,
      dailyRentalRate: movie.dailyRentalRate
    }
  });

  try {
    new Fawn.Task()
      .save("rentals", rental)
      .update("movies", { _id: movie._id }, { $inc: { numberInStock: -1 } })
      .run();

    res.send(rental);
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
});

router.put("/:id", authMiddleware, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const genre = await Genre.findById(req.body.genreId);
  if (!genre) return res.status(422).send("Genre not found");

  const movie = await Movie.findByIdAndUpdate(
    req.params.id,
    {
      title: req.body.title,
      genre: {
        _id: genre._id,
        name: genre.name
      },
      numberInStock: req.body.numberInStock,
      dailyRentalRate: req.body.dailyRentalRate
    },
    { new: true }
  );

  if (!movie)
    return res
      .status(404)
      .send("The customer with the given ID was not found.");

  await movie.save();
  res.send(movie);
});

router.delete("/:id", authMiddleware, async (req, res) => {
  const movie = await Movie.findByIdAndDelete(req.params.id);
  if (!movie)
    return res
      .status(404)
      .send("The customer with the given ID was not found.");

  res.send(movie);
});

router.get("/:id", async (req, res) => {
  const movie = await Movie.findById(req.params.id);
  if (!movie)
    return res
      .status(404)
      .send("The customer with the given ID was not found.");
  res.send(movie);
});

module.exports = router;
