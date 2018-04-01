var express = require("express");
var router = express.Router();

var Campground = require('../models/campground');

// INDEX-route(list of all campgrounds)
router.get('/', function(req, res){
  // Get all campgrounds form DB
  Campground.find({}, function(err, allCampgrounds){
    if (err) {
      console.log(err);
    } else {
      res.render('campgrounds/index', {campgrounds: allCampgrounds});
    }
  });
});

// POST Routes
// CREATE-route(Add new campg to DB)
router.post('/', isLoggedIn, function(req, res){
  // get data from form & add to campgrounds array
  var name = req.body.name,
      image = req.body.image,
      desc = req.body.description;
  var author = {
    id: req.user._id,
    username: req.user.username
  }
  var newCampground = {name: name, image: image, description: desc, author: author};
  // Create a new campground and save to Db
  Campground.create(newCampground, function(err, newlyCreated){
    if (err) {
      console.log(err);
    } else {
      // redirect to campgrounds page
      res.redirect('/campgrounds');
    }
  })
});

// NEW-route(shows form to create new campground)
router.get('/new', isLoggedIn, function(req, res){
  res.render('campgrounds/new')
});

// SHOW-route(Detail view) /smth/:id
router.get("/:id", function(req, res){
  // find the campground with provided id
  var camp_id = req.params.id;
  Campground.findById(camp_id).populate("comments").exec(function(err, foundCampground){
    if (err) {
      console.log(err);
    } else {
      // render show template for that capground
      res.render("campgrounds/show", {campground: foundCampground});
    }
  });
  
});

// MIDDLEWARE
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } 
  res.redirect('/login');
}

module.exports = router;