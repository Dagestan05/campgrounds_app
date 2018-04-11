// naming it index.js so we dont need to cal it, and we call it wth the dir nme only
// all of the middleware

var Campground = require('../models/campground');
var Comment = require('../models/comment');

var middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function(req, res, next) {
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
      // if not, redirect
      res.redirect("back");
    }
};

middlewareObj.checkCommentOwnership = function(req, res, next) {
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
};

middlewareObj.isLoggedIn = function(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } 
  res.redirect('/login');
}

module.exports = middlewareObj