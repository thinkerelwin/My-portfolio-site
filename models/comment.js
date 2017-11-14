var mongoose = require("mongoose");

var commentSchema = new mongoose.Schema({
  author: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    username: String,
  },
  opinion: String,
  created: {type: Date, default: Date.now}
  // modified: {type: Date, default: Date.now}
});

module.exports = mongoose.model("Comment", commentSchema);