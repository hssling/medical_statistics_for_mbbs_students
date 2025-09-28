from flask import Flask, request, jsonify
from datetime import datetime
import json
import os

app = Flask(__name__)

NOTES_DIR = "notes"
PERF_DATA_FILE = os.path.join(NOTES_DIR, "performance_history.json")

def load_performance_history():
    if os.path.exists(PERF_DATA_FILE):
        with open(PERF_DATA_FILE, 'r') as f:
            return json.load(f)
    return []

def save_performance_history(data):
    with open(PERF_DATA_FILE, 'w') as f:
        json.dump(data, f, indent=2)

@app.route("/optimize_schedule", methods=["POST"])
def optimize_schedule():
    data = request.json
    content_type = data.get("content_type")
    platform = data.get("platform")
    metrics = data.get("metrics", {})

    # Load historical performance
    history = load_performance_history()

    # Analysis logic
    engagement_rate = metrics.get("engagement_rate", 0)
    impressions = metrics.get("impressions", 0)

    # Simple learning logic
    optimal_time = "10:00"  # default
    if engagement_rate > 5.0 and impressions > 2000:
        optimal_time = "08:00"  # Peak time
    elif engagement_rate < 2.0:
        optimal_time = "14:00"  # Different time zone

    # Adjust posting strategy
    adjusted_style = "Engaging + Concise" if engagement_rate > 3.0 else "Informative + Detailed"

    # Save learning
    history.append({
        "timestamp": datetime.now().isoformat(),
        "content_type": content_type,
        "platform": platform,
        "metrics": metrics,
        "optimal_time": optimal_time,
        "recommended_style": adjusted_style
    })
    save_performance_history(history)

    return jsonify({
        "new_optimal_time": optimal_time,
        "recommended_style": adjusted_style,
        "confidence_score": min(engagement_rate * 10, 100)  # Simple confidence metric
    })


if __name__ == "__main__":
    app.run(port=5033)
