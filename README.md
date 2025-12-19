 # 🏥 AutoMediCare — AI Powered Healthcare Assistant

AutoMediCare is an AI-driven healthcare web application developed as a minor
project by 3rd year Computer Science Engineering students. The platform provides
users with instant AI-based symptom analysis, urgency detection, doctor
recommendations, and appointment booking through a modern web interface.

This project demonstrates the practical use of Large Language Models (LLMs) and
full-stack development to solve real-world healthcare problems.

---

## 🌟 Key Features

- 🤖 AI-based symptom analysis using LLMs  
- ⚠️ Urgency level detection (High / Medium / Low)  
- 🩺 Smart doctor recommendation system  
- 📅 Appointment booking with email confirmation  
- 🌐 Modern, responsive healthcare UI  
- 🔐 Secure backend with environment variables  

---

## 🎯 Project Objectives

- Apply AI to healthcare problem solving  
- Build a full-stack web application using industry tools  
- Integrate external AI APIs in backend services  
- Gain hands-on experience with databases and APIs  
- Create a GitHub-ready academic project  

---

## 🛠️ Tech Stack

*Frontend*
- HTML5  
- CSS3  
- JavaScript  

*Backend*
- Node.js  
- Express.js  
- MongoDB (Mongoose)  

*AI & APIs*
- Groq LLaMA Models (LLM inference)  
- Python-based AI symptom analyzer  

*Tools & Libraries*
- Nodemailer  
- dotenv  
- cors  

---

## 🧠 System Architecture

User → Frontend → Express Backend →  
* Groq LLM (AI analysis & advice)  
* MongoDB (doctor/data storage)  
* Nodemailer (email service) → User  

---

## 📂 Project Structure

AutoMediCare/
├── index.html          # Frontend UI  
├── server.js           # Express backend server  
├── main.py             # Python AI symptom analyzer  
├── package.json        # Node dependencies  
├── package-lock.json  
├── .env                # Environment variables  
├── data/
│   └── doctors.json    # Doctor dataset  
└── README.md  

---

## ⚙️ Environment Setup

Create a .env file in the root directory:

PORT=5000  
MONGO_URI=mongodb://localhost:27017/finalpbl  
GROQ_API_KEY=your_groq_api_key  
EMAIL_USER=your_email@gmail.com  
EMAIL_PASS=your_app_password  

> ⚠️ Do NOT push .env to GitHub.

---

## ▶️ Installation & Run

1️⃣ Install dependencies  
npm install  

2️⃣ Start backend server  
npm start  
or  
npm run dev  

Backend runs at:  
http://localhost:5000  

3️⃣ Open frontend  
Open index.html in your browser.

---

## 🔌 API Endpoints

GET /  
→ Server health check  

POST /api/agent/ask  
→ AI symptom analysis  
Request:
{
  "text": "I have fever and headache"
}

GET /api/doctors  
→ Get list of doctors  

POST /api/appointments/book  
→ Book appointment  
Request:
{
  "name": "User Name",
  "email": "user@gmail.com",
  "doctor": "Dr. ABC",
  "date": "2025-01-01",
  "time": "10:00 AM"
}

---

## 🧪 Python AI Module

Run:
python main.py  

Enter symptoms to get structured AI analysis.

---

## ⚠️ Disclaimer

AutoMediCare is developed for educational purposes only.  
It does not replace professional medical consultation.  
Always consult a qualified doctor for real medical issues.

---


## 🚀 Future Enhancements

- User authentication & profiles  
- Medical history tracking  
- Report upload & analysis  
- Multi-language support  
- Cloud deployment  
- Mobile application  

---

## ⭐ Acknowledgements

- Groq API for AI models  
- Open-source community  
- Faculty mentors for guidance  

---

⭐ If you find this project useful, give it a star on GitHub!