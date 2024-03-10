const Review=require("../models/review.js")
const Listing=require("../models/listing.js");

// Controller for Create Review
module.exports.createReviews=async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author=req.user._id;   
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
    req.flash("success", "Review Added!");
    res.redirect(`/listings/${listing._id}`);
    // console.log("Review Saved");
    // res.send("Review Saved Successfully")
  }

//   Controller for Delete Reviews
module.exports.deleteReviews=async (req, res) => {
    let { id, reviewId } = req.params;

    // pull is used to remove data from specific array instances
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review Deleted!");
    res.redirect(`/listings/${id}`);
  }