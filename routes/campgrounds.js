var express = require("express");
var router = express.Router();
var Campgrounds = require("../models/campground");
var middleware = require("../middleware");

//campgrounds page
router.get("/", function(req,res){
    console.log(req.user);
   console.log("campgrounds accessed");
   //mengambil semua data camp pada database
         Campgrounds.find({}, function(error, allCampgrounds){
          if(error){
              console.log("Something is Wrong");
          }
          else{
              console.log("Success retrieving campground");
                 res.render("campgrounds/index", {campSites : allCampgrounds, currentUser : req.user});
          }
        });
});

//campgrounds create form
router.get("/new", middleware.isLoggedIn, function(req, res) {
   console.log("add campgrounds accessed");
   res.render("campgrounds/new");
});

//campgrounds POSTroute
router.post("/", middleware.isLoggedIn ,function(req,res){
   console.log("Input Campground accessed ");
   var campground_name = req.body.campground_name;
   var campground_price = req.body.campground_price;
   var campground_image = req.body.campground_image;
   var campground_description = req.body.campground_description;
   var author ={
       id : req.user._id,
       username: req.user.username
   };
   var newCampSites = {name : campground_name, price : campground_price, image : campground_image, description : campground_description, author : author};
   //create a new campground and save to database
   Campgrounds.create(newCampSites, function(err, newlyCreated){
       if(err){
           console.log(err);
       }
       else{
           console.log(newlyCreated);
           req.flash("success", "Campground Created");
            res.redirect("/campgrounds");
       }
   });
});

//campgrounds show
router.get("/:id",  function(req, res) {
   console.log("accessed the campgrounds id");
  Campgrounds.findById(req.params.id).populate("comments").exec(function(err, foundCampground ){
      if(err){
          console.log("===Error at Campgrounds ID===");
      }else{
          console.log(foundCampground);
          res.render("campgrounds/show", {foundCampground : foundCampground });
      }
  })
});

//edit campground
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res) {
        Campgrounds.findById(req.params.id , function(err, foundCampground){
            if(err){
                console.log(err);
            }
            res.render("campgrounds/edit", {campground : foundCampground });
        });
});

//update campground
router.put("/:id", middleware.checkCampgroundOwnership,function(req,res){
    console.log(req.body.campground);
     Campgrounds.findByIdAndUpdate(req.params.id, req.body.campground, function(err,updatedCampground){
       if(err){
           res.redirect("/campgrounds");
       }
       else{
           req.flash("success", "Campground Updated");
           res.redirect("/campgrounds/" + req.params.id);
       }
   });
})

//destroy campground
router.delete("/:id", middleware.checkCampgroundOwnership, function(req,res){
Campgrounds.findByIdAndRemove(req.params.id, function(err){
    if(err){
        console.log(err);
        res.redirect("/campgrounds");
    }
    else{
        req.flash("success", "Campground Deleted!");
        res.redirect("/campgrounds");
    }
})
})



module.exports = router;