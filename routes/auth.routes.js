const express = require("express");
const router = express.Router();
const authApiController = require("../controllers/indexController");

// Correct usage — pass function reference, not execution
router.post("/signup", authApiController.signup);
router.post("/verify-otp", authApiController.verifyOtp);

module.exports = router;
