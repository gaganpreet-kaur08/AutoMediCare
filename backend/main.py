import os
import json
from dotenv import load_dotenv
from groq import Groq

load_dotenv()

# GROQ CONFIG
# --------------------------
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
if not GROQ_API_KEY:
    raise ValueError("GROQ_API_KEY missing in .env")

groq = Groq(api_key=GROQ_API_KEY)

# --------------------------
# FUNCTION TO ANALYZE SYMPTOMS
# --------------------------
def analyze_symptoms(user_input):
    prompt = f"""
Analyze this medical concern and respond in ONLY valid JSON:
{{
  "category": "Emergency/Urgent Care/General/Specialist",
  "urgencyLevel": "High/Medium/Low",
  "precautions": "Safety steps",
  "symptoms": ["list", "of", "symptoms"],
  "doctorType": "Specialization needed",
  "reasoning": "Why this category"
}}
Concern: "{user_input}"
"""

    try:
        response = groq.chat.completions.create(
            model="llama3-70b-8192",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.1
        )

        raw_text = response.choices[0].message.content.strip()
        clean_text = raw_text.replace("```json", "").replace("```", "")
        result = json.loads(clean_text)
        return result

    except Exception as e:
        print("❌ Error analyzing symptoms:", e)
        return {
            "category": "General",
            "urgencyLevel": "Low",
            "symptoms": [],
            "doctorType": "General Physician",
            "precautions": "",
            "reasoning": ""
        }

# --------------------------
# TEST
# --------------------------
if __name__ == "__main__":
    user_input = input("Enter your medical concern: ")
    analysis = analyze_symptoms(user_input)
    print("\n--- Analysis Result ---")
    print(json.dumps(analysis, indent=2))
