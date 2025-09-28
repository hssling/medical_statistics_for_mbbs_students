from flask import Flask, request, jsonify

app = Flask(__name__)


@app.route("/optimize", methods=["POST"])
def optimize_content():
    data = request.json
    metrics = data.get("metrics", {})
    current_style = data.get("style", "Narrative")

    # Simple optimization logic
    if metrics.get("engagement_rate", 0) < 3.0:
        new_style = "Engaging + Concise"
    elif metrics.get("impressions", 0) > 1000:
        new_style = "Viral + Informative"
    else:
        new_style = current_style

    return jsonify({"new_style": new_style, "recommendation": "Adjust content style based on performance"})


if __name__ == "__main__":
    app.run(port=5032)
