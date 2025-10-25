require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const { Sequelize, DataTypes } = require("sequelize");
const axios = require("axios");

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use("/uploads", express.static("uploads"));

// -------------------- DB CONNECTION --------------------
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
    logging: false,
  }
);

// -------------------- MODELS --------------------
const User = sequelize.define("User", {
  name: DataTypes.STRING,
  role: DataTypes.STRING,
  email: DataTypes.STRING,
  password: DataTypes.STRING,
});

const FIR = sequelize.define("FIR", {
  complainant_name: DataTypes.STRING,
  complainant_address: DataTypes.STRING,
  complainant_phone: DataTypes.STRING,
  complainant_email: DataTypes.STRING,
  incident_date: DataTypes.DATEONLY,
  incident_time: DataTypes.TIME,
  location: DataTypes.STRING,
  incident_type: DataTypes.STRING,
  description: DataTypes.TEXT,
  witnesses: DataTypes.STRING,
  priority: DataTypes.STRING,
  status: { type: DataTypes.STRING, defaultValue: "pending" },
});

const Attachment = sequelize.define("Attachment", {
  file_path: DataTypes.STRING,
  file_type: DataTypes.STRING,
});

FIR.hasMany(Attachment, { foreignKey: "fir_id" });
Attachment.belongsTo(FIR, { foreignKey: "fir_id" });

// -------------------- FILE UPLOAD --------------------
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// -------------------- ROUTES --------------------

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// -------------------- AI Patrol Allocation --------------------
app.post("/api/allocate-patrol", async (req, res) => {
  try {
    const { hotspots } = req.body;

    // Simulate progress steps
    const progressSteps = [
      "Analyzing crime data...",
      "Identifying high-risk areas...",
      "Calculating optimal patrol times...",
      "Allocating officers to locations..."
    ];

    // Send progress updates every second
    let progress = 0;
    const progressInterval = setInterval(() => {
      if (progress < progressSteps.length) {
        console.log(progressSteps[progress]);
        progress++;
      }
    }, 1000);

    // Simulate AI API call using your Google Gemini API key
    const aiResponse = hotspots.map((hotspot) => {
      let priority = "Low";
      if (hotspot.incidents >= 10) priority = "High";
      else if (hotspot.incidents >= 5) priority = "Medium";

      return {
        location: hotspot.location,
        lat: hotspot.lat,
        lng: hotspot.lng,
        recommendedOfficers: Math.min(Math.max(Math.ceil(hotspot.incidents / 3), 2), 6),
        recommendedTime: priority === "High" ? "18:00-22:00" : "16:00-20:00",
        priority,
      };
    });

    // Wait 4 seconds to simulate AI processing
    await new Promise((resolve) => setTimeout(resolve, 4000));

    clearInterval(progressInterval);
    console.log("✅ Patrol allocation created successfully.");

    res.json({ patrolPlan: aiResponse, message: "Patrol allocation created successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// -------------------- START SERVER --------------------
sequelize
  .sync()
  .then(() => {
    app.listen(process.env.PORT || 4500, () =>
      console.log(`✅ Server running on port ${process.env.PORT || 4500}`)
    );
  })
  .catch((err) => console.error("DB Connection failed:", err));
