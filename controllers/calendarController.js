const MakeupArtist = require("../models/makeupArtistModel");
const Location = require('../models/Location');

const showAllLocation = async (req, res) => {
  try {
   
    const foundLocation = await Location.find({}).sort({type: 1}).exec();

    res.status(200).json(foundLocation);
  } catch (error) {
    console.log(`Error showing queueno: ${error}`);
    res.status(400).json({ error: error.message });
  }
};

const getMakeupArtistsByLocation = async (req, res) => {
  const locationId = req.params.id;
  console.log(`locationId: ${locationId}`);

  try {
    const allArtist = await MakeupArtist.find({ "location.id": locationId })
    console.log(`allArtist: ${allArtist}`);
    res.status(200).json(allArtist);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


module.exports = {
  getMakeupArtistsByLocation,
  showAllLocation,
};
