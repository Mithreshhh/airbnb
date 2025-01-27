const Listing=require("./models/Listing")
const Review = require("./models/reviews.js");
module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl=req.originalUrl;
        req.flash("error", "You must be logged in");
        return res.redirect("/login");
    }
    next();
};
module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl)(
        res.locals.redirectUrl=req.session.redirectUrl
    
    )
    next()
}
module.exports.isOwner=async (req,res,next)=>{
    const { id } = req.params;
    let lisitng= await Listing.findById(id);
    if(!lisitng.owner._id.equals(res.locals.currentUser._id)){
     req.flash("error","you don't have permission to edit")
     return res.redirect("/listings")
    }
next();
}
module.exports.isReviewAuthor=async (req,res,next)=>{
    let{reviewId}=req.params;
    let review= await Review.findById(reviewId);
    if(!review.author._id.equals(res.locals.currentUser._id)){
     req.flash("error","you did not create this review")
     return res.redirect("/listings")
    }
next();
}
