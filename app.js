
var express               = require("express");
var bodyParser            = require("body-parser");
var mongoose              = require("mongoose");
var flash                 = require("connect-flash");
var Campgrounds           = require("./models/campground");
var Comment               = require("./models/comment"); 
var passport              = require("passport");
var passportLocalMongoose = require("passport-local-mongoose");
var LocalStrategy         = require("passport-local");
var User                  = require("./models/user");
var seedDB                = require("./seed");
var campgroundRoutes      = require("./routes/campgrounds");
var authenticationRoutes  = require("./routes/authentication");
var commentRoutes         = require("./routes/comments");
var methodOverride        = require("method-override");


mongoose.connect("mongodb://localhost/yelp_camp" , { useNewUrlParser: true });
var app         = express();

app.use(methodOverride("_method"));
app.use(bodyParser.urlencoded({extended : true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname +"/public"));
app.use(flash());
//PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "adityanegara1514215",
    resave: false,
    saveUninitialized : false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use("/campgrounds", campgroundRoutes);
app.use(authenticationRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);


var server = app.listen(3000, function(){
    console.log('server is running on port' + server.address().port);
})
