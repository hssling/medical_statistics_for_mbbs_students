import requests
from flask import Flask, request, jsonify


app = Flask(__name__)


@app.route("/search", methods=["POST"])
def search_arxiv():
    query = request.json.get("query")
    url = "http://export.arxiv.org/api/query"
    params = {"search_query": query, "start": 0, "max_results": 20}
    res = requests.get(url, params=params)
    return jsonify({"query": query, "results": res.text})


if __name__ == "__main__":
    app.run(port=5002)
