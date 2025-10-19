import requests
from flask import Flask, request, jsonify


app = Flask(__name__)


@app.route("/search", methods=["POST"])
def search_pubmed():
    query = request.json.get("query")
    url = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi"
    params = {
        "db": "pubmed",
        "term": query,
        "retmode": "json",
        "retmax": 25
    }
    res = requests.get(url, params=params).json()
    return jsonify(res)


if __name__ == "__main__":
    app.run(port=5001)
