var Blog = require("../models/post");
var Comment = require("../models/comment");

// all the middleare goes here
var middlewareObj = {};

middlewareObj.checkPostOwnership = function(req, res, next) {
  if (req.isAuthenticated()) {
    Blog.findById(req.params.id, function(err, foundPost) {
      if (err || !foundPost) {
        req.flash("error", "this post doesn't exist!")
        res.redirect("back");
      } else {
        if (foundPost.author.id.equals(req.user._id)) {
          next();
        } else {
          req.flash("error", "Only owner can do this");
          res.redirect("back");
        }
      }
    });
  } else {
    req.flash("error", "Please logged in first~");
    res.redirect("back");
  }
};

middlewareObj.checkCommentOwnership = function(req, res, next) {
  if (req.isAuthenticated()) {
    Comment.findById(req.params.comment_id, function(err, foundComment) {
      if (err || !foundComment) {
        req.flash("error", "this comment doesn't exist!");
        res.redirect("back");
      } else {
        if (foundComment.author.id.equals(req.user._id)) {
          next();
        } else {
          req.flash("error", "Only owner can do this");
          res.redirect("back");
        }
      }
    })
  } else {
    req.flash("error", "Please logged in first~");
    res.redirect("back");
  }
};

middlewareObj.isLoggedIn = function(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash("error", "Please logged in first~");
  res.redirect("/login");
};

module.exports = middlewareObj;