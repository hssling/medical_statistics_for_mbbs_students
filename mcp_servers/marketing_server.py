from flask import Flask, request, jsonify


app = Flask(__name__)


@app.route("/generate", methods=["POST"])
def generate_marketing():
    data = request.json
    topic = data.get("topic")

    try:
        # Simulate marketing generation
        headlines = [f"Transform Your Knowledge: {topic}", f"Unlock the Power of {topic}", f"Master {topic} Today"]
        taglines = [f"{topic}: Make It Real", f"Empower Through {topic}", f"{topic} Done Right"]
        ad_variations = [f"Discover {topic} secrets", f"Expert guidance on {topic}", f"Start learning {topic}"]

        return jsonify({"headlines": headlines, "taglines": taglines, "ad_variations": ad_variations})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)})


if __name__ == "__main__":
    app.run(port=5018)
