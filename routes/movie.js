const router = require("express").Router();

const movie = require("../controller/movie");
const user = require("../controller/user");


//Movie
router.get("/movie", movie.getMovies);
router.get("/movie/:id", movie.getOneMovie);
router.post("/movie", movie.addMovie);
router.put("/movie", movie.editMovie);
router.delete("/movie", movie.deleteMovie);

//Review
router.post("/movie/review", movie.addReview);
router.put("/movie/review", movie.editReview);


module.exports = router;

// addMovie,
//   editMovie,
//   deleteMovie,
//   getMovie,
//   addReview,
//   deleteReview,