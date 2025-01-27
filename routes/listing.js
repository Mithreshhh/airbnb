const express = require("express");
const Router = express.Router();
const wrapAsync = require("../utils/wrapasync");
const listingSchema = require("../schema"); 
const { isLoggedIn, isOwner } = require("../middleware"); 
const methodOverride = require("method-override");
const ListingController = require("../controller/listing.js"); 
const multer = require("multer");
const { storage } = require("../cloudconfig.js");
const upload = multer({ storage });
const ExpressError = require("../utils/expressError"); 

// Middleware to validate listing schema
// const validateListing = (req, res, next) => {
//     const { error } = listingSchema.validate(req.body);
//     if (error) {
//         const msg = error.details.map(el => el.message).join(", ");
//         throw new ExpressError(400, msg); 
//     }
//     next();
// };

// Static routes first
Router.use(methodOverride("_method"));

// Index and Create routes
Router.route("/")
    .get(wrapAsync(ListingController.index))
    .post(
        isLoggedIn, 
        upload.single("listing[image]"), 
        
        wrapAsync(ListingController.createListing)
    );

// New listing form - MOVED UP before :id routes
Router.get("/new", isLoggedIn, ListingController.renderNewForm);

// Dynamic :id routes after static routes
Router.route("/:id")
    .get(wrapAsync(ListingController.showListing))
    .put(
        isLoggedIn,
        isOwner,
        upload.single("listing[image]"),
        wrapAsync(ListingController.updateform)
    )
    .delete(isLoggedIn, isOwner, wrapAsync(ListingController.delete));

// Edit form route - must come after other :id routes
Router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(ListingController.renderEditForm));

module.exports = Router;