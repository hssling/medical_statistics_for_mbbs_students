import requests
from flask import Flask, request, jsonify


app = Flask(__name__)


API_KEY = "YOUR_DALL_E_API_KEY"  # Replace with actual API key
API_URL = "https://api.openai.com/v1/images/generations"


@app.route("/generate", methods=["POST"])
def generate_image():
    prompt = request.json.get("prompt")
    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json"
    }
    data = {
        "prompt": prompt,
        "n": 1,
        "size": "512x512"
    }
    res = requests.post(API_URL, headers=headers, json=data)
    if res.status_code == 200:
        return jsonify({"image_url": res.json()["data"][0]["url"]})
    else:
        return jsonify({"error": "Image generation failed"}), 500


if __name__ == "__main__":
    app.run(port=5007)
