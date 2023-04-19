const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AppointmentSchema = new Schema({
   
    location: {
      id: { type: Schema.Types.ObjectId, ref: 'Location', required: true },
    },
  
    makeupArtist: {
      id: { type: Schema.Types.ObjectId, ref: 'MakeupArtist', required: true },
    },
    
    customerInfo: {
      name: { type: String, required: true },
      email: { type: String, required: true },
    },
    date: {
      type: String,
      required: true,
    },
    timeslot: {
      type: String,
      required: true,
    },
    
  },
  { timestamps: true} 
  );
  
  const Appointment= mongoose.model('Appointment', AppointmentSchema);
  module.exports = Appointment