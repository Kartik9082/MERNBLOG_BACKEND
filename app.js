const express = require("express");
const morgan = require("morgan");
const userRouter = require("./routes/userRoutes");
const blogRouter = require("./routes/blogPostRoutes");
const commentRouter = require("./routes/commentPostRoutes");
const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");
const cors = require("cors");
const path = require("path");

const app = express();
app.use("/public", express.static(path.join(__dirname, "public")));
app.use(morgan("dev"));
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use("/api/v1/users", userRouter);
app.use("/api/v1/blogPost", blogRouter);
app.use("/api/v1/comments", commentRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`can't find${req.originalUrl} on the server`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
