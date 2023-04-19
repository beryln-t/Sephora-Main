const calendarController = require("../controllers/calendarController");
const express = require("express");
const {isAuth} = require("../controllers/customerAuthController")
const router = express.Router();

router.get("/:id", isAuth,  calendarController.getMakeupArtistsByLocation);
router.get("/", isAuth,  calendarController.showAllLocation);
module.exports = router;
