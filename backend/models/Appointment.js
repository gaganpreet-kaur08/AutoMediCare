import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
  patientName: String,
  email: String,
  doctor: String,
  date: String,
  time: String,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Appointment", appointmentSchema);
