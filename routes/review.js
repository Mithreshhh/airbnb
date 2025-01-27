const express = require("express");
const wrapAsync = require("../utils/wrapasync");
const ExpressError = require("../utils/expressError");
const Listing = require("../models/Listing");
const Review = require("../models/reviews");
const { isLoggedIn, isReviewAuthor } = require("../middleware");
const ReviewController=("../controller/review.js")
const Router = express.Router({ mergeParams: true });

const validateReview = (req, res, next) => {
    const { rating, comment } = req.body.review;
    if (!rating || !comment) {
        throw new ExpressError(400, "Invalid review data: rating and comment are required.");
    }
    next();
};

// Add a review to a listing
Router.post("/",isLoggedIn, validateReview,  wrapAsync(ReviewController.CreateReview));

// Delete a review
Router.delete("/:reviewId",isLoggedIn, isReviewAuthor ,wrapAsync(ReviewController.deleteReview));

module.exports = Router;
