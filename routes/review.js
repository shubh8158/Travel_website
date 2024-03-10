const express = require("express");
const ejs = require("ejs");
const router = express.Router({ mergeParams: true });
const ExpressError = require("../utils/ExpressError.js");
const wrapAsync = require("../utils/wrapAsync.js");
const { reviewSchema } = require("../schema.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, validateReview } = require("../middleware.js");

const reviewController=require("../controllers/review.js");

// Reviews
// Post Route
router.post(
  "/",
  isLoggedIn,
  validateReview,
  wrapAsync(reviewController.createReviews)
);

// Delete Review Route
router.delete(
  "/:reviewId",
  isLoggedIn,
  wrapAsync(reviewController.deleteReviews)
);

module.exports = router;
