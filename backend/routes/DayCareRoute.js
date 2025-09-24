import express from "express";
import DayCareAppointment from "../models/DayCareModel.js";

const router = express.Router();

function toHHMM(m) {
  const h = Math.floor(m / 60);
  const mm = String(m % 60).padStart(2, "0");
  const h12 = ((h + 11) % 12) + 1;
  const ampm = h >= 12 ? "PM" : "AM";
  return `${String(h12).padStart(2, "0")}:${mm} ${ampm}`;
}

// GET /api/daycare/appointments?date=YYYY-MM-DD
router.get("/appointments", async (req, res, next) => {
  try {
    const { date } = req.query;
    if (!date) return res.json([]);

    const rows = await DayCareAppointment.find({ dateISO: date })
      .sort({ dropOffMinutes: 1 })
      .lean();

    const toHHMM = (m) => {
      const h = Math.floor(m / 60);
      const mm = String(m % 60).padStart(2, "0");
      const h12 = ((h + 11) % 12) + 1;
      const ampm = h >= 12 ? "PM" : "AM";
      return `${String(h12).padStart(2, "0")}:${mm} ${ampm}`;
    };

    const items = rows.map((a) => ({
      id: String(a._id),
      date: a.dateISO,
      start: toHHMM(a.dropOffMinutes),
      end: toHHMM(a.pickUpMinutes),
      title: `${a.petType || "Pet"} • ${a.packageName || a.packageId || "Daycare"}`,
      service: "daycare",
    }));

    

    res.json(items);
  } catch (err) {
    next(err);
  }
});

// POST /api/daycare/appointments → Create daycare booking
router.post("/appointments", async (req, res, next) => {
  try {
    const {
      ownerName, ownerEmail, ownerPhone, emergencyPhone, petType, petName, packageId, dateISO, dropOffMinutes, pickUpMinutes, notes, } = req.body;

    if (
      !ownerName || !ownerEmail || !ownerPhone || !petType || !petName || !packageId || !dateISO || dropOffMinutes == null || pickUpMinutes == null
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Overlap check: (existing.start < new.end) AND (existing.end > new.start)
    const conflict = await DayCareAppointment.findOne({
      dateISO,
      dropOffMinutes: { $lt: Number(pickUpMinutes) },
      pickUpMinutes: { $gt: Number(dropOffMinutes) },
    });
    if (conflict) {
      return res.status(409).json({ message: "Overlaps another booking." });
    }

    const doc = await DayCareAppointment.create({
      ownerName,
      ownerEmail,
      ownerPhone,
      emergencyPhone,
      petType,
      petName,
      packageId,
      dateISO,
      dropOffMinutes: Number(dropOffMinutes),
      pickUpMinutes: Number(pickUpMinutes),
      notes,
    });

    res.status(201).json({ ok: true, id: doc._id, message: "Daycare booking created" });
  } catch (err) {
    next(err);
  }
});

//GET /api/daycare → all bookings (newest first)
router.get("/", async (_req, res, next) => {
  try {
    const list = await DayCareAppointment.find().sort({ createdAt: -1 }).lean();
    res.json(list);
  } catch (err) {
    next(err);
  }
});

// GET /api/daycare/:id → single appointment
router.get("/:id", async (req, res, next) => {
  try {
    const doc = await DayCareAppointment.findById(req.params.id).lean();
    if (!doc) return res.status(404).json({ error: "Appointment not found" });
    res.json(doc);
  } catch (err) {
    next(err);
  }
});

// PUT /api/daycare/:id → update (simple, with overlap check)
router.put("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const current = await DayCareAppointment.findById(id);
    if (!current) return res.status(404).json({ message: "Daycare booking not found" });

    // Compute the new schedule values (fallback to current)
    const dateISO = req.body.dateISO ?? current.dateISO;
    const dropOffMinutes =
      req.body.dropOffMinutes != null ? Number(req.body.dropOffMinutes) : current.dropOffMinutes;
    const pickUpMinutes =
      req.body.pickUpMinutes != null ? Number(req.body.pickUpMinutes) : current.pickUpMinutes;

    if (pickUpMinutes <= dropOffMinutes) {
      return res.status(400).json({ message: "pickUpMinutes must be after dropOffMinutes" });
    }

    // Overlap check against other bookings on same day
    const conflict = await DayCareAppointment.findOne({
      _id: { $ne: id },
      dateISO,
      dropOffMinutes: { $lt: pickUpMinutes },
      pickUpMinutes: { $gt: dropOffMinutes },
    });
    if (conflict) {
      return res.status(409).json({ message: "Overlaps another booking." });
    }

    const update = {
      ...req.body,
      dateISO,
      dropOffMinutes,
      pickUpMinutes,
    };

    const updated = await DayCareAppointment.findByIdAndUpdate(id, update, {
      new: true,
      runValidators: true,
    });

    res.json({ ok: true, message: "Daycare booking updated", item: updated });
  } catch (err) {
    next(err);
  }
});


// DELETE /api/daycare/:id → delete
router.delete("/:id", async (req, res, next) => {
  try {
    const gone = await DayCareAppointment.findByIdAndDelete(req.params.id);
    if (!gone) return res.status(404).json({ message: "Daycare booking not found" });
    res.json({ ok: true, message: "Daycare booking deleted" });
  } catch (err) {
    next(err);
  }
});

// PATCH /api/daycare/:id/status
router.patch("/:id/status", async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!["accepted", "rejected", "cancelled", "pending"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }
    const updated = await DayCareAppointment.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).lean();
    if (!updated) return res.status(404).json({ message: "Not found" });
    res.json({ ok: true, item: updated });
  } catch (err) { next(err); }
});


export default router