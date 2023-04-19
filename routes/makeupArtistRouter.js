const makeupArtist = require("../controllers/makeupAdminController");
const express = require("express");
const router = express.Router();
const { isAuth } = require("../controllers/customerAuthController");


router.get("/edit/:id",isAuth, makeupArtist.show)
router.post("/", isAuth, makeupArtist.create);
router.get("/:locationId", isAuth, makeupArtist.findMakeupArtistByLocation);
router.get("/admin/:makeupArtistId", isAuth, makeupArtist.findAppointmentByMakeupArtistId);
router.put("/:makeupArtistId", isAuth, makeupArtist.updateMakeupArtist);
router.delete("/:id",isAuth, makeupArtist.deleteMakeupArtist)



module.exports = router;
