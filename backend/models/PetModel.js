import mongoose from "mongoose";

const petSchema = new mongoose.Schema({
  owner: { type: String, required: true },
  name: { type: String, required: true },
  type: { type: String, required: true },
  breed: { type: String },
  age: { type: Number},
}, { timestamps: true });

export default mongoose.model("Pet", petSchema);
