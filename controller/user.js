const User = require("../models/user.js");
module.exports.renderSignupform=(req, res) => {
    res.render("users/signup.ejs");
}
module.exports.signup=async (req, res) => {
    let { username, email, password } = req.body;
    const newUser = new User({ email, username });

    try {
        const registeredUser = await User.register(newUser, password);
        console.log(registeredUser);
        req.login(registeredUser,(err)=>{
            if(err){
                return next(err);
            }
            req.flash("success", "Successfully registered! Please log in.");
            res.redirect("/listings");  // Redirect to login page after successful registration
        })
       
    } catch (err) {
        console.log("Registration Error: ", err);
        req.flash("error", "An error occurred during registration. Please try again.");
        res.redirect("/signup");  // Redirect back to signup page if error occurs
    }
}
module.exports.renderloginFrom=(req, res) => {
    res.render("users/login.ejs");
}
module.exports.loginpost= async(req, res) => {
    req.flash("success", "Welcome! You have successfully logged in.");
    let redirectUrl=res.locals.redirectUrl || "/listings"
    res.redirect(redirectUrl);
}
module.exports.logout=(req,res,err)=>{
    req.logout((err=>{
if(err){
    next(err)
}
req.flash("success","you have logged out now");
res.redirect("/listings");
    }))
}