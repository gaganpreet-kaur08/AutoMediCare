import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema({
  name: String,
  specialty: String,
  hospital: String,
  available: Boolean,
  availabilityTime: [String]
});

export default mongoose.model("Doctor", doctorSchema);
