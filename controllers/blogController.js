const BlogPost = require("./../model/blogPostModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const APIFeatures = require("./../utils/apiFeatures");
const multer = require("multer");

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/blog-image");
  },

  filename: (req, file, cb) => {
    const ext = file.mimetype.split("/")[1];
    cb(null, `user-${req?.user?.id}-${Date.now()}.${ext}`);
  },
});

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Not an image! Please upload only images.", 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

exports.uploadBlogImage = upload.single("blogImage");

exports.getAllPosts = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(BlogPost.find(), req.query)
    .filter()
    .sorting()
    .limiting()
    .paginate();

  const posts = await features.query;
  res.status(200).json({
    status: "success",
    results: posts.length,
    data: {
      posts,
    },
  });
});

exports.createPost = catchAsync(async (req, res, next) => {
  let blogImage;

  // Check if a file is uploaded
  if (req.file) {
    blogImage = `/public/blog-image/${req.file.filename}`;
  }

  // Create a new blog post with or without an image file
  const post = await BlogPost.create({
    title: req.body.title,
    content: req.body.content,
    blogImage: blogImage || req.body.blogImage, // Save the filename of the uploaded image if available
    author: req.body.author, // Include the author field
  });

  res.status(201).json({
    status: "success",
    data: {
      post,
    },
  });
});

exports.getPost = catchAsync(async (req, res, next) => {
  const post = await BlogPost.findById(req.params.id);
  if (!post) {
    return next(new AppError("No post found with that ID", 404));
  }
  res.status(200).json({
    status: "success",
    data: {
      post,
    },
  });
});

exports.updatePost = catchAsync(async (req, res, next) => {
  const post = await BlogPost.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!post) {
    return next(new AppError("No post found with that ID", 404));
  }
  res.status(200).json({
    status: "success",
    data: {
      post,
    },
  });
});

exports.deletePost = catchAsync(async (req, res, next) => {
  const post = await BlogPost.findByIdAndDelete(req.params.id);
  if (!post) {
    return next(new AppError("No post found with that ID", 404));
  }
  res.status(204).json({
    status: "success",
    data: null,
  });
});
