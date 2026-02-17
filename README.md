# 🌿 AyurShield

### AI-Powered Integrative Health Safety Platform
#### *Bridging Ancient Wisdom with Modern Safety*

---

### 📖 Project Overview

**AyurShield** is a full-stack health intelligence platform designed to solve the "Silent Interaction Crisis" between modern allopathic drugs and Ayurvedic supplements. While millions of patients mix these two systems, there is often zero scientific oversight, leading to dangerous side effects (e.g., internal bleeding from mixing Warfarin and Ginger).

AyurShield acts as a computational "Translation Layer," using a pharmacological rule engine and AI to detect critical safety risks. Beyond simple interaction checking, it leverages **Bio-Weather intelligence** and **Computer Vision** to provide personalized lifestyle and dietary advice based on the user's Body Type (*Vikriti*) and the current Season (*Ritucharya*).

---

### 🎯 Core Objectives

* **Prevent Adverse Drug Reactions (ADRs):** Instantly flag dangerous combinations of synthetic drugs and natural herbs using verified pharmacological data.
* **Context-Aware Safety:** Move beyond static advice by integrating real-time environmental data (Season/Weather) to recommend or forbid specific herbs.
* **AI-Driven Diet Analysis:** Utilize Generative AI (Vision) to analyze food images and determine their suitability for a specific body type.
* **Accessible Education:** Demystify Ayurveda with an AI chatbot that answers wellness questions with scientific grounding.

---

### 🧠 System Architecture & Logic

The project implements a **Hybrid Intelligence** approach, combining a deterministic "Rule Engine" for critical safety checks with "Generative AI" for contextual advice and visual analysis.

#### 🔹 Component Breakdown

| Component | Technology | Role & Specialty |
| :--- | :--- | :--- |
| **Safety Engine** | Node.js (Express) | A deterministic logic layer that cross-references user inputs against a curated JSON database of drug-herb interactions. |
| **AI Brain** | Google Gemini 1.5 | Handles natural language queries (Chatbot) and visual analysis (Food Scanner) for nuanced health advice. |
| **Bio-Weather** | OpenWeather API | Fetches real-time location data to determine the current "Ayurvedic Season" (e.g., Pitta/Summer) for dynamic warnings. |
| **Frontend** | React + Vite | A responsive, component-based UI featuring real-time alerts, camera integration, and smooth animations. |

---

### 🔁 The Analysis Pipeline

1.  **Input:** User enters a Drug (e.g., Warfarin) and an Herb (e.g., Ginger) OR uploads a food image.
2.  **Context Injection:** The system automatically retrieves the user's *Vikriti* (Body Type) from the profile and the current *Season* from the weather API.
3.  **Processing:**
    * *Interaction Check:* The backend scans `medicines.json` and `herbs.json` for tag conflicts (e.g., `anticoagulant` match).
    * *Vision Analysis:* Gemini API analyzes the food image to identify ingredients and match properties against the user's context.
4.  **Response:**
    * 🔴 **Red Alert:** "Critical Interaction Detected" (e.g., Bleeding Risk).
    * 🟡 **Yellow Alert:** "Seasonal Warning" (e.g., Heating herb in Summer).
    * 🟢 **Green Check:** Safe to combine.

---

### 📊 Knowledge Base & AI Integration

* **Curated Database:** Custom-built JSON datasets containing pharmacological tags (`anticoagulant`, `sedative`, `hypoglycemic`) for common modern drugs and Ayurvedic herbs.
* **Gemini Vision:** Utilizes the multimodal capabilities of Gemini 1.5 Flash to recognize food items from raw images and generate structured JSON health assessments.
* **Performance:** The Rule Engine delivers sub-100ms responses for safety checks, ensuring immediate feedback for critical queries.

---

### 🛠️ Tech Stack

#### 🔬 Artificial Intelligence & Data
* **Model:** Google Gemini 1.5 Flash (Generative Text & Vision)
* **Data Structure:** JSON-based Relational Mapping
* **External Data:** OpenWeatherMap API

#### 💻 Backend API
* **Runtime:** Node.js
* **Framework:** Express.js
* **Middleware:** CORS, Multer (File Handling)

#### 🎨 Frontend UI
* **Library:** React.js (Vite)
* **Styling:** Tailwind CSS
* **Icons:** Lucide React
* **State Management:** React Hooks & LocalStorage

---

### 🚀 Key Features

* **Drug-Herb Interaction Checker:** Binary Safe/Unsafe verdicts based on chemical properties.
* **Bio-Weather Engine:** Auto-detects "Pitta" (Summer) or "Vata" (Winter) seasons to adjust herb recommendations dynamically.
* **AyurVision Food Scanner:** "Snap & Check" functionality to see if a meal suits your specific body type.
* **AyurBot:** An empathetic AI assistant for personalized wellness coaching.
* **Profile Persistence:** Saves user medical history and body type locally for privacy-focused personalization.

---

### 📌 Project Status

* ✅ **Completed:** Core Safety Engine, Frontend UI, Weather Integration, Gemini Chatbot & Vision integration.
* ✅ **Deployed:** Backend live on Render, Frontend live on Vercel/Firebase.
* 🚧 **In Progress:** Expanding the database to cover 500+ rare herbs.

---

### 🔮 Future Enhancements

* **OCR Integration:** Scan prescription papers directly instead of typing drug names.
* **Doctor Dashboard:** Allow practitioners to verify and override AI recommendations.
* **Community Verified Database:** A crowdsourced platform for Ayurvedic doctors to contribute interaction data.

