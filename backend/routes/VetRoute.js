import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import VetAppointment from "../models/VetAppointmentModel.js";


const router = express.Router();

// --- Ensure upload directory exists (uploads/medical) ---
const MED_DIR = path.join(process.cwd(), "uploads", "medical");
if (!fs.existsSync(MED_DIR)) {
  fs.mkdirSync(MED_DIR, { recursive: true });
}

// --- Multer storage config ---
// Stores files to /uploads/medical/<timestamp>-<random>-<slugged-originalname>
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, MED_DIR),
  filename: (req, file, cb) => {
    const safeBase = path
      .basename(file.originalname)
      .replace(/\s+/g, "_")
      .replace(/[^a-zA-Z0-9._-]/g, "");
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${unique}-${safeBase}`);
  },
});

// --- File type + size guard ---
// Accept: PDF, JPG, PNG; Size ≤ 5MB (matches your front-end Yup rules)
const fileFilter = (req, file, cb) => {
  const ok = [
    "application/pdf",
    "image/jpeg",
    "image/png",
  ].includes(file.mimetype);
  if (!ok) return cb(new Error("Only PDF, JPG, or PNG is allowed"));
  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

function toHHMM(m) {
  const h = Math.floor(m / 60);
  const mm = String(m % 60).padStart(2, "0");
  const h12 = ((h + 11) % 12) + 1;
  const ampm = h >= 12 ? "PM" : "AM";
  return `${String(h12).padStart(2, "0")}:${mm} ${ampm}`;
}

// GET /api/vet/appointments?date=YYYY-MM-DD  → calendar feed
router.get("/appointments", async (req, res, next) => {
  try {
    const { date } = req.query;
    if (!date) return res.json([]); // empty list if no date

    const appts = await VetAppointment.find({ dateISO: date })
      .sort({ timeSlotMinutes: 1 })
      .lean();

    const items = appts.map((a) => ({
      id: String(a._id),
      date: a.dateISO,
      start: toHHMM(a.timeSlotMinutes),
      end: toHHMM((a.timeSlotMinutes || 0) + (a.durationMin || 30)),
      title: `${a.petType} • ${a.selectedService || "Vet"}`,
      service: "vet",
    }));

    res.json(items);
  } catch (err) {
    next(err);
  }
});

// POST -> Create appointment for Vet Care
router.post(
  "/appointments",
  upload.single("medicalFile"),
  async (req, res, next) => {
    try {
      const {
      ownerName, ownerPhone, ownerEmail, petType, petSize, reason,
      dateISO, timeSlotMinutes, notes, selectedService, selectedPrice
    } = req.body;

    const medicalFilePath = req.file
        ? `/uploads/medical/${req.file.filename}`
        : undefined;

      if (!ownerName || !ownerPhone || !ownerEmail || !petType || !petSize || !reason || !dateISO || !timeSlotMinutes) {
      const err = new Error("Missing required fields");
      err.status = 400;
      throw err;
    }

      // Conflict check
      const exists = await VetAppointment.findOne({
        dateISO,
        timeSlotMinutes: Number(timeSlotMinutes),
      });
      if (exists) {
        const err = new Error("That time slot is already booked.");
        err.status = 409;
        throw err;
      }

      const doc = await VetAppointment.create({
      ownerName, ownerPhone, ownerEmail, petType, petSize, reason,
      dateISO,
      timeSlotMinutes: Number(timeSlotMinutes),
      selectedService, selectedPrice, notes,
      medicalFilePath,
    });

    

    res.status(201).json({ ok: true, id: doc._id, message: "Appointment created" });  
    } 
    catch (error) {
    // handle duplicate slot (unique index)
    if (error?.code === 11000) {
      error.status = 409;
      error.message = "This time slot is already booked. Please choose another.";
    }
    next(error);
    }
  }
);

// GET /api/vet/ → Get all appointments (latest first)
router.get("/", async (req, res, ) => {
  try {
    const appts = await VetAppointment.find({})
      .sort({ dateISO: -1, timeSlotMinutes: -1, createdAt: -1 })
      .lean();
    res.status(200).json(appts);
  } catch (error) {
    console.error("❌ Fetching Appointments error:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// GET /api/vet/:id → Get a single vet appointment by ID (simple)
router.get("/:id", async (req, res, next) => {
  try {
    const appt = await VetAppointment.findById(req.params.id).lean();
    if (!appt) return res.status(404).json({ error: "Appointment not found" });
    res.status(200).json(appt);
  } catch (error) {
    console.error("❌ Fetch appointment by ID error:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// PUT /api/vet/:id → Update appointment by ID (multipart-friendly + conflict check + optional file replace)
router.put("/:id", upload.single("medicalFile"), async (req, res, next) => {
  try {
    const id = req.params.id;

    // Load existing doc (we need current values + existing file path)
    const existing = await VetAppointment.findById(id);
    if (!existing) return res.status(404).json({ error: "Appointment not found" });

    // Pull incoming fields from multipart body (they'll be strings)
    const {
      ownerName,
      ownerPhone,
      ownerEmail,
      petType,
      petSize,
      reason,
      dateISO,
      timeSlotMinutes,
      notes,
      selectedService,
      selectedPrice,
      status, // optional if you want to allow status changes here
    } = req.body;

    // Build the update object only with provided fields (partial update)
    const update = {};

    if (typeof ownerName === "string") update.ownerName = ownerName.trim();
    if (typeof ownerPhone === "string") update.ownerPhone = ownerPhone.trim();
    if (typeof ownerEmail === "string") update.ownerEmail = ownerEmail.trim();
    if (typeof petType === "string") update.petType = petType;
    if (typeof petSize === "string") update.petSize = petSize;

    // Reason is locked on the UI, but we still accept it if sent (unchanged). If you want to hard-lock on server, comment next line.
    if (typeof reason === "string") update.reason = reason.trim();

    if (typeof dateISO === "string") update.dateISO = dateISO;
    if (typeof timeSlotMinutes !== "undefined" && timeSlotMinutes !== "") {
      update.timeSlotMinutes = Number(timeSlotMinutes);
    }
    if (typeof notes === "string") update.notes = notes;

    if (typeof selectedService === "string") update.selectedService = selectedService;
    if (typeof selectedPrice === "string" || typeof selectedPrice === "number") update.selectedPrice = selectedPrice;

    if (typeof status === "string") update.status = status; // only if you intend to allow this here

    // If date/time changed, conflict check against other docs
    const wantDate = update.dateISO ?? existing.dateISO;
    const wantSlot = typeof update.timeSlotMinutes === "number" ? update.timeSlotMinutes : existing.timeSlotMinutes;

    if (wantDate && typeof wantSlot === "number") {
      const conflict = await VetAppointment.findOne({
        _id: { $ne: id },
        dateISO: wantDate,
        timeSlotMinutes: wantSlot,
      }).lean();

      if (conflict) {
        const err = new Error("That time slot is already booked.");
        err.status = 409;
        throw err;
      }
    }

    // Handle optional file replace
    // If a new file is uploaded, save its path and remove the old file on disk.
    if (req.file) {
      const newPath = `/uploads/medical/${req.file.filename}`;
      update.medicalFilePath = newPath;

      // delete old file if existed and is inside /uploads/medical
      const oldRel = existing.medicalFilePath; // e.g., "/uploads/medical/abc.pdf"
      if (oldRel && oldRel.startsWith("/uploads/medical/")) {
        try {
          const oldAbs = path.join(process.cwd(), oldRel.replace(/^\//, ""));
          if (fs.existsSync(oldAbs)) fs.unlinkSync(oldAbs);
        } catch (e) {
          // don't fail the whole request for file delete problems; just log
          console.warn("⚠️ Could not delete old medical file:", e.message);
        }
      }
    }

    // Now persist changes
    const updated = await VetAppointment.findByIdAndUpdate(id, update, {
      new: true,
      runValidators: true,
    }).lean();

    return res.json({ ok: true, data: updated });
  } catch (err) {
    // De-duplicate index overlap (if any unique index present)
    if (err?.code === 11000) {
      err.status = 409;
      err.message = "This time slot is already booked. Please choose another.";
    }
    next(err);
  }
});

// DELETE /api/vet/:id → Delete appointment by ID
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await VetAppointment.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Appointment not found" });
    res.status(200).json({ ok: true, message: "Appointment deleted successfully" });
  } catch (error) {
    console.error("❌ Delete appointment error:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// PATCH /api/vet/:id/status  {status: "accepted"|"rejected"|"cancelled"}
router.patch("/:id/status", async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!["accepted", "rejected", "cancelled", "pending"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }
    const updated = await VetAppointment.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).lean();
    if (!updated) return res.status(404).json({ message: "Not found" });
    res.json({ ok: true, item: updated });
  } catch (err) { next(err); }
});



export default router;
