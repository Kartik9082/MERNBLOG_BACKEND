const express = require("express");
const authController = require("./../controllers/authController");
const userController = require("./../controllers/userController");

const router = express.Router();

router.post("/signup", authController.signup);
router.post("/login", authController.login);

router.get(
  "/me",
  authController.protect,
  userController.getMe,
  userController.getUser
);
router.patch(
  "/updateMe",
  authController.protect,
  userController.uploadUserPhoto,
  userController.updateMe
);

router.patch("/deleteMe", authController.protect, userController.deleteMe);

router.route("/").get(authController.protect, userController.getAllUsers);

router.route("/:id").get(userController.getUser);

module.exports = router;
