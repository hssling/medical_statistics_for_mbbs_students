import requests
from flask import Flask, request, jsonify


app = Flask(__name__)

API_URL = "https://api.semanticscholar.org/graph/v1/paper/search"


@app.route("/search", methods=["POST"])
def search_scholar():
    query = request.json.get("query")
    params = {
        "query": query,
        "limit": 20,
        "fields": "title,abstract,authors,year,url"
    }
    res = requests.get(API_URL, params=params).json()
    return jsonify(res)


if __name__ == "__main__":
    app.run(port=5003)
