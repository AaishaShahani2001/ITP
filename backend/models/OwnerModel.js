import mongoose from "mongoose";

const ownerSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  ownerEmail: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  address: {type:String, required: true},
}, { timestamps: true });

export default mongoose.model("Owner", ownerSchema);
