const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, default: "" },
  price: { type: Number, required: true, min: 0 },
  category: { type: String, required: true },
  image: { type: String, default: "" },
  stock: { type: Boolean, default: true }
});

module.exports = mongoose.model("Product", productSchema);
