const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  producttitle: String,
  productcategory: String,
  productweight: String,
  productquantity: String,
  productimage: String,
  productdescriptions: String,
  regularprice: String,
  saleprice: String
});

module.exports = mongoose.model("Products", productSchema);

