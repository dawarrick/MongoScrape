require("dotenv").config();
var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");

//these are required because of a deprecation issues to stop error message in server
mongoose.set('useUnifiedTopology', true);
mongoose.set('useCreateIndex', true);


// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
var axios = require("axios");
var cheerio = require("cheerio");

// Require all models
var db = require("./models");

var PORT = 3000;

// Initialize Express
var app = express();

// Handlebars
var exphbs = require("express-handlebars");
app.engine(
  "handlebars",
  exphbs({
    defaultLayout: "main"
  })
);
app.set("view engine", "handlebars");

// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));

// Connect to the Mongo DB
//mongoose.connect("mongodb://localhost/MongoScrape", { useNewUrlParser: true });

// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/MongoScrape";

mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

// Routes

// A GET route for scraping the echoJS website
//this will be the default route
app.get("/scrape", function (req, res) {
  console.log('scraping');
  // First, we grab the body of the html with axios
  axios.get("https://news.richmond.edu/releases/index.html").then(function (response) {
    // Then, we load that into cheerio and save it to $ for a shorthand selector
    var $ = cheerio.load(response.data);

    var counter = 0;  //track number added
    var today = new Date();
    var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

    console.log(date+time)
    // Now, we grab every contentWrap, which is the unique part per article and parse

    $(".contentWrap").each(function (i, element) {
      // Save an empty result object
      var result = {};
      // Add the text and href of every link, and save them as properties of the result object
      result.title = $(this)
        .children(".title")
        .text();
      result.summary = $(this)
        .children(".preview")
        .text();
      result.thumbnail = $(this)
        .parent().children(".thumbnail").children(".responsiveImg").attr("data-img-200");
      result.link = $(this)
        .parent("a")
        .attr("href");
      //I want all that are added together to have the same date for sorting.
      result.dateAdded = date + ' '+time;
      //they should at least have a title and a link
      if (result.title && result.link) {
        //Create a new one if it doesn't exist, or update an existing in case something changed with the article
        /*       db.Article.updateOne(
                 { title: result.title }, // query
                 { $set: result },
                 {
                   upsert: true,
                   setDefaultsOnInsert: true
                 }, // options
                 function (err, object) {
                   if (err) {
                     console.warn(err.message);  // returns error if no matching object found
                   } else {
                     console.dir(object);
                   }
                 });*/
      //using create because update and insert was too slow. Also issue with date insert
        db.Article.create(result)
          .then(function (dbArticle) {
            // View the added result in the console
            console.log(dbArticle);
          })
          .catch(function (err) {
            // If an error occurred, log it
            console.log(err);
          });
      }
    });
    // Send a message to the client
    res.send("scraped");
  });
});

// Route for getting all Articles from the db
app.get("/", function (req, res) {
  // Grab every document in the Articles collection. Sort by the most recent first
  db.Article.find({}).sort({ dateAdded: -1, _id: 1 })
    .then(function (dbArticle) {
      // If we were able to successfully find Articles, send them back to the client
      // res.json(dbArticle);
      res.render("index", {
        articles: dbArticle
      });
    })
    .catch(function (err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});


// Route for getting this thing started
/*app.get("/", function (req, res) {
  // Grab every document in the Articles collection
  console.log('getting all articles')
  db.Article.find({})
    .then(function (dbArticle) {
      // If we were able to successfully find Articles, send them back to the client
      // res.json(dbArticle);
      res.render("index", {
        articles: dbArticle
      });
    })
    .catch(function (err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});*/

// Route for grabbing a specific Article by id, populate it with it's note
app.get("/articles/:id", function (req, res) {
  // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
  db.Article.findOne({ _id: req.params.id })
    // ..and populate all of the notes associated with it
    .populate("note")
    .then(function (dbArticle) {
      // If we were able to successfully find an Article with the given id, send it back to the client
      res.render("index", {
        articles: dbArticle
      });
    })
    .catch(function (err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// Route for saving/updating an Article's associated Note
app.post("/articles/:id", function (req, res) {
  // Create a new note and pass the req.body to the entry
  db.Note.create(req.body)
    .then(function (dbNote) {
      // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
      // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
      // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
      return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
    })
    .then(function (dbArticle) {
      // If we were able to successfully update an Article, send it back to the client
      res.render("index", {
        articles: dbArticle
      });
    })
    .catch(function (err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// Start the server
app.listen(PORT, function () {
  console.log("App running on port " + PORT + "!");
});
