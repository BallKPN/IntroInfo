const { ObjectId } = require("mongodb");

const { User, Movie, Review } = require("..");

const addMovie = async (req, res) => {
  const { title, author, description, genre } = req.body;
  const movie = await new Movie({ title, author, description, genre });
  movie.save((err, movieData) => {
    if (err) throw console.error(err);
  });
  res.json("Movie added");
};

const editMovie = async (req, res) => {
  const { title, author, description, genre, _id } = req.body;
  await Movie.updateOne(
    { _id: ObjectId(_id) },
    { $set: { title, author, description, genre } }
  );
  res.json("Movie edited");
};

const deleteMovie = async (req, res) => {
  const _id = ObjectId(req.body._id);
  await Movie.deleteOne({ _id });
  res.json("Movie deleted");
};

const getMovies = async (req, res) => {
  await Movie.find({}, { id: 1, title: 1, genre: 1, schedule: 1 }).exec(
    (err, movies) => {
      if (err) console.error(err);
      res.json(movies);
    }
  );
};

const getOneMovie = async (req, res) => {
  const { id } = req.params;
  await Movie.findOne({ id })
    .exec()
    .populate("review")
    .exec((err, movie) => {
      if (err) console.error(err);
      res.json(movie);
    });
};

const addReview = async (req, res) => {
  const { text, date, movie_id, user_id } = req.body;
  const review = await new Review({ text, date, movie: ObjectId(movie_id) });
  review.save(async (err, reviewData) => {
    if (err) console.error(err);
    const review_id = reviewData._id;
    await Movie.updateOne(
      { _id: ObjectId(movie_id) },
      { $push: { review: { _id: review_id } } }
    );
    await User.updateOne(
      { _id: ObjectId(user_id) },
      { $push: { review: { _id: review_id } } }
    );
    res.json("Review added");
  });
};

const editReview = async (req, res) => {
  const { _id, text, date } = req.body;
  await Review.updateOne({ _id }, { $set: { text, date } });
  res.json("Review Edited");
};

const deleteReview = async (req, res) => {
  const { user_id, movie_id, review_id } = req.body;
  await User.updateOne(
    { _id: ObjectId(user_id) },
    { $pull: { review: { _id: ObjectId(review_id) } } }
  );
  await Movie.updateOne(
    { _id: ObjectId(movie_id) },
    { $pull: { review: { _id: ObjectId(review_id) } } }
  );
  await Review.deleteOne({ _id: ObjectId(review_id) });
  res.json("Review deleted");
};

module.exports = {
  addMovie,
  editMovie,
  deleteMovie,
  getMovies,
  getOneMovie,
  addReview,
  editReview,
  deleteReview,
};

// const getReview = async (req, res) => {
//   const _id = ObjectId(req.body._id);
//   await Movie.findOne({ _id }, { review: 1 })
//     .populate("review")
//     .exec((err, data) => {
//       if (err) console.error(err);
//       res.json(data);
//     });
// };
