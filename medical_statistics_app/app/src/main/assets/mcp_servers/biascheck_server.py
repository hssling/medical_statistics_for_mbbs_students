from flask import Flask, request, jsonify


app = Flask(__name__)


@app.route("/check", methods=["POST"])
def check_bias():
    data = request.json
    text = data.get("text")

    try:
        # Simulate bias detection
        bias_score = 0.02  # Low bias
        biases = ["Cultural bias detected in examples", "Potential geographic bias"]
        recommendations = ["Include diverse examples from different cultures"]

        return jsonify({"status": "ok", "bias_score": bias_score, "detected_biases": biases, "recommendations": recommendations})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)})


if __name__ == "__main__":
    app.run(port=5017)
