var express = require("express");
var router = express.Router();

var passport = require('passport');
var User = require('../models/user');

// root route
router.get('/', function(req, res){
  res.render('landing')
});



// show register form
router.get("/register", function(req, res){
  res.render("register");
});
// handle sign up logic
router.post('/register', function(req, res) {
  var newUser = new User({username: req.body.username});
  User.register(newUser, req.body.password, function(err, user) {
    if (err) {
      console.log(err);
      req.flash("errorMsg", "error was there");
      // req.flash("errorMsg", err.message);
      return res.render("register");
    }
    passport.authenticate('local')(req, res, function() {
      req.flash("successMsg", "Welcome to YelpCamp  " + user.username);
      res.redirect('/campgrounds');
    })
  })
});
 
// LOGIN Routes - Show
router.get("/login", function(req, res){
  res.render('login');
});

// handling login logic
// app.post('/login', middleware, callback) using passport.use(new localStrategy(User.authenticate()));
router.post('/login', passport.authenticate('local',
          {
            successRedirect: '/campgrounds',
            failureRedirect: '/login'
          }), function(req, res) {
  
});
// LOgout route
router.get('/logout', function(req, res) {
  req.logout();
  req.flash('successMsg', "Logged you out");
  res.redirect('/campgrounds');
})



module.exports = router;