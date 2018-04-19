var express = require("express");
var router = express.Router();
var middleware = require('../middleware');
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
router.post('/', middleware.isLoggedIn, function(req, res){
  // get data from form & add to campgrounds array
  var name = req.body.name,
      price = req.body.price,
      image = req.body.image,
      desc = req.body.description;
  var author = {
    id: req.user._id,
    username: req.user.username
  }
  var newCampground = {name: name, price: price, image: image, description: desc, author: author};
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
router.get('/new', middleware.isLoggedIn, function(req, res){
  res.render('campgrounds/new')
});

// SHOW-route(Detail view) /smth/:id
router.get("/:id", function(req, res){
  // find the campground with provided id
  var camp_id = req.params.id;
  Campground.findById(camp_id).populate("comments").exec(function(err, foundCampground){
    if (err || !foundCampground) {
      req.flash("errorMsg", 'Campground not found');
      res.redirect("back")
    } else {
      // render show template for that capground
      res.render("campgrounds/show", {campground: foundCampground});
    }
  });
  
});


// EDIT CAMPGROUND ROUTE
router.get('/:id/edit', middleware.checkCampgroundOwnership, function(req, res) {
    Campground.findById(req.params.id, function(err, foundCampground) {
      res.render('campgrounds/edit', {campground: foundCampground});
    });
  
});
// UPDATE CAMPGROUND RUTE
router.put('/:id', middleware.checkCampgroundOwnership, function(req, res){
  // find and update the correct campground
  Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground) {
    if (err) {
      console.log(err);
      res.redirect("/campgrounds");
    } else {
      res.redirect('/campgrounds/' + req.params.id)
    }
  })
  // redirect to show page
})

// Delete route
router.delete("/:id", middleware.checkCampgroundOwnership, function (req, res) {
  Campground.findByIdAndRemove(req.params.id, function(err) {
    if (err) {
      res.redirect("/campgrounds");
    } else {
      res.redirect('/campgrounds');
    }
  })
})


// MIDDLEWARE




module.exports = router;