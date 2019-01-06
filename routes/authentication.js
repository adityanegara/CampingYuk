var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");
var middleware = require("../middleware");

//root route
router.get("/",function(req,res){
    console.log("home accessed");
    res.render("home");
});
//register page
router.get("/register", function(req, res) {
    res.render("register");
});
//register route
router.post("/register", function(req, res) {
       console.log("===/register POST accessed");
       User.register(new User({username : req.body.username}), req.body.password , function(err,user){
          if(err){
              console.log(err.message);
              req.flash("error", err.message);
              
              res.redirect("/register");
               
          } 
          else{
              passport.authenticate("local")(req, res, function(){
                  req.flash("success", "Welcome to YelpCamp "+user.username  );
                  res.redirect("/campgrounds");
              });
          }
    });
});

//login page
router.get("/login", function(req, res) {
    console.log("=== /login accessed ====")
    res.render("login");
})
//login route
router.post("/login", passport.authenticate("local", {
        successRedirect : "/campgrounds" , 
        successFlash: "Login Success!" ,
        failureRedirect : "/login",
        failureFlash: 'Invalid username or password.'
    }),function(req,res){
        
    
});

//logout
router.get("/logout", function(req, res) {
    req.logout();
    req.flash("success", "You Have Logged Out");
    res.redirect("/campgrounds");
});


module.exports = router;
