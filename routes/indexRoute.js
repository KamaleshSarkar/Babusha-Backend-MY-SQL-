const express = require("express");
const router = express.Router();

// Example: simple test route
router.get("/", (req, res) => {
  res.send({ message: "Welcome to Babusa API" });
});

module.exports = router;
