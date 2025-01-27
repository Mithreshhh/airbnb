const Review = require("../models/reviews.js");
const Listing=require("../models/Listing.js")
module.exports.CreateReview=(async (req, res) => {
    const listing = await Listing.findById(req.params.id);
    if (!listing) throw new ExpressError(404, "Listing not found");

    const newReview = new Review(req.body.review);
    newReview.author=req.user._id;
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    req.flash("success", "Review added successfully");
    res.redirect(`/listings/${listing._id}`);
})
module.exports.deleteReview=async (req, res) => {
    const { id, reviewId } = req.params;

    await Review.findByIdAndDelete(reviewId);
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });

    req.flash("success", "Review deleted successfully");
    res.redirect(`/listings/${id}`);
}