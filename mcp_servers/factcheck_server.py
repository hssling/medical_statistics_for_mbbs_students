from flask import Flask, request, jsonify


app = Flask(__name__)


@app.route("/check", methods=["POST"])
def check_facts():
    data = request.json
    claims = data.get("claims", [])

    try:
        # Simulate fact-checking
        results = []
        for claim in claims:
            results.append({"claim": claim, "verified": True, "supporting_evidence": "Verified by trusted sources"})

        return jsonify({"status": "ok", "fact_checks": results})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)})


if __name__ == "__main__":
    app.run(port=5016)
