# Gatyah 

A Flask application with **MongoDB** database integration for urban analytics, traffic patterns, and eco-friendly route planning.

## Features

- **MongoDB Database** - User profiles, badges, community posts, analytics
- **ML Clustering** - KMeans clustering for zone pattern analysis
- **TomTom API Integration** - POI search, routing, traffic data
- **OpenAI Integration** - AI-powered insights and chatbot
- **Eco Points System** - Gamified rewards for eco-friendly actions
- **Community Feed** - User-generated posts and upvotes
- **Leaderboard** - Top eco-commuters ranking

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


## Database Schema

The app creates these tables automatically:

- **users** - User profiles, eco points, green scores
- **badges** - Earned badges
- **community_posts** - User posts
- **location_analytics** - Location pattern analysis
- **user_routes** - Saved routes

community posts exist
