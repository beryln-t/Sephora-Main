const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const locationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trime: true },
    products: [
      {
        productDetails: {
          type: Schema.Types.ObjectId,
          ref: "Product",
        },
        productQty: {
          type: Number,
          required: true,
          min: 0,
          validate: {
            validator: Number.isInteger,
            message: "{VALUE} is not an integer value",
          },
        },
      },
    ],
    latitude: {
      type: String,
      required: true,
    },
    longitude: {
      type: String,
      required: true,
    },
  },

  {
    timestamps: true,
  }
);

const Location = mongoose.model("Location", locationSchema);
module.exports = Location;
