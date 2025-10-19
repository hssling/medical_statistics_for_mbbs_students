import os
import json
from flask import Flask, jsonify, send_from_directory

app = Flask(__name__)

NOTES_DIR = "notes"

@app.route("/dashboard")
def get_dashboard():
    # Load schedules
    schedules = []
    if os.path.exists(os.path.join(NOTES_DIR, "schedules.json")):
        with open(os.path.join(NOTES_DIR, "schedules.json")) as f:
            schedules = json.load(f)

    # Load publications
    publications = []
    pub_files = ["published.json", "published_urls.json", "published_metrics.json"]
    for f in pub_files:
        if os.path.exists(os.path.join(NOTES_DIR, f)):
            with open(os.path.join(NOTES_DIR, f)) as file:
                publications.extend(json.load(file))

    # Load analytics
    analytics = {}
    if os.path.exists(os.path.join(NOTES_DIR, "performance_history.json")):
        with open(os.path.join(NOTES_DIR, "performance_history.json")) as f:
            analytics = json.load(f)

    # Load feedback
    feedback = []
    if os.path.exists(os.path.join(NOTES_DIR, "optimization_feedback.json")):
        with open(os.path.join(NOTES_DIR, "optimization_feedback.json")) as f:
            feedback = json.load(f)

    # Generate HTML dashboard
    html = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <title>AI Content Creator Dashboard</title>
        <style>
            body {{ font-family: Arial, sans-serif; margin: 20px; }}
            .section {{ margin-bottom: 30px; }}
            .schedule {{ background: #e8f4fd; padding: 10px; margin: 5px 0; border-radius: 5px; }}
            .publication {{ background: #f0f8e0; padding: 10px; margin: 5px 0; border-radius: 5px; }}
            .metric {{ background: #fff0e8; padding: 10px; margin: 5px 0; border-radius: 5px; }}
            .feedback {{ background: #ffe0e8; padding: 10px; margin: 5px 0; border-radius: 5px; }}
            h1 {{ color: #2c3e50; }}
            h2 {{ color: #34495e; border-bottom: 2px solid #ecf0f1; padding-bottom: 5px; }}
        </style>
    </head>
    <body>
        <h1>🚀 AI Content Creator Dashboard</h1>

        <div class="section">
            <h2>📅 Upcoming Scheduled Content ({len(schedules)})</h2>
            {"".join([
                f"<div class='schedule'>"
                f"<strong>{s['content_type']}</strong> - {s['topics'][0]}<br>"
                f"Time: {s['time']}, Frequency: {s['frequency']}<br>"
                f"Style: {s['style']}, Platforms: {', '.join(s.get('publish_to', []))}"
                f"</div>" for s in schedules[:10]
            ])}
        </div>

        <div class="section">
            <h2>📢 Recent Publications ({len(publications)})</h2>
            {"".join([
                f"<div class='publication'>"
                f"<strong>{pub.get('type', 'Content')}</strong> - {pub.get('topic', 'N/A')}<br>"
                f"Platform: {pub.get('platform', 'N/A')}, URL: {pub.get('url', 'N/A')}<br>"
                f"Published: {pub.get('timestamp', 'N/A')}"
                f"</div>" for pub in publications[:10]
            ])}
        </div>

        <div class="section">
            <h2>📊 Recent Analytics ({len(analytics)} data points)</h2>
            {"".join([
                f"<div class='metric'>"
                f"<strong>{data.get('platform', 'Unknown')}</strong> - {data.get('content_type', 'Content')}<br>"
                f"Engagement: {data.get('metrics', {}).get('engagement_rate', 0)}%<br>"
                f"Impressions: {data.get('metrics', {}).get('impressions', 0)}<br>"
                f"Date: {data['timestamp'][:10]}"
                f"</div>" for data in analytics[-5:]
            ])}
        </div>

        <div class="section">
            <h2>🤖 AI Feedback & Recommendations ({len(feedback)} items)</h2>
            {"".join([
                f"<div class='feedback'>"
                f"<strong>Recommendation:</strong> {rec.get('recommendation', 'N/A')}<br>"
                f"<strong>New Style:</strong> {rec.get('new_style', 'N/A')}<br>"
                f"<strong>Target Platform:</strong> {rec.get('platform', 'N/A')}<br>"
                f"Date: {rec.get('timestamp', 'N/A')[:10]}"
                f"</div>" for rec in feedback[-5:]
            ])}
        </div>

        <div class="section">
            <h2>📈 Performance Summary</h2>
            <p>Total Scheduled Content: {len(schedules)}</p>
            <p>Total Publications: {len(publications)}</p>
            <p>Average Engagement Rate: {sum([data.get('metrics', {}).get('engagement_rate', 0) for data in analytics]) / max(len(analytics), 1):.1f}%</p>
            <p>AI Feedback Actions: {len(feedback)}</p>
        </div>
    </body>
    </html>
    """
    return html


if __name__ == "__main__":
    app.run(port=5023)
