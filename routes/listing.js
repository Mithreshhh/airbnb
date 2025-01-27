const express = require("express");
const Router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const listingSchema = require("../schema"); 
const { isLoggedIn, isOwner } = require("../middleware"); 
const methodOverride = require("method-override");
const ListingController = require("../controller/listing.js"); 
const multer = require("multer");
const { storage } = require("../cloudconfig.js");
const upload = multer({ storage });
const ExpressError = require("../utils/ExpressError"); 

Router.use(methodOverride("_method"));

// Middleware to validate listing schema
const validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(", ");
        throw new ExpressError(400, msg); 
    }
    next();
};

// List all listings and create a new listing
Router.route("/")
    .get(wrapAsync(ListingController.index))
    .post(
        isLoggedIn, 
        upload.single("listing[image]"), 
        validateListing,
        wrapAsync(ListingController.createListing)
    );

// Show, update, or delete a listing
Router.route("/:id")
    .get(wrapAsync(ListingController.showListing))
    .put(
        isLoggedIn,
        isOwner,
        upload.single("listing[image]"),
        validateListing, // Validate before updating
        wrapAsync(ListingController.updateform)
    ) // Update a listing
    .delete(isLoggedIn, isOwner, wrapAsync(ListingController.delete)); // Delete a listing

// New listing form
Router.get("/new", isLoggedIn, ListingController.renderNewForm);

// Edit listing form
Router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(ListingController.renderEditForm));

module.exports = Router;
