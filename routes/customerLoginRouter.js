const customerController = require("../controllers/customerController");
const express = require("express");
const router = express.Router();

router.post("/signup", customerController.create);
router.post("/login", customerController.login)
router.post("/forget", customerController.resetPassword)

module.exports = router;
