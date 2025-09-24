import express from "express";
import GroomingAppointment from "../models/GroomingModel.js";

const router = express.Router();

function toHHMM(m) {
  const h = Math.floor(m / 60);
  const mm = String(m % 60).padStart(2, "0");
  const h12 = ((h + 11) % 12) + 1;
  const ampm = h >= 12 ? "PM" : "AM";
  return `${String(h12).padStart(2, "0")}:${mm} ${ampm}`;
}

/* ---------- GET /api/grooming/appointments?date=YYYY-MM-DD ---------- */
/* Returns an array of {id,date,start,end,title,service} for the calendar */
router.get("/appointments", async (req, res, next) => {
  try {
    const { date } = req.query;
    if (!date) return res.json([]);

    const rows = await GroomingAppointment.find({ dateISO: date })
      .sort({ timeSlotMinutes: 1 })
      .lean();

    const items = rows.map((a) => ({
      id: String(a._id),
      date: a.dateISO,
      start: toHHMM(a.timeSlotMinutes),
      end: toHHMM((a.timeSlotMinutes || 0) + (a.durationMin || 60)), // default 60 mins for grooming
      title: `${a.petType} • ${a.packageName || a.packageId || "Grooming"}`,
      service: "grooming",
    }));

    res.json(items);
  } catch (err) {
    next(err);
  }
});

// POST -> Create appointment for Grooming
router.post("/appointments", async (req, res, next) => {
  try {
    const { ownerName, phone, email, petType, packageId, dateISO, timeSlotMinutes, notes, } = req.body;

    if ( !ownerName || !phone || !email || !petType || !packageId || !dateISO || timeSlotMinutes === undefined) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // prevent double-booking the same slot
    const exists = await GroomingAppointment.findOne({
      dateISO,
      timeSlotMinutes: Number(timeSlotMinutes),
    });
    if (exists) {
      return res.status(409).json({ error: "That time slot is already booked." });
    }

    const doc = await GroomingAppointment.create({
      ownerName,
      phone,
      email,
      petType,
      packageId,
      dateISO,
      timeSlotMinutes: Number(timeSlotMinutes),
      notes: notes?.trim() || "",
    });
    await doc.save();

    res.status(201).json({ ok: true, id: String(doc._id), message: "Appointment created" });

  } catch (err) {
    if (err?.code === 11000) {
      return res
        .status(409)
        .json({ error: "That time slot is already booked." });
    }
    next(err);
  }
});

// GET /api/grooming/ → all appointments (latest first)
router.get("/", async (req, res, next) => {
  try {
    const list = await GroomingAppointment.find()
      .sort({ createdAt: -1 })
      .lean();
    res.json(list);
  } catch (err) {
    next(err);
  }
});

// GET /api/grooming/:id → single appointment
router.get("/:id", async (req, res, next) => {
  try {
    const doc = await GroomingAppointment.findById(req.params.id).lean();
    if (!doc) return res.status(404).json({ error: "Appointment not found" });
    res.json(doc);
  } catch (err) {
    next(err);
  }
});

// PUT /api/grooming/:id → update
router.put("/:id", async (req, res, next) => {
  try {
    const updated = await GroomingAppointment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).lean();
    if (!updated) return res.status(404).json({ error: "Appointment not found" });
    res.json({ ok: true, data: updated });
  } catch (err) {
    next(err);
  }
});


// DELETE /api/grooming/:id → delete
router.delete("/:id", async (req, res, next) => {
  try {
    const deleted = await GroomingAppointment.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Appointment not found" });
    res.json({ ok: true, message: "Appointment deleted" });
  } catch (err) {
    next(err);
  }
});

// PATCH /api/grooming/:id/status → accept / reject / pending / cancelled
router.patch("/:id/status", async (req, res, next) => {
  try {
    const { status } = req.body; // "accepted" | "rejected" | "pending" | "cancelled"
    const ALLOWED = ["accepted", "rejected", "pending", "cancelled"];
    if (!ALLOWED.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }
    const doc = await GroomingAppointment.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).lean();
    if (!doc) return res.status(404).json({ message: "Not found" });
    res.json({ ok: true, item: doc });
  } catch (e) { next(e); }
});





export default router