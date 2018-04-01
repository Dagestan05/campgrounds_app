var express = require("express");
var router = express.Router({mergeParams: true});

var Campground = require('../models/campground')
var Comment = require('../models/comment')

// comments new
router.get("/new", isLoggedIn, function (req, res) {
  // find campground by ID
  Campground.findById(req.params.id, function (err, campground) {
    if (err) {
      console.log(err);
    } else {
      res.render('comments/new', {campground: campground});
    }
  })
});
// comments create
router.post("/", isLoggedIn, function (req, res) {
  // lookup campground using ID
  Campground.findById(req.params.id, function(err, foundCampground) {
    if (err) {
      console.log(err);
      res.redirect("/campgrounds");
    } else {
      // create new comment
      Comment.create(req.body.comment, function (err, comment) {
        if (err) {
          console.log(err)
        } else {
          // add username and id to comment
          comment.author.id = req.user.id;
          comment.author.username = req.user.username;
          // save the comment
          comment.save();
          // connect new comment to campground
          foundCampground.comments.push(comment);
          foundCampground.save();
          console.log(comment)
          res.redirect("/campgrounds/" + foundCampground._id)
        }
      })
      // redirect to campground show page
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

module.exports = router;