import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Groq from "groq-sdk";
import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";
import mongoose from "mongoose";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());


const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected");
  } catch (err) {
    console.error("❌ MongoDB Error:", err.message);
  }
};
connectDB();

function loadDoctors() {
  try {
    const filePath = path.join(__dirname, "data", "doctors.json");
    if (!fs.existsSync(filePath)) return [];
    const data = fs.readFileSync(filePath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("❌ Error loading doctors.json:", error.message);
    return [];
  }
}

if (!process.env.GROQ_API_KEY) {
  console.error("❌ GROQ_API_KEY missing in .env");
}

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});


app.get("/", (req, res) => {
  res.send("✅ AutoMediCare Backend is running!");
});


app.post("/api/agent/ask", async (req, res) => {
  try {
    const userInput = req.body.text || req.body.message || req.body.prompt;

    if (!userInput) return res.status(400).json({ error: "No text provided" });

    const analysisPrompt = `
Analyze this medical concern and respond in ONLY valid JSON:
{
  "category": "Emergency/Urgent Care/General/Specialist",
  "urgencyLevel": "High/Medium/Low",
  "precautions": "Safety steps",
  "symptoms": ["list", "of", "symptoms"],
  "doctorType": "Specialization needed",
  "reasoning": "Why this category"
}
Concern: "${userInput}"
`;

    const analysisResponse = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [{ role: "user", content: analysisPrompt }],
      temperature: 0.1
    });

    let analysis;
    try {
      const rawText = analysisResponse.choices[0].message.content.trim();
      const cleanJson = rawText.replace(/```json|```/g, "");
      analysis = JSON.parse(cleanJson);
    } catch (err) {
      analysis = {
        category: "General",
        urgencyLevel: "Low",
        symptoms: [],
        doctorType: "General Physician"
      };
    }

    // --- Generate professional medical advice (precautions) using the analysis ---
    let medicalAdvice = "";
    try {
      const advicePrompt = `Given these symptoms: ${analysis.symptoms?.join(", ") || "N/A"}\nUrgency Level: ${analysis.urgencyLevel || analysis.urgency || "Unknown"}\nCategory: ${analysis.category || "General"}\n\nProvide professional medical advice for: ${userInput}\nInclude:\n1. Immediate steps to take\n2. Warning signs to watch for\n3. When to seek emergency care\nBe professional and emphasize safety.`;

      const adviceResponse = await groq.chat.completions.create({
        model: "llama-3.1-8b-instant",
        messages: [{ role: "user", content: advicePrompt }],
        temperature: 0.1
      });

      medicalAdvice = adviceResponse.choices[0].message.content.trim().replace(/```/g, "");
    } catch (err) {
      console.error("❌ Advice generation error:", err.message || err);
      medicalAdvice = analysis.precautions || "";
    }

    // Match doctor
    const doctors = loadDoctors();
    const bestDoctor = doctors.find(doc =>
      doc.specialization.toLowerCase().includes(analysis.doctorType.toLowerCase())
    ) || doctors.find(doc => doc.specialization === "General Physician");

    const isEmergency = analysis.urgencyLevel === "High";

    res.json({
      category: analysis.category,
      urgency: analysis.urgencyLevel,
      // Prefer model-generated advice if available, otherwise fall back to analysis.precautions
      precaution: (analysis.precautions && analysis.precautions.trim()) ? analysis.precautions : (medicalAdvice || ""),
      precautions: (analysis.precautions && analysis.precautions.trim()) ? analysis.precautions : (medicalAdvice || ""),
      medicalAdvice: medicalAdvice || "",
      suggestedDoctor: {
        name: bestDoctor?.name || "Dr. Sahil",
        specialty: bestDoctor?.specialization || "General Physician",
        hospital: bestDoctor?.hospital || "City Hospital",
        available: bestDoctor?.available ?? true
      },
      isEmergency
    });

  } catch (error) {
    console.error("❌ GROQ ERROR:", error);
    res.status(500).json({ error: "AI Agent failed to process request" });
  }
});

// 2. FETCH ALL DOCTORS
app.get("/api/doctors", (req, res) => {
  const doctors = loadDoctors();
  res.json(doctors);
});


app.post("/api/appointments/book", async (req, res) => {
  const { name, email, doctor, date, time } = req.body;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { 
      user: process.env.EMAIL_USER, 
      pass: process.env.EMAIL_PASS 
    }
  });

  try {
    await transporter.sendMail({
      from: `"AutoMediCare" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Appointment Confirmation",
      html: `<h3>Appointment Confirmed ✅</h3>
             <p>Hi ${name}, your appointment with ${doctor} is scheduled for ${date} at ${time}.</p>`
    });
    res.json({ message: "Success! Confirmation email sent." });
  } catch (err) {
    console.error("❌ Email Error:", err);
    res.status(500).json({ error: "Could not send email" });
  }
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
