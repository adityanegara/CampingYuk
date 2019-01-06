var express = require("express");
var router = express.Router({mergeParams : true});
var Campgrounds = require("../models/campground");
var Comment = require("../models/comment");
var User = require("../models/user");
var middleware = require("../middleware");

//Comments New
router.get("/new",middleware.isLoggedIn, function(req,res){
    console.log("accessed the new comment");
    Campgrounds.findById(req.params.id, function(err,campground){
        if(err){
          
            console.log(err);
        }
        else{
             res.render("comments/new", {campground : campground});
        }
    })
}); 


//Comments Create
router.post("/",middleware.isLoggedIn,function(req, res){
   //lookup campground using ID
   Campgrounds.findById(req.params.id, function(err, campground){
       if(err){
           console.log(err);
           res.redirect("/campgrounds");
       } else {
        Comment.create(req.body.comment, function(err, comment){
           if(err){
               req.flash("error", "Something went wrong");
               console.log(err);
           } else {
               //add username and id to comment
               comment.author.id = req.user._id;
               comment.author.username = req.user.username;
               //save comment
               comment.save();
               campground.comments.push(comment);
               campground.save();
               console.log(comment);
               req.flash("success", "Success Add a Comment");
               res.redirect('/campgrounds/' + campground._id);
           }
        });
       }
   });
});

//Comment edit
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
    Comment.findById(req.params.comment_id, function(err, foundComment) {
        if(err){
            res.redirect("back");
        }
        else{
         res.render("comments/edit", {campground_id : req.params.id, comment : foundComment});
        }
        
    })
 
});

//comments update route
router.put("/:comment_id",middleware.checkCommentOwnership, function(req,res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err,updatedComment){
        if(err){
            res.redirect("back");
        }
        else{
            req.flash("success", "Success Edit a Comment");
            res.redirect("/campgrounds/" + req.params.id);
        }
    })
});

//destroy route
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req,res){
    //findby ID
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            res.redirect("back");
        }
        else{
            req.flash("success", "Success Remove a Comment");
            res.redirect("/campgrounds/"+req.params.id);
        }
    })
});


function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}



module.exports = router;