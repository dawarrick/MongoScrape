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

console.log("Mongodb_uri: "+MONGODB_URI)
//var MONGODB_URI = process.env.MONGODB_URI || "mongodb://mongoscrape:mongoscrape1@ds143767.mlab.com:43767/heroku_cttt7gwb";
//mongodb://<dbuser>:<dbpassword>@ds143767.mlab.com:43767/heroku_cttt7gwb

var connect = mongoose.connect(MONGODB_URI, { useMongoClient:true });
console.log("connect "+connect)


// Routes

// A GET route for scraping the U of R news website

//this will be the default route

app.get("/", function (req, res) {
  console.log('scraping');
  // First, we grab the body of the html with axios
  axios.get("https://news.richmond.edu/releases/index.html").then(function (response) {
    // Then, we load that into cheerio and save it to $ for a shorthand selector
    var $ = cheerio.load(response.data);

    var counter = 0;  //track number added
    var today = new Date();
    var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

    console.log(date + time)
    // Now, we grab every contentWrap, which is the unique part per article and parse

    $(".contentWrap").each(function (i, element) {
      // Save an empty result object
      var result = {};
      // Add the title, summary, href link, thumbnail (does not always exist) and href of every link
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
      result.dateAdded = date + ' ' + time;
      //they should at least have a title and a link
      if (result.title && result.link) {
        //Create a new one if it doesn't exist, or update an existing in case something changed with the article
        //title is unique identifier
        //using create because update and insert was updating the date added and messing up the sorting.
        db.Article.create(result)
          .then(function (dbArticle) {
            // View the added result in the console
            console.log(dbArticle);
          })
          .catch(function (err) {
            // If an error occurred, log it except if it's a duplicate issue (11000)
            if (err.code !== 11000) {
              console.log(err);
            }
          });
      }
    });
    // Send a message to the client
    res.redirect('/articles');
  });
});


/*app.get("/", function (req, res) {
  // Grab every document in the Articles collection. Sort by the most recent first
  db.Article.find({}).sort({ dateAdded: -1, _id: 1 })
    .populate("note")
    .then(function (dbArticle) {
      // If we were able to successfully find Articles, send them back to the client
      res.render("index", {
        articles: dbArticle
      });
    })
    .catch(function (err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});*/


// Route for getting all Articles from the db
app.get("/articles", function (req, res) {
  // Grab every document in the Articles collection. Sort by the most recent first
  db.Article.find({}).sort({ dateAdded: -1, _id: 1 })
    .populate("note")
    .then(function (dbArticle) {
      // If we were able to successfully find Articles, send them back to the client
      res.render("index", {
        articles: dbArticle
      });
    })
    .catch(function (err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});


// Route for grabbing a specific Article by id, populate it with it's note
app.get("/articles/:id", function (req, res) {
  // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
  db.Article.findOne({ _id: req.params.id })
    // ..and populate all of the notes associated with it
    .populate("note")
    .then(function (dbArticle) {
      // If we were able to successfully find an Article with the given id, send it back to the client
      res.json(dbArticle);
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
      // If a Note was created successfully, find the Article with an `_id` equal to `req.params.id`. add a new Note
      // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
      // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query;
      return db.Article.findOneAndUpdate({ _id: req.params.id }, { $push: { note: dbNote._id } }, { new: true });
    })
    .then(function (dbArticle) {
      // If we were able to successfully update an Article, reload the page
      res.redirect('/articles');
    })
    .catch(function (err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});


app.post("/deletenote/:id", function (req, res) {
  // Delete a note 
  db.Note.deleteOne({ "_id": req.params.id })
    .then(function (dbArticle) {
      // If we were able to successfully update an Article, reload the page
      //res.redirect('/articles');
      res.send(dbArticle);
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
