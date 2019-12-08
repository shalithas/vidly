require("express-async-errors");
const winston = require("winston");
require("winston-mongodb");

module.exports = function() {
  winston.add(new winston.transports.File({ filename: "logs/logfile.log" }));
  winston.add(
    new winston.transports.MongoDB({
      db: "mongodb://localhost/vidly",
      level: "error"
    })
  );
  winston.exceptions.handle(
    new winston.transports.Console({
      colorize: true,
      prettyPrint: true
    }),
    new winston.transports.File({ filename: "logs/unhandledexceptions.log" })
  );
  process.on("unhandledRejection", ex => {
    throw ex;
  });
};
