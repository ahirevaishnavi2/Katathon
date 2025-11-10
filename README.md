# Gatyah - Where Motion is Intelligent
### **Overview**

**Gyatah**  is an **AI-driven, real-time geo-intelligence platform** that analyzes traffic, mobility, and environmental data to build smarter, greener cities.  
It blends **AI + ML analytics**, **TomTom APIs**, and **gamified sustainability mechanics** to create a dual-layer ecosystem for both citizens and experts — making urban mobility intelligent, data-driven, and eco-conscious.

---

## 🚦 **Core Idea**

Gyatah empowers users and planners to visualize, predict, and optimize urban flow and environmental impact:

- **Citizens** get real-time eco-friendly route suggestions, AQI insights, and rewards for green behavior.  
- **Experts & Planners** get dashboards with heatmaps, ML analytics, and predictive environmental correlations.

> “Gyatah — Where Motion is Intelligent.”

---

## 🧠 **Key Features**

### 🌐 **Citizen Mobile App**

- **Live Map Feed:** Real-time AQI, noise, traffic levels, and nearby POIs using TomTom APIs.  
- **Eco Route Planner:** Compares eco-friendly vs. fastest routes with CO₂ savings.  
- **Eco Points & Gamification:**  
  - +50 → Public Transport  
  - +30 → Shared Travel  
  - +25 → Off-Peak Travel  
  - +100 → Community Participation  
- **FOMO-driven Sustainability:** Encourages users to maintain high Eco Scores — just like fitness streaks and social badges.  
- **Community & Leaderboard:** Engage, share, and compete in eco-challenges.  
- **AI Chatbot Assistant:** OpenAI-powered guide for mobility, environment, and sustainability queries.

---

### 🏙️ **Expert Web Dashboard**

- **Dual Mode Integration:**  
  - *Citizen View:* Simplified, emoji-based eco-map.  
  - *Expert View:* Analytical dashboard with visualized insights.  
- **Central Eco-Dashboard:** Tracks active sensors, cognition alerts, and environmental correlations.  
- **ML Analytics Suite:**  
  - Traffic Prediction vs. Actual  
  - AQI vs. Traffic Correlation  
  - Weekly Peak-Hour Patterns  
  - Noise & Pollution Heatmaps  
- **Reports & Analytics:** Data-driven conclusions for Smart City & policy interventions.

---


## Features

- **MongoDB Database** - User profiles, badges, community posts, analytics
- **ML Clustering** - KMeans clustering for zone pattern analysis
- **TomTom API Integration** - POI search, routing, traffic data
- **OpenAI Integration** - AI-powered insights and chatbot
- **Eco Points System** - Gamified rewards for eco-friendly actions
- **Community Feed** - User-generated posts and upvotes
- **Leaderboard** - Top eco-commuters ranking


---

## 🧩 **Tech Stack**

| Layer             | Technology                                    |
| ----------------- | --------------------------------------------- |
| **Frontend**      | HTML5, CSS3, JavaScript, TypeScript           |
| **Backend**       | Flask (Python)                                |
| **Database**      | MongoDB                                       |
| **APIs**          | TomTom (Maps, POI, Routing, Traffic), OpenAI  |
| **ML/AI**         | KNN, K-Means, CNN, Regression, Apriori        |
| **Visualization** | Interactive Heatmaps, Circular Gauges, Charts |

---

## 💡 **Unique Selling Points (USP)**

- **Dual-Mode Ecosystem:** Citizen simplicity + Expert analytics in one unified system.  
- **FOMO-Driven Sustainability:** Turns eco-behavior into social competition — green FOMO for lasting impact.  
- **AI + ML Intelligence:** Predicts congestion and pollution *before* they occur.  
- **GeoSense Integration:** Real-time data fusion from TomTom, AQI sensors, and mobility APIs.  
- **Sustainability Credit System:** Transforms eco-actions into socially visible achievements.

---

## Prerequisites

1. **MongoDB Database** - You need a MongoDB database running
   - Local: Install MongoDB locally
   - Cloud: Use MongoDB Atlas (free tier available)

2. **Python 3.11+**

3. **API Keys**:
   - TomTom API Key (from https://developer.tomtom.com/)
   - OpenAI API Key (from https://platform.openai.com/)

## Setup Instructions

### 1. Install Dependencies

```bash
cd AimlMapInsights
python -m venv .venv
.\.venv\Scripts\Activate.ps1  # Windows PowerShell
pip install -r requirements.txt
```

### 2. Configure Environment Variables

Create a `.env` file in the `AimlMapInsights` folder:

```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/
DATABASE_NAME=aimlmapinsights

# OR for MongoDB Atlas (cloud):
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/
# DATABASE_NAME=aimlmapinsights

# API Keys
TOMTOM_API_KEY=YOUR_TOMTOM_API_KEY
OPENAI_API_KEY=YOUR_OPENAI_API_KEY

# Session Secret (optional)
SESSION_SECRET=your-secret-key-here
```

### 3. MongoDB Setup

#### Option A: Local MongoDB (Recommended for Development)

1. **Install MongoDB Community Edition**:
   - Windows: Download from https://www.mongodb.com/try/download/community
   - Or use Chocolatey: `choco install mongodb`
   
2. **Start MongoDB Service**:
   ```bash
   # Windows - MongoDB usually starts automatically as a service
   # Check if running:
   net start MongoDB
   ```

3. **Verify Installation**:
   ```bash
   mongosh  # Opens MongoDB shell
   # Or: mongo (older versions)
   ```

4. **Update `.env`**:
   ```
   MONGODB_URI=mongodb://localhost:27017/
   DATABASE_NAME=aimlmapinsights
   ```


### 5. Run the Application

```bash
python app.py
```

The app will run on `http://localhost:5000`



## 📊 **Datasets Used**
- [Vehicle Emission Dataset](https://www.kaggle.com/datasets/s3programmer/vehcle-emission-dataset)  
- [Air Pollution Data of India (2020–2023)](https://www.kaggle.com/datasets/seshupavan/air-pollution-data-of-india-2020-2023)  
- [AQI Air Quality Index Dataset](https://www.kaggle.com/datasets/azminetoushikwasi/aqi-air-quality-index-scheduled-daily-update)

---

## 🚀 **Demo & Repository**

- **Mobile App Demo:** [View Demo](https://drive.google.com/file/d/13FUB_BTgj8aNR-Fe4f_Goq0LWL2ZD5Vc/view?usp=drive_link)  
- **Website Demo:** [View Demo](https://drive.google.com/file/d/1HQcChlEwSWkaLwUpcOrgU_Qo-Zf1q2rO/view?usp=sharing)   
- **Demo Video Folder:** [Google Drive](https://drive.google.com/drive/folders/1WPglLx0PNMoKTtQnBXeq91NgMV_8fMQL?usp=drive_link)

---
## 👩‍💻 **Team Gyatah**


| Name | Department | City |
|------|-------------|------|
| **Aarya Kulkarni** | ENTC (2903) | Pune-27 |
| **Vaishnavi Ahire** | Comp (2851) | Pune-27 |
| **Shivanshi Gupta** | DS (1386) | Mumbai-26 |
| **Pranjal Mohite** | AI & DS (2718) | Pune-26 |
| **Prerna Pal** | DS (1368) | Mumbai-26 |

---

**“Where Motion is Intelligent.”**  
Built with passion by innovators striving for **sustainable urban intelligence**.

---
