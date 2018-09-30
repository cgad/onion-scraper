var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");

// scraping tools
var axios = require("axios");
var cheerio = require("cheerio");

// require all models
var db = require("./models");

var PORT = process.env.PORT || 3000;

// initialize express
var app = express();

// morgan logger for logging requests
app.use(logger("dev"));
// body-parser for handling for submissions-- extended: true for testing
app.use(bodyParser.urlencoded({ extended: true }));
// express.static to serve public folder as static directory
app.use(express.static("public"));

// connect to the mongo db
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoOnion";
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);

// routes

// GET route for scraping website
app.get("/scrape", function(req, res) {
    axios.get("https://politics.theonion.com/").then(function(response) {
        // load into cheerio as shorthand selector
        var $ = cheerio.load(response.data);

        // grab every article tag
        $("article").each(function(i, element) {
            // save an empty result object
            var result = {};

            // get into nesting and save title, link and summary to result object
            result.title = $(this)
                .children("header")
                .children("h1")
                .children("a")
                .text();
            result.link = $(this)
                .children("header")
                .children("h1")
                .children("a")
                .attr("href");
            result.summary = $(this)
                .children("div")
                .children("div")
                .children("p")
                .text();
            // console.log(result);

            // create new Article using the "result" object built from scraping
            db.Article.create(result)
                .then(function(dbArticle) {
                    // view added result in the console
                    console.log(dbArticle);
                })
                .catch(function(err) {
                    return res.json(err);
                });
        })

        // send message to client if we successfully scraped and saved an Article
        res.send("Scrape Complete");
    });
});

// to get all Articles from our db
app.get("/articles", function(req, res) {
    // grab every document in the Articles collection
    db.Article.find({})
        .then(function(dbArticle) {
            // if successful, send articles back to client
            res.json(dbArticle);
        })
        .catch(function(err) {
            res.json(err);
        });
});

// to grab specific Article by Id and populate with its note
app.get("/articles/:id", function(req, res) {
    // using the id passed in the id parameter, prepare a query that finds the matching Id in our db
    db.Article.findOne({ _id: req.params.id })
        // then populate all the notes associated with that Id
        .populate("note")
        .then(function(dbArticle) {
            // if successful, send back to client
            res.json(dbArticle);
        })
        .catch(function(err) {
            res.json(err);
        });
});

// to save/update an Article's Note
app.post("/articles/:id", function(req, res) {
    db.Note.create(req.body)
        .then(function(dbNote) {
            // if Note creation successful, find Article with matching id and update that Article to be associated with the new Note
            // { new: true } -- return the updated Article instead of the original
            return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
        })
        // chain another .then to receive the result of the query
        .then(function(dbArticle) {
            // if successful, send updated Article back to client
            res.json(dbArticle);
        })
        .catch(function(err) {
            res.json(err);
        });
});

// start the server
app.listen(PORT, function() {
    console.log("App running on port " + PORT);
});