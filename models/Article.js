var mongoose = require("mongoose");

// save reference to the Schema constructor
var Schema = mongoose.Schema;

// using Schema constructor, create a new ArticleSchema object
var ArticleSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    link: {
        type: String,
        required: true
    },
    summary: {
        type: String,
        required: true
    },
    // note stores a Note id, ref property links the ObjectId to the Note model which allows us to populate the Article with an associated Note
    note: {
        type: Schema.Types.ObjectId,
        ref: "Note"
    }
});

// create our model from above schema using mongoose's model method
var Article = mongoose.model("Article", ArticleSchema);

// export Article model
module.exports = Article;