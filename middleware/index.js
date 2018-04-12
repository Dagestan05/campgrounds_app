// naming it index.js so we dont need to cal it, and we call it wth the dir nme only
// all of the middleware

var Campground = require('../models/campground');
var Comment = require('../models/comment');

var middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function(req, res, next) {
    // is user logged in?
    if (req.isAuthenticated()) {
      Campground.findById(req.params.id, function(err, foundCampground) {
        if (err || !foundCampground) {
          req.flash("errorMsg", "Campground not found");
          res.redirect("back");
        } else {
          // does user own this campground //equals() is a mongoose method
          if (foundCampground.author.id.equals(req.user._id)) {
            next();
          } else {
            req.flash("errorMsg", "You dont have permission to do that");
            res.redirect('back')
          }
        }
      });
    } else {
      req.flash("errorMsg", "You need to be logged in");
      // if not, redirect
      res.redirect("back");
    }
};

middlewareObj.checkCommentOwnership = function(req, res, next) {
  // is user logged in?
  if (req.isAuthenticated()) {
    Comment.findById(req.params.comment_id, function(err, foundComment) {
      if (err || !foundComment) {
        req.flash("errorMsg", "Comment not found")
        res.redirect("back");
      } else {
        // does user own this comment //equals() is a mongoose method
        if (foundComment.author.id.equals(req.user._id)) {
          next();
        } else {
          req.flash("errorMsg", "No permission to do that");
          res.redirect('back')
        }
      }
    });
  } else {    
    req.flash("errorMsg", "You need to be logged in to do that");
  // if not, redirect
    res.redirect("back");
  }
};

middlewareObj.isLoggedIn = function(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash("errorMsg", 'You need to be logged in to do that');
  res.redirect('/login');
}

module.exports = middlewareObj