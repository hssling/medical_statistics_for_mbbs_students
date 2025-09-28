from flask import Flask, request, jsonify


app = Flask(__name__)


@app.route("/check", methods=["POST"])
def check_plagiarism():
    data = request.json
    text = data.get("text")

    try:
        # Simulate plagiarism check
        score = 0.05  # 5% match score
        details = "No significant plagiarism detected."

        return jsonify({"status": "ok", "plagiarism_score": score, "details": details})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)})


if __name__ == "__main__":
    app.run(port=5015)
