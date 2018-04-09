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
          res.redirect("/campgrounds/" + foundCampground._id)
        }
      })
      // redirect to campground show page
    }
  })
  
})
// NESTED COMMENT EDIT ROUTES
router.get("/:comment_id/edit", checkCommentOwnership, function(req, res) {
  Comment.findById(req.params.comment_id, function(err, foundComment) {
    if (err) {
      res.redirect("back");
    } else {
      res.render('comments/edit', {campgroundId: req.params.id, comment: foundComment});
    }
  })
})
// Comment UPDATE
router.put("/:comment_id", checkCommentOwnership, function(req, res) {
  Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment) {
    if (err) {
      res.redirect('back');
    } else {
      res.redirect('/campgrounds/' + req.params.id);
    }
  })  
})

// COMMENTS DESTROY ROUTE
router.delete('/:comment_id', checkCommentOwnership, function(req, res) {
  Comment.findByIdAndRemove(req.params.comment_id, function(err) {
    if (err) {
      res.redirect('back')
    } else{
      res.redirect('/campgrounds/' + req.params.id);
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

function checkCommentOwnership(req, res, next) {
  // is user logged in?
  if (req.isAuthenticated()) {
    Comment.findById(req.params.comment_id, function(err, foundComment) {
      if (err) {
        res.redirect("back");
      } else {
        // does user own this comment //equals() is a mongoose method
        if (foundComment.author.id.equals(req.user._id)) {
          next();
        } else {
          res.redirect('back')
        }
      }
    });
  } else {    
  // if not, redirect
    res.redirect("back");
  }
}

module.exports = router;