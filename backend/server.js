const express = require("express");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");
const petRoutes = require("./routes/petRoutes");
require("dotenv").config();

const connectDB = require("./config/db");
const path = require("path");

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/pets", petRoutes);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/", (req, res) => {
  res.send("PawBuddy API is running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
