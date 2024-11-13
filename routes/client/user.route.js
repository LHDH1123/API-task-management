const express = require("express");
const router = express.Router();
const controller = require("../../controllers/client/user.controller");
const authMiddeware = require("../../middlewares/auth.middeware");

router.post("/register", controller.register);

router.post("/login", controller.login);

router.post("/password/forgot", controller.forgotPassword);

router.post("/password/otp", controller.otp);

router.post("/password/reset", controller.reset);

router.get("/detail", authMiddeware.requireAuth, controller.detail);

router.get("/list", authMiddeware.requireAuth, controller.listUser);


module.exports = router;
