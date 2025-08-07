// model/Wishlist.js
const mongoose = require("mongoose");

const WishlistSchema = new mongoose.Schema({
  producttitle: String,
  productimage: String,
  productcategory: String,
  saleprice: Number,
  date: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model("Wishlist", WishlistSchema);
