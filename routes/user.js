const express = require("express");
const Router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controller/user.js");

// Signup routes
Router.route("/signup")
    .get(userController.renderSignupform) // Render signup form
    .post(wrapAsync(userController.signup)); // Handle signup form submission

// Login routes
Router.route("/login")
    .get(userController.renderloginFrom) // Render login form
    .post(
        saveRedirectUrl,
        passport.authenticate("local", {
            failureRedirect: "/login",
            failureFlash: "Invalid credentials. Please try again.",
        }),
        userController.loginpost
    ); // Handle login form submission

// Logout route
Router.get("/logout", userController.logout);

module.exports = Router;
