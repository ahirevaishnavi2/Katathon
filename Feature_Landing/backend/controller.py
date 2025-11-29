from flask import Flask, render_template, abort, redirect

import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
FRONTEND_DIR = os.path.abspath(os.path.join(BASE_DIR, "..", "frontend"))
STATIC_DIR = os.path.join(FRONTEND_DIR, "static")

app = Flask(
    __name__,
    template_folder=FRONTEND_DIR,
    static_folder=STATIC_DIR
)

# ============================
# Main Landing Page
# ============================

@app.route("/home")
def index():
    return render_template("home.html")   # will load directly


@app.route("/landing.html")
def eco_routes():
    return render_template("landing.html")


# ============================
# Citizen Mode Pages
# ============================


@app.route("/eco-dashboard")
def live_dashboard():
    return redirect("http://127.0.0.1:5000/")

@app.route("/live-dashboard")
def eco_dashboard():
    return redirect("https://gyatah-ecoroute.onrender.com/map")


@app.route("/personal-dashboard.html")
def personal_dashboard():
    return render_template("personal-dashboard.html")

@app.route("/gamification.html")
def gamification():
    return render_template("gamification.html")

@app.route("/chatbot.html")
def chatbot():
    return render_template("chatbot.html")

@app.route("/community.html")
def community():
    return render_template("community.html")


# ============================
# Expert Mode Pages
# ============================

@app.route("/expert_Landing.html")
def expert_dashboard():
    return render_template("expert_Landing.html")

@app.route("/anomaly-prediction")
def anomaly_prediction():
    return redirect("http://localhost:8000/gyatah_dashboard.html")

@app.route("/analytic-dashboard")
def analytic_dashboard():
    return redirect("https://gyatah-ecoroute.onrender.com/dashboard")


# ============================
# Run the App
# ============================

if __name__ == "__main__":
    app.run(debug=True)
