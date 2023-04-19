const Appointment = require("../models/appointmentModel");
const MakeupArtist = require("../models/makeupArtistModel")
const moment = require("moment");


const create = async (req, res) => {
  try {
    const createMakeupArtist = await MakeupArtist.create(req.body);
    console.log(req.body);
    const newMakeupArtist = await createMakeupArtist.save();
    console.log(newMakeupArtist);
    res.status(200).json(newMakeupArtist);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteMakeupArtist = async (req, res) => {
    const { id } = req.params;
    console.log(id);
  
    try {
      await Appointment.deleteMany({ "makeupArtist.id": id });
  
      // Find and delete the makeup artist
      const findMakeUpArtist = await MakeupArtist.findByIdAndDelete(id);
  
      if (!findMakeUpArtist) {
        return res.status(404).json({ error: "Makeup Artist not found" });
      }
  
      res.status(200).json({ message: "Makeup Artist deleted successfully" });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
};

const findMakeupArtistByLocation = async (req, res) => {
    try {
      const { locationId } = req.params;
      const targetLocation = await MakeupArtist.find({ "location.id": locationId }).populate('location.id');
        res.status(200).json(targetLocation);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
};

const updateMakeupArtist = async (req, res) => {
  const { makeupArtistId } = req.params;

  try {
    const makeupArtistBody = req.body;
    const makeupArtist = await MakeupArtist.findOneAndUpdate(
      { _id: makeupArtistId },
      makeupArtistBody,
      { new: true } 
    );
    res.status(200).json(makeupArtist);
  }  catch (error) {
      res.status(400).json({ error: error.message });
  }
};

const findAppointmentByMakeupArtistId = async (req, res) => {
    try {
      const { makeupArtistId } = req.params;
      const currentDate = moment().startOf("day").format("DD/MM/YYYY")
  
      const getAppointments = await Appointment.find({
        "makeupArtist.id": makeupArtistId,
        date: {
          $gte: currentDate
        }
      })
      .sort({ date: 1 })
      .populate('location.id makeupArtist.id')
      .sort({ date: 1, timeslot: 1 });
  
      res.status(200).json(getAppointments);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
};
const show = async (req, res) => {
  const { id }  = req.params

  try {
    const mkaeupArtist = await MakeupArtist.find({ _id: id }).populate('location.id');
      res.status(200).json(mkaeupArtist);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports ={
    create,
    deleteMakeupArtist,
    findMakeupArtistByLocation,
    updateMakeupArtist,
    findAppointmentByMakeupArtistId,
    show
}