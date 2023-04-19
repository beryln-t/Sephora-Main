const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const customerSchema = new Schema({
  name: { type: String, required: true },
  email: {
    type: String,
    unique: true,
    trim: true,
    lowercase: true,
    required: true,
  },
  password: {
    type: String,
    trim: true,
    minLength: 3,
    required: true,
  },
  role: {
    type: String,
    required: true,
    default: "CUSTOMER",
    enum: ["HRADMIN", "CUSTOMER", "OPSADMIN"],
  },
});

const Customer = mongoose.model("Customer", customerSchema);
module.exports = Customer;
