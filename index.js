const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const mongoose = require("mongoose");

app.use(express.json());
app.use(cors());
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

mongoose.connect(process.env.MONGO_URL);

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
  },
  password: String,
  review: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
  like: [String],
  dislike: [String],
});

const reviewSchema = new mongoose.Schema({
  user: String,
  date: Date,
  movie: { type: mongoose.Schema.Types.ObjectId, ref: "Movie" },
  text: String,
  edited: Boolean,
});

const movieSchema = new mongoose.Schema({
  id: { type: String, unique: true },
  title: String,
  author: String,
  description: String,
  genre: [String],
  schedule: [
    {
      date: Date,
      info: {
        time: Date,
        theater: String,
        theater_room: String,
        theater_type: String,
        language: String,
      },
    },
  ],
  review: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
});

const User = mongoose.model("User", userSchema);
const Movie = mongoose.model("Movie", movieSchema);
const Review = mongoose.model("Review", reviewSchema);

module.exports = {
  User,
  Movie,
  Review,
};

//Routes
const auth = require("./routes/auth");
const movie = require("./routes/movie");
app.use("/user", auth);
app.use("/movie", movie);

app.listen(process.env.PORT, () => {
  console.log("Server is running");
});
