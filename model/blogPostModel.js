const mongoose = require("mongoose");

const blogPostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  author: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  blogImage: {
    type: String,
    required: false,
  },
  comments: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Comment",
    },
  ],

  likes: {
    type: Array,
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  updatedAt: [
    {
      type: Date,
      default: Date.now(),
    },
  ],
});

blogPostSchema.pre(/find/, function (next) {
  this.populate({
    path: "author",
    select: "name",
  }).populate({
    path: "comments",
    select: "comment user",
    populate: {
      path: "user",
      select: "name",
    },
  });
  next();
});

const BlogPost = mongoose.model("BlogPost", blogPostSchema);

module.exports = BlogPost;
