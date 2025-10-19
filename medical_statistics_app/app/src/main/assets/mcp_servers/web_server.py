import requests
from flask import Flask, request, jsonify


app = Flask(__name__)


@app.route("/search", methods=["POST"])
def search_web():
    query = request.json.get("query")
    url = "https://api.duckduckgo.com/"
    params = {"q": query, "format": "json"}
    res = requests.get(url, params=params).json()
    return jsonify(res)


if __name__ == "__main__":
    app.run(port=5004)
