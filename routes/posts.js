var express = require("express");
var router  = express.Router();
var Blog    = require("../models/post");
// no need of ./middleware/index because if you leave the file name empty,
// node will search "index" automatically
var middleware = require("../middleware");



// blog page
router.get("/", function(req, res) {

  var noMatch = "";
  if (req.query.search) {
    const regex = new RegExp(escapeRegex(req.query.search), 'gi');
    Blog.find({ $or:[ {title: regex}, {content: regex} ]}, function(err, blogs) {
      if(err){
        console.log(err);
      } else {
        if (blogs.length < 1) {
          noMatch = "no posts match this name";
        }
        res.render("blogs/index", {blogs: blogs, noMatch: noMatch}); 
      }
    });
  } else {
    console.log(req.query.search);
    Blog.find({}, function(err, blogs){
      if(err){
        console.log(err);
      } else {
        res.render("blogs/index", {blogs: blogs, noMatch: noMatch}); 
      }
    })
  }

});
// newPost form
router.get("/new", middleware.isLoggedIn, function(req, res) {
  res.render("blogs/newPost");
});
// create post
router.post("/", middleware.isLoggedIn, function(req, res) {
  Blog.create(req.body.blog, function(err, newPost) {
    if (err) {
      console.log(err);
    } else {
      //add username and id to post
      newPost.author.id = req.user._id;
      newPost.author.username = req.user.username;
      newPost.save();
      res.redirect("/blogs");
    }
  });
});

// specific post
router.get("/:id", function(req, res) {
  Blog.findById(req.params.id).populate("comments").exec(function(err, foundblog) {
    if (err || !foundblog) {
      console.log(err);
      // add this because lack of middleware to deliver message
      req.flash("error", "this post doesn't exist!")  
      res.redirect("/blogs");
    } else {
      console.log(foundblog);
      res.render("blogs/post", {blog:foundblog});
    }
  });
});
// editPost form
router.get("/:id/edit",middleware.checkPostOwnership, function(req, res) {
  Blog.findById(req.params.id, function(err, blog) {
      res.render("blogs/editPost", {blog:blog});
  });
});
// update post
router.put("/:id",middleware.checkPostOwnership, function(req, res) {
  Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, blog) {
    if (err) {
      console.log(err);
      res.redirect("/blogs");
    } else {
      res.redirect("/blogs/" + req.params.id);
    }
  });
});
// delete post
router.delete("/:id", middleware.checkPostOwnership, function(req, res) {
  Blog.findByIdAndRemove(req.params.id, function(err, blog) {
    if (err) {
      console.log(err);
      res.redirect("/blogs");
    } else {
      // blog.remove();
      res.redirect("/blogs");
    }
  });
});

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

module.exports = router;