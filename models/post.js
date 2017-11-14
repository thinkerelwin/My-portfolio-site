var mongoose = require("mongoose");

var postSchema = new mongoose.Schema({
  author: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    username: String,
  },
  title: String,
  content: String,
  image: String,
  tag: String,
  created: {type: Date, default: Date.now},
  comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment"
      }
    ]
  // modified: {type: Date, default: Date.now}
});

module.exports = mongoose.model("Blog", postSchema);