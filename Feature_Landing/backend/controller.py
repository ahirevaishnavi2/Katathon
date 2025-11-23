# app.py
from flask import Flask, render_template, jsonify, request
import json

app = Flask(__name__)

# Main landing page
@app.route('/')
def index():
    return render_template('index.html')

# Citizen Mode Pages
@app.route('/eco-routes')
def eco_routes():
    return render_template('eco-routes.html')

@app.route('/live-dashboard')
def live_dashboard():
    return render_template('live-dashboard.html')

@app.route('/personal-dashboard')
def personal_dashboard():
    return render_template('personal-dashboard.html')

@app.route('/gamification')
def gamification():
    return render_template('gamification.html')

@app.route('/chatbot')
def chatbot():
    return render_template('chatbot.html')

@app.route('/community')
def community():
    return render_template('community.html')

# Expert Mode Pages
@app.route('/expert-dashboard')
def expert_dashboard():
    return render_template('expert-dashboard.html')

@app.route('/expert-analytics')
def expert_analytics():
    return render_template('expert-analytics.html')

# API endpoints for data
@app.route('/api/user-data')
def get_user_data():
    # Sample user data - in a real app, this would come from a database
    user_data = {
        "name": "Alex Johnson",
        "eco_score": 85,
        "carbon_saved": "124 kg",
        "routes_taken": 47,
        "badges": 5
    }
    return jsonify(user_data)

@app.route('/api/route-data')
def get_route_data():
    # Sample route data
    route_data = {
        "eco_routes": [
            {"name": "Work Commute", "savings": "2.3 kg CO2", "time": "25 min"},
            {"name": "Grocery Run", "savings": "1.1 kg CO2", "time": "15 min"},
            {"name": "Weekend Trip", "savings": "5.7 kg CO2", "time": "45 min"}
        ]
    }
    return jsonify(route_data)

@app.route('/api/community-stats')
def get_community_stats():
    # Sample community data
    community_stats = {
        "total_users": 12543,
        "total_co2_saved": "245,321 kg",
        "active_challenges": 7,
        "top_performers": [
            {"name": "EcoWarrior22", "score": 95},
            {"name": "GreenTraveler", "score": 92},
            {"name": "SustainableSam", "score": 89}
        ]
    }
    return jsonify(community_stats)

if __name__ == '__main__':
    app.run(debug=True)