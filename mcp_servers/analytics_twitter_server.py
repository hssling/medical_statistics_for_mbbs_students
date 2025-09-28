import json
from flask import Flask, request, jsonify

app = Flask(__name__)


@app.route("/metrics", methods=["POST"])
def get_twitter_metrics():
    metrics = {
        "impressions": 2500,
        "engagement": 125,
        "engagement_rate": 5.0
    }
    return jsonify(metrics)


if __name__ == "__main__":
    app.run(port=5030)
