var express = require("express");
var router = express.Router();
var Campgrounds = require("../models/campground");
var middleware = require("../middleware");
var multer = require('multer');
var multer = require('multer');
var storage = multer.diskStorage({
  filename: function(req, file, callback) {
    callback(null, Date.now() + file.originalname);
  }
});
var imageFilter = function (req, file, cb) {
    // accept image files only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};
var upload = multer({ storage: storage, fileFilter: imageFilter})

var cloudinary = require('cloudinary');
cloudinary.config({ 
  cloud_name: 'dmmiplsmt', 
  api_key: '684968883642256', 
  api_secret: 'evV9H23DzXcMVYnHx_pnLH31rUw'
});

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
router.post("/", middleware.isLoggedIn, upload.single('campground[image]'), function(req, res) {
  cloudinary.v2.uploader.upload(req.file.path, function(err, result) {
    if(err) {
      req.flash('error', err.message);
      return res.redirect('back');
    }
    // add cloudinary url for the image to the campground object under image property
    req.body.campground.image = result.secure_url;
    // add image's public_id to campground object
    req.body.campground.imageId = result.public_id;
    // add author to campground
    req.body.campground.author = {
      id: req.user._id,
      username: req.user.username
    }
    Campgrounds.create(req.body.campground, function(err, campground) {
      if (err) {
        req.flash('error', err.message);
        return res.redirect('back');
      }
      res.redirect('/campgrounds/' + campground.id);
    });
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
          res.render("campgrounds/show", {campground : foundCampground });
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
router.put("/:id", middleware.checkCampgroundOwnership,upload.single('campground[image]'), async function(req,res){
    console.log(req.body.campground);
  
     Campgrounds.findById(req.params.id, async function(err,campground){
       if(err){
            req.flash("err", "Error update campground");
           res.redirect("/campgrounds");
       }
       else{
         if(req.file){
           try{
            await cloudinary.v2.uploader.destroy(campground.imageId)
            var result = await cloudinary.v2.uploader.upload(req.file.path)
            campground.imageId = result.public_id;
            campground.image   = result.secure_url;
           }catch(err){
            req.flash("err", "Error update campground");
            return res.redirect("/campgrounds");
           }
         
              
         
         }
          campground.name = req.body.campground.name;
          campground.location = req.body.campground.location;
          campground.locationIframe = req.body.campground.locationIframe;
          campground.price = req.body.campground.price;
          campground.phoneNumber = req.body.campground.phoneNumber;
          campground.description = req.body.campground.description;
          campground.save();
           req.flash("success", "Campground Updated");
           res.redirect("/campgrounds/" + req.params.id);
       }
   });
})

//destroy campground
router.delete("/:id", middleware.checkCampgroundOwnership, function(req,res){
Campgrounds.findById(req.params.id,  async function(err, campground){
    if(err){
        console.log(err);
        res.redirect("/campgrounds");
    }
    try{
      await cloudinary.v2.uploader.destroy(campground.imageId);
      campground.remove();
      req.flash('success', 'Campground Deleted');
      res.redirect('/campgrounds');
    }catch(err){
      req.flash('error', 'Error Deleting Campground ');
      res.redirect('/campgrounds');
    }
})
})



module.exports = router;