var express = require("express");
var router  = express.Router();
var passport = require("passport");
var User = require("../models/user");

// Landing page
router.get("/", function(req, res) {
  res.render("landing");
});

// About page
router.get("/about", function(req, res) {
  res.render("about");
});


// Portfolio page
router.get("/portfolio", function(req, res) {
  res.render("portfolio");
});

//  ===========
// AUTH ROUTES
//  ===========

// new register form
router.get("/register", function(req, res) {
  res.render("register");
});

// create user
router.post("/register", function(req, res) {
  var newUser = new User({username: req.body.username});
  User.register(newUser, req.body.password, function(err, newUser) {
    if (err) {
      console.log(err);
      res.redirect("/register", {error: err.message});
    } else {
      passport.authenticate("local")(req, res, function() {
        req.flash("success", "Welcome!" + newUser.username);
        res.redirect("/blogs");
      });
    };
  });
});

// login form
router.get("/login", function(req, res) {
    res.render("login");
});

// let user logged in
router.post("/login", passport.authenticate("local", 
  {
    successRedirect: "/blogs",
    failureRedirect: "/login",
    
    failureFlash: true,
    successFlash: "Welcome back!",
  }), function(req, res){
});

// logout function
router.get("/logout", function(req, res) {
  req.logout();
  req.flash("success", "Goodbye, have a nice day!");
  res.redirect("/blogs");
})


module.exports = router;