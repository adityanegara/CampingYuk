var Campgrounds= require("../models/campground");
var Comment= require("../models/comment");

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}
var middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function(req, res, next){
      if(req.isAuthenticated()){
        Campgrounds.findById(req.params.id , function(err, foundCampground){
        if(err){ 
            req.flash("error", "Campground Not Found");
         console.log(err);
         res.redirect("back");
        }
        else{
          console.log(foundCampground.author.id); //ini ialah mongoose object bukan STRING
          console.log(req.user._id);
            if(foundCampground.author.id.equals(req.user._id)){
                next();
            }
            else{
                req.flash("error", "You Do Not Have Permission to Do That");
                res.redirect("back");
            }
        }
        }); 
    }
    else{
        res.redirect("back");
    }
};

middlewareObj.checkCommentOwnership = function(req, res , next){
      if(req.isAuthenticated()){
                Comment.findById(req.params.comment_id , function(err, foundComment){
                    if(err){ 
                        console.log(err);
                        res.redirect("back");
                    }
                    else{
                         console.log(foundComment.author.id); //ini ialah mongoose object bukan STRING
                         console.log(req.user._id);
                             if(foundComment.author.id.equals(req.user._id)){
                                next();
                             }
                             else{
                                 req.flash("error", "You do not have permission to do that");
                                 res.redirect("back");
                             }
                    }
                }); 
    }
    else{
        req.flash("error", "You Need To Be Logged In To do That");
        res.redirect("back");
    }
};

middlewareObj.isLoggedIn = function(req , res ,next){
     if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "Yout Need To Be Logged In To Do That");
    
    res.redirect("/login");
}

module.exports = middlewareObj;