var mongoose = require("mongoose");

// save refefrence to Schema constructor
var Schema = mongoose.Schema;

// using Schema constructor, create new NoteSchema object
var NoteSchema = new Schema({
    title: String,
    body: String
});

// create model from above schema using mongoose's model method
var Note = mongoose.model("Note", NoteSchema);

// export Note model
module.exports = Note;