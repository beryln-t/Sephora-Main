const appointmentController = require("../controllers/appointmentController");
const {isAuth} = require("../controllers/customerAuthController")
const express = require("express");
const router = express.Router();

router.delete("/:id", isAuth, appointmentController.deleteAppointment);
router.post("/:customerName/:date", isAuth, appointmentController.createAppointmentWithLimit)
router.get("/:id/:date", isAuth, appointmentController.findAppointmentByDate);
router.get("/:customerName",  isAuth, appointmentController.findAppointmentByCustomerName);

module.exports = router;