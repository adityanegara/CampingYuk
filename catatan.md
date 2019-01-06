RESTFUL ROUTE


Name         url              verb      description
====================================================
INDEX       /campgrounds       GET      get all campground
NEW         /campgrounds/new   GET      display form to make campground
CREATE      /campgrounds       POST     Add a new campground to database
SHOW        /campgrounds/:id   GET      Show info about 1 campground

1. membuat flash message
2. npm install connect-flash --save
3. git remote add origin https://github.com/BooleanMan23/YelpCamp.git
git push -u origin master