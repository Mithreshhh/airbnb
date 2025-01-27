if(process.env.NODE_ENV !="production"){
require("dotenv").config();
}
const express = require("express");

const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/expressError.js");
const Listing = require("./models/Listing.js");
const Review = require("./models/reviews.js");
const user = require("./models/user.js");
const listingSchema = require("./schema.js");
const listings = require("./routes/listing.js");
const reviewRoutes = require("./routes/review.js");
const userRoute=require("./routes/user.js")
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const app = express();
const port = 8080;
const dbUrl=process.env.ATLASDB_URL;
// Connect to MongoDB
(async function main() {
    await mongoose.connect(dbUrl);
  
    console.log("Connected to the database");
})();

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

// Set up the view engine and templates
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));
//mongo store
const store=MongoStore.create({
    mongoUrl:dbUrl,
    crypto: {
        secret: process.env.SECRET
      },
      touchAfter:24*3600,
})
// Session and flash configuration (Make sure session is defined before flash)
const sessionOptions = {
    store,
    secret:  process.env.SECRET,
    resave: false, 
    saveUninitialized: true, 
    rolling: true, 
    cookie: {
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
        httpOnly: true, 
    },
};

// Apply session and flash middleware
app.use(session(sessionOptions));
app.use(flash());

// Passport configuration
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Middleware to store flash messages and user info in res.locals for use in views
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currentUser = req.user;
    
    next();
});
app.get("/listings/search", async (req, res, next) => {
    const query = req.query.q; 
    try {
        if (!query) {
            req.flash("error", "Please enter a search term.");
            return res.redirect("/listings");
        }


        const listings = await Listing.find({
            $or: [
                { title: { $regex: query, $options: "i" } }, 
                { country: { $regex: query, $options: "i" } }, 
            ],
        });
        res.render("listings/searchResults", { listings });
    } catch (err) {
        next(err);
    }
});


// Routes
app.get("/", (req, res) => {
    res.render("listings/home.ejs");
});

app.use("/listings", listings);
app.use("/listings/:id/reviews", reviewRoutes);
app.use("/",userRoute);

// 404 Handler
app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page not found"));
});

// Global Error Handler
app.use((err, req, res, next) => {
    const { statusCode = 500, message = "Something went wrong!" } = err;
    if (res.headersSent) {
        return next(err);
    }
    res.status(statusCode).render("error.ejs", { message });
}); 
// Search Route
