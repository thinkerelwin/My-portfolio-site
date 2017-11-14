var express         = require("express"),
    app             = express(),
    mongoose        = require("mongoose"),
    bodyParser      = require("body-parser"),
    flash           = require("connect-flash"),
    passport        = require("passport"),
    LocalStrategy   = require("passport-local"),
    request         = require("request"), // optional if you don't make api call
    methodOverride  = require('method-override'),
    Blog            = require("./models/post"),
    Comment         = require("./models/comment"),
    User            = require("./models/user");
    // seedDB          = require("./seed");
    
// require routes
var indexRoutes   = require("./routes/index"),
    postRoutes    = require("./routes/posts"),
    commentRoutes = require("./routes/comments");
    
    
// need something like "express-sanitizer"

mongoose.connect("mongodb://localhost/blog");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
// seedDB();

// Passport configuration
app.use(require("express-session")({
  secret: "relentless learning",
  resave: false,
  saveUninitialized: false
}));

// Part about Authentication
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Pass in user ID
app.use(function(req, res, next) {
  res.locals.blogSpecific = req.originalUrl.startsWith("/blogs");
  // res.locals.root = req.baseUrl;
  res.locals.currentUser = req.user;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  console.log(res.locals);
  next();
});


app.use(indexRoutes);
app.use("/blogs", postRoutes);
app.use("/blogs/:id/comments", commentRoutes);


app.listen(process.env.PORT, process.env.IP, function() {
  console.log("Served Normally~");
});
