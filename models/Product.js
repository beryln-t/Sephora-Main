const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProductSchema = new Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    imgurl: { type: String, required: true },
    price: { type: Number, required: true, min: 1 },
    description: { type: String, required: true },
    brand: {
      type: String,
      required: true,
    },
    category: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", ProductSchema);
module.exports = Product;
