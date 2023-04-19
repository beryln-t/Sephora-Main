const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const makeupArtistSchema = new Schema({
    name: { type: String, required: true, unique: true },
    
    workingSchedule: {
      startDate: { type: Date, required: true },
      endDate: { type: Date, required: true },
    },
    workingHours: {
      startTime: { type: String, required: true },
      endTime: { type: String, required: true },
    },
    breakTime: {
      startTime: { type: String, required: true },
      endTime: { type: String, required: true },
    },
    
    location: {
      id: { type: String, ref: 'Location', required: true},
    },
  });
  
  const MakeupArtist = mongoose.model('MakeupArtist', makeupArtistSchema);
  module.exports = MakeupArtist