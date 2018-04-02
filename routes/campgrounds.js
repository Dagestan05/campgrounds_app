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


// EDIT CAMPGROUND ROUTE
router.get('/:id/edit', checkCampgroundOwnership, function(req, res) {
    Campground.findById(req.params.id, function(err, foundCampground) {
      res.render('campgrounds/edit', {campground: foundCampground});
    });
  
});
// UPDATE CAMPGROUND RUTE
router.put('/:id', checkCampgroundOwnership, function(req, res){
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
router.delete("/:id", checkCampgroundOwnership, function (req, res) {
  Campground.findByIdAndRemove(req.params.id, function(err) {
    if (err) {
      res.redirect("/campgrounds");
    } else {
      res.redirect('/campgrounds');
    }
  })
})


// MIDDLEWARE
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } 
  res.redirect('/login');
}

function checkCampgroundOwnership(req, res, next) {
  // is user logged in?
  if (req.isAuthenticated()) {
    Campground.findById(req.params.id, function(err, foundCampground) {
      if (err) {
        res.redirect("back");
      } else {
        // does user own this campground //equals() is a mongoose method
        if (foundCampground.author.id.equals(req.user._id)) {
          next();
        } else {
          res.redirect('back')
        }
      }
    });
  } else {
    res.redirect("back");
  }
  // if not, redirect
}

module.exports = router;