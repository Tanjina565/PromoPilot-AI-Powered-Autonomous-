const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const csv = require("csv-parser");
const fs = require("fs");
const path = require("path");
const Product = require("./Product");

const app = express();
const upload = multer({ dest: "uploads/" });

app.use(cors());
app.use(express.json());

// Connect to the local MongoDB database
mongoose.connect("mongodb://127.0.0.1:27017/promopilot")
  .then(() => console.log("MongoDB connected"))
  .catch((error) => console.log("MongoDB connection error:", error.message));

// Get all products
app.get("/products", async (req, res) => {
  try {
    const products = await Product.find().sort({ name: 1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Could not load products." });
  }
});

// Add a product
app.post("/products", async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: "Could not add product. Check the details." });
  }
});

// Update a product
app.put("/products/:id", async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id, req.body, { new: true, runValidators: true }
    );
    if (!product) return res.status(404).json({ message: "Product not found." });
    res.json(product);
  } catch (error) {
    res.status(400).json({ message: "Could not update product." });
  }
});

// Delete a product
app.delete("/products/:id", async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found." });
    res.json({ message: "Product deleted successfully." });
  } catch (error) {
    res.status(400).json({ message: "Could not delete product." });
  }
});

// Import products from CSV
app.post("/products/import", upload.single("file"), (req, res) => {
  if (!req.file) return res.status(400).json({ message: "Please choose a CSV file." });

  const products = [];
  const filePath = path.resolve(req.file.path);

  fs.createReadStream(filePath)
    .pipe(csv())
    .on("data", (row) => {
      products.push({
        name: row.name,
        description: row.description || "",
        price: Number(row.price),
        category: row.category,
        image: row.image || "",
        stock: String(row.stock).toLowerCase() !== "false"
      });
    })
    .on("error", () => {
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      res.status(400).json({ message: "Could not read the CSV file." });
    })
    .on("end", async () => {
      try {
        const validProducts = products.filter((item) =>
          item.name && item.category && Number.isFinite(item.price) && item.price >= 0
        );
        if (!validProducts.length) {
          if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
          return res.status(400).json({ message: "No valid products found in the CSV." });
        }
        await Product.insertMany(validProducts);
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        res.json({ message: `${validProducts.length} product(s) imported successfully.` });
      } catch (error) {
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        res.status(400).json({ message: "CSV import failed." });
      }
    });
});

app.listen(5000, () => console.log("Product API running at http://localhost:5000"));
