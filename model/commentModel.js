const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  comment: {
    type: String,
    required: true,
    min: 5,
    max: 2000,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
  post: {
    type: mongoose.Schema.ObjectId,
    ref: "BlogPost",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

commentSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "name",
  });

  next();
});

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;
