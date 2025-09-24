import mongoose from "mongoose";

const GroomingAppointmentSchema = new mongoose.Schema(
  {
    ownerName: { type: String, required: true, trim: true },
    phone:     { type: String, required: true, trim: true },
    email:     { type: String, required: true, trim: true, lowercase: true },

    petType:   { type: String, required: true, enum: ["Dog","Cat","Rabbit","Bird","Other"] },
    packageId: { type: String, required: true },

    dateISO:         { type: String, required: true },  // "YYYY-MM-DD"
    timeSlotMinutes: { type: Number, required: true },   // minutes from 00:00 (e.g. 10:30 AM = 630)

    notes: { type: String, default: "", trim: true },

  status: {
    type: String,
    enum: ["pending", "accepted", "rejected", "cancelled"],
    default: "pending",
  },
  paymentStatus: {
    type: String,
    enum: ["unpaid", "paid"],
    default: "unpaid",
  },
},
  { timestamps: true }
);

// prevent double-booking same slot
GroomingAppointmentSchema.index({ dateISO: 1, timeSlotMinutes: 1 }, { unique: true });

export default mongoose.model("GroomingAppointment", GroomingAppointmentSchema);
