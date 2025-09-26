import express from 'express'
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";
import VetRoute from "./routes/VetRoute.js"
import GroomingRoute from "./routes/GroomingRoute.js"
import DayCareRoute from "./routes/DayCareRoute.js"
import scheduleRoute from "./routes/scheduleRoute.js"


dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); // serve uploaded files

app.use("/api/vet", VetRoute)
app.use("/api/grooming", GroomingRoute)
app.use("/api/daycare", DayCareRoute)
app.use("/api/schedule", scheduleRoute);



// Connect MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.log("❌ MongoDB connection error:", err));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));