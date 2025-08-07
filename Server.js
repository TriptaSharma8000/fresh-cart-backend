const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

// Middleware ----------------
app.use(cors({
  origin: 'https://fresh-cart-frontend.vercel.app',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MongoDB -------------------
mongoose.connect("mongodb+srv://sharma:r398r31qFqQKgAKo@cluster7.fveuzzh.mongodb.net/freshcart")
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("Mongo Error", err));

// Models --------------------
const Users = require("./model/Users");
const Products = require("./model/Addproduct");
const Wishlist = require("./model/Wishlist");



// Routes --------------------

// Signup --------------------
app.post("/signup", async (req, res) => {
  try {
    const { Firstname, Lastname, Email, Password } = req.body;

    const result = await Users.create({
      firstname: Firstname,
      lastname: Lastname,
      email: Email,
      password: Password
    });

    res.json({ status: !!result });
  } catch (error) {
    console.error("Signup Error:", error);
    res.json({ status: false });
  }
});

// Login ---------------------
app.post("/Login", async (req, res) => {
  const { Email, Password } = req.body;

  const result = await Users.findOne({ email: Email, password: Password });

  if (result) {
    res.json({ status: true, logedin: result });
  } else {
    res.json({ status: false });
  }
});

// Add Product ----------------
app.post("/AddProductForm", async (req, res) => {
  try {
    const data = req.body.addproduct;

    const product = new Products({
      producttitle: data.producttitle,
      productcategory: data.productcategory,
      productweight: data.productweight,
      productquantity: data.productquantity,
      productimage: data.productimage,
      productdescriptions: data.productdescriptions,
      regularprice: data.regularprice,
      saleprice: data.saleprice,
      status: "Active",
      date: new Date().toLocaleDateString()
    });

    const result = await product.save();

    res.json({ status: !!result });
  } catch (error) {
    console.error("Add Product Error:", error);
    res.json({ status: false });
  }
});

// Get All Products ----------
app.get("/products", async (req, res) => {
  const allproduct = await Products.find({});
  res.json({ status: !!allproduct, ourproducts: allproduct });
});

// Delete Product ------------
app.post("/deleteproduct", async (req, res) => {
  const deleted = await Products.findOneAndDelete({ _id: req.body._id });

  res.json({ status: !!deleted, ourproducts: deleted });
});

// ✅ Get Product by ID --------
app.get("/products/:id", async (req, res) => {
  try {
    const product = await Products.findById(req.params.id);
    if (!product) {
      return res.json({ status: false, message: "Product not found" });
    }
    res.json({ status: true, product });
  } catch (error) {
    console.error("GET Product Error:", error);
    res.status(500).json({ status: false, message: "Server error" });
  }
});

// ✅ Update Product by ID -----
app.post("/updateproduct/:id", async (req, res) => {
  try {
    const updated = await Products.findByIdAndUpdate(req.params.id, req.body, { new: true });

    if (!updated) {
      return res.json({ status: false, message: "Update failed" });
    }

    res.json({ status: true, product: updated, message: "Updated successfully" });
  } catch (error) {
    console.error("Update Product Error:", error);
    res.status(500).json({ status: false, message: "Server error" });
  }
});

// Get Related Products ------
app.get("/products/related/:category", async (req, res) => {
  try {
    const category = req.params.category;
    const products = await Products.find({ productcategory: category });
    res.json({ status: true, products });
  } catch (error) {
    console.error("Related Products Error:", error);
    res.status(500).json({ status: false, message: "Server error" });
  }
});

// Add to Wishlist (POST) ---------------
app.post("/wishlist", async (req, res) => {
  try {
    const { producttitle, productimage, productcategory, saleprice } = req.body;

    const alreadyExists = await Wishlist.findOne({ producttitle });
    if (alreadyExists) {
      return res.json({ status: false, message: "Already in wishlist" });
    }

    const wishlistItem = new Wishlist({
      producttitle,
      productimage,
      productcategory,
      saleprice,
    });

    const result = await wishlistItem.save();
    res.json({ status: true, message: "Added to wishlist" });
  } catch (error) {
    console.error("Wishlist Error:", error);
    res.status(500).json({ status: false, message: "Server error" });
  }
});

// Get Wishlist (GET) -------------------
app.get("/wishlist", async (req, res) => {
  try {
    const items = await Wishlist.find({});
    res.json({ status: true, items });
  } catch (error) {
    console.error("Get Wishlist Error:", error);
    res.status(500).json({ status: false });
  }
});

// Delete Wishlist Item (DELETE) --------
app.delete("/wishlist/:id", async (req, res) => {
  try {
    const deleted = await Wishlist.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.json({ status: false, message: "Item not found" });
    }
    res.json({ status: true, message: "Removed from wishlist" });
  } catch (error) {
    console.error("Delete Wishlist Error:", error);
    res.status(500).json({ status: false });
  }
});

const CartSchema = new mongoose.Schema({
  items: [
    {
      producttitle: String,
      productimage: String,
      productcategory: String,
      saleprice: Number,
      quantity: Number,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Cart = mongoose.model("Cart", CartSchema);

app.post("/checkout", async (req, res) => {
  try {
    const cart = new Cart({ items: req.body.items });
    await cart.save();
    res.json({ status: true, message: "Checkout success" });
  } catch (err) {
    res.status(500).json({ status: false, message: "Checkout failed" });
  }
});

// Start Server --------------
app.listen(8080, () => {
  console.log("Node server started at http://localhost:8080");
});



app.get("/",(req,res)=>{
  res.json({
    status:true
  })
})
