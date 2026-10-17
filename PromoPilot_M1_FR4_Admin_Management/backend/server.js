const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/promopilot")
  .then(() => console.log("MongoDB connected"))
  .catch((error) => console.log("MongoDB connection error:", error.message));

// Simple models for the admin panel
const User = mongoose.model("User", new mongoose.Schema({
  name: String,
  email: String,
  role: { type: String, default: "Business Owner" },
  status: { type: String, default: "Active" }
}));

const Business = mongoose.model("Business", new mongoose.Schema({
  name: String,
  category: String,
  owner: String,
  status: { type: String, default: "Active" }
}));

const Product = mongoose.model("Product", new mongoose.Schema({
  name: String,
  category: String,
  price: Number,
  status: { type: String, default: "Active" }
}));

const Content = mongoose.model("Content", new mongoose.Schema({
  title: String,
  type: String,
  business: String,
  status: { type: String, default: "Draft" }
}));

const Campaign = mongoose.model("Campaign", new mongoose.Schema({
  name: String,
  business: String,
  status: { type: String, default: "Draft" }
}));

// Dashboard summary
app.get("/admin/summary", async (req, res) => {
  try {
    const [users, businesses, products, contents, campaigns] = await Promise.all([
      User.countDocuments(),
      Business.countDocuments(),
      Product.countDocuments(),
      Content.countDocuments(),
      Campaign.countDocuments()
    ]);
    res.json({ users, businesses, products, contents, campaigns });
  } catch (error) {
    res.status(500).json({ message: "Could not load dashboard summary." });
  }
});

// List records
const collections = { users: User, businesses: Business, products: Product, contents: Content, campaigns: Campaign };

app.get("/admin/:type", async (req, res) => {
  const Model = collections[req.params.type];
  if (!Model) return res.status(404).json({ message: "Section not found." });

  try {
    res.json(await Model.find().sort({ _id: -1 }));
  } catch (error) {
    res.status(500).json({ message: "Could not load records." });
  }
});

// Update a record (for example, edit business/product/content/campaign)
app.put("/admin/:type/:id", async (req, res) => {
  const Model = collections[req.params.type];
  if (!Model) return res.status(404).json({ message: "Section not found." });

  try {
    const record = await Model.findByIdAndUpdate(
      req.params.id, req.body, { new: true, runValidators: true }
    );
    if (!record) return res.status(404).json({ message: "Record not found." });
    res.json(record);
  } catch (error) {
    res.status(400).json({ message: "Could not update record." });
  }
});

// Suspend or reactivate a user
app.patch("/admin/users/:id/status", async (req, res) => {
  const status = req.body.status;
  if (!["Active", "Suspended"].includes(status)) {
    return res.status(400).json({ message: "Status must be Active or Suspended." });
  }

  try {
    const user = await User.findByIdAndUpdate(
      req.params.id, { status }, { new: true }
    );
    if (!user) return res.status(404).json({ message: "User not found." });
    res.json(user);
  } catch (error) {
    res.status(400).json({ message: "Could not change user status." });
  }
});

// Remove a user
app.delete("/admin/users/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found." });
    res.json({ message: "User removed." });
  } catch (error) {
    res.status(400).json({ message: "Could not remove user." });
  }
});

// Remove a business, product, content item, or campaign
app.delete("/admin/:type/:id", async (req, res) => {
  const Model = collections[req.params.type];
  if (!Model) return res.status(404).json({ message: "Section not found." });

  try {
    const record = await Model.findByIdAndDelete(req.params.id);
    if (!record) return res.status(404).json({ message: "Record not found." });
    res.json({ message: "Record removed." });
  } catch (error) {
    res.status(400).json({ message: "Could not remove record." });
  }
});

app.listen(5001, () => {
  console.log("Admin API running at http://localhost:5001");
});
