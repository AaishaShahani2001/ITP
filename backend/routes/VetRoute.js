// routes/vetRoute.js
import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import VetAppointment from "../models/VetAppointmentModel.js";

const router = express.Router();

/* -------------------------------- Upload dir -------------------------------- */
const MED_DIR = path.join(process.cwd(), "uploads", "medical");
if (!fs.existsSync(MED_DIR)) fs.mkdirSync(MED_DIR, { recursive: true });

/* ------------------------------- Multer setup ------------------------------- */
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

const fileFilter = (req, file, cb) => {
  const ok = ["application/pdf", "image/jpeg", "image/png"].includes(file.mimetype);
  if (!ok) return cb(new Error("Only PDF, JPG, or PNG is allowed"));
  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

/* --------------------------------- Helpers --------------------------------- */
function toHHMM(m = 0) {
  const h = Math.floor(m / 60);
  const mm = String(m % 60).padStart(2, "0");
  const h12 = ((h + 11) % 12) + 1;
  const ampm = h >= 12 ? "PM" : "AM";
  return `${String(h12).padStart(2, "0")}:${mm} ${ampm}`;
}

const DATE_YYYY_MM_DD = /^\d{4}-\d{2}-\d{2}$/;
function assertDateISO(ymd) {
  if (!DATE_YYYY_MM_DD.test(String(ymd || ""))) {
    const err = new Error("Invalid date format. Use YYYY-MM-DD.");
    err.status = 400;
    throw err;
  }
}

/* ------------------- GET /api/vet/appointments (calendar) ------------------- */
/** Returns items for the calendar (filters out rejected/cancelled) */
router.get("/appointments", async (req, res, next) => {
  try {
    const { date } = req.query;
    if (!date) return res.json([]);

    assertDateISO(date);

    const rows = await VetAppointment.find({ dateISO: date })
      .sort({ timeSlotMinutes: 1 })
      .lean();

    // Hide rejected/cancelled
    const filtered = rows.filter((r) =>
      !["rejected", "cancelled"].includes(String(r.status || r.state || "").toLowerCase())
    );

    const items = filtered.map((a) => ({
      id: String(a._id),
      date: a.dateISO, // ✅ fixed (was 'String' by mistake)
      start: toHHMM(a.timeSlotMinutes),
      end: toHHMM((a.timeSlotMinutes || 0) + (a.durationMin || 30)),
      title: `${a.petType || "Pet"} • ${a.packageName || a.packageId || a.selectedService || "Vet"}`,
      service: "vet",
      status: a.status || a.state || "pending",
    }));

    res.json(items);
  } catch (err) {
    next(err);
  }
});

/* ---------------------- POST /api/vet/appointments (create) ---------------------- */
router.post("/appointments", upload.single("medicalFile"), async (req, res, next) => {
  try {
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
    } = req.body;

    if (
      !ownerName ||
      !ownerPhone ||
      !ownerEmail ||
      !petType ||
      !petSize ||
      !reason ||
      !dateISO ||
      timeSlotMinutes === undefined
    ) {
      const err = new Error("Missing required fields");
      err.status = 400;
      throw err;
    }

    // ✅ Keep dateISO as literal "YYYY-MM-DD" (no UTC conversion)
    assertDateISO(dateISO);
    const slot = Number(timeSlotMinutes);
    if (!Number.isFinite(slot)) {
      const err = new Error("Invalid timeSlotMinutes");
      err.status = 400;
      throw err;
    }

    // Conflict check
    const exists = await VetAppointment.findOne({
      dateISO,
      timeSlotMinutes: slot,
    }).lean();
    if (exists) {
      const err = new Error("That time slot is already booked.");
      err.status = 409;
      throw err;
    }

    const medicalFilePath = req.file ? `/uploads/medical/${req.file.filename}` : undefined;

    const doc = await VetAppointment.create({
      ownerName: ownerName.trim(),
      ownerPhone: ownerPhone.trim(),
      ownerEmail: ownerEmail.trim(),
      petType,
      petSize,
      reason: reason.trim(),
      dateISO, // keep literal string
      timeSlotMinutes: slot,
      selectedService,
      selectedPrice,
      notes,
      medicalFilePath,
      // status default comes from schema: "pending"
    });

    res.status(201).json({ ok: true, id: doc._id, message: "Appointment created" });
  } catch (error) {
    if (error?.code === 11000) {
      error.status = 409;
      error.message = "This time slot is already booked. Please choose another.";
    }
    next(error);
  }
});

/* ---------------------------- GET /api/vet/ (all) ---------------------------- */
// Return ALL vet appointments (dashboard uses client-side filters)
router.get("/", async (req, res) => {
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

/* ----------------------- GET /api/vet/:id (single doc) ----------------------- */
router.get("/:id", async (req, res) => {
  try {
    const appt = await VetAppointment.findById(req.params.id).lean();
    if (!appt) return res.status(404).json({ error: "Appointment not found" });
    res.status(200).json(appt);
  } catch (error) {
    console.error("❌ Fetch appointment by ID error:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

/* -------- PUT /api/vet/:id (multipart-friendly update with conflict check) -------- */
router.put("/:id", upload.single("medicalFile"), async (req, res, next) => {
  try {
    const id = req.params.id;
    const existing = await VetAppointment.findById(id);
    if (!existing) return res.status(404).json({ error: "Appointment not found" });

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
      status, // optional
    } = req.body;

    const update = {};
    if (typeof ownerName === "string") update.ownerName = ownerName.trim();
    if (typeof ownerPhone === "string") update.ownerPhone = ownerPhone.trim();
    if (typeof ownerEmail === "string") update.ownerEmail = ownerEmail.trim();
    if (typeof petType === "string") update.petType = petType;
    if (typeof petSize === "string") update.petSize = petSize;
    if (typeof reason === "string") update.reason = reason.trim();

    if (typeof dateISO === "string") {
      assertDateISO(dateISO);
      update.dateISO = dateISO; // keep literal string
    }
    if (typeof timeSlotMinutes !== "undefined" && timeSlotMinutes !== "") {
      const slot = Number(timeSlotMinutes);
      if (!Number.isFinite(slot)) {
        const err = new Error("Invalid timeSlotMinutes");
        err.status = 400;
        throw err;
      }
      update.timeSlotMinutes = slot;
    }

    if (typeof notes === "string") update.notes = notes;
    if (typeof selectedService === "string") update.selectedService = selectedService;
    if (typeof selectedPrice === "string" || typeof selectedPrice === "number")
      update.selectedPrice = selectedPrice;
    if (typeof status === "string") update.status = status;

    // Conflict check if date/slot changed
    const wantDate = update.dateISO ?? existing.dateISO;
    const wantSlot =
      typeof update.timeSlotMinutes === "number" ? update.timeSlotMinutes : existing.timeSlotMinutes;

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

    // Optional file replace
    if (req.file) {
      const newPath = `/uploads/medical/${req.file.filename}`;
      update.medicalFilePath = newPath;

      const oldRel = existing.medicalFilePath;
      if (oldRel && oldRel.startsWith("/uploads/medical/")) {
        try {
          const oldAbs = path.join(process.cwd(), oldRel.replace(/^\//, ""));
          if (fs.existsSync(oldAbs)) fs.unlinkSync(oldAbs);
        } catch (e) {
          console.warn("⚠️ Could not delete old medical file:", e.message);
        }
      }
    }

    const updated = await VetAppointment.findByIdAndUpdate(id, update, {
      new: true,
      runValidators: true,
    }).lean();

    return res.json({ ok: true, data: updated });
  } catch (err) {
    if (err?.code === 11000) {
      err.status = 409;
      err.message = "This time slot is already booked. Please choose another.";
    }
    next(err);
  }
});

/* --------------------- DELETE /api/vet/:id (hard delete) --------------------- */
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

/* ------------- PATCH /api/vet/:id/status  {status: accepted|...} ------------- */
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
  } catch (err) {
    next(err);
  }
});

export default router;
