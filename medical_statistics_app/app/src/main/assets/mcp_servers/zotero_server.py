import requests
from flask import Flask, request, jsonify


app = Flask(__name__)

ZOTERO_API = "https://api.zotero.org/users/{user_id}/items"


@app.route("/search", methods=["POST"])
def search_zotero():
    query = request.json.get("query")
    headers = {"Zotero-API-Key": "YOUR_ZOTERO_API_KEY"}
    res = requests.get(ZOTERO_API, headers=headers, params={"q": query}).json()
    return jsonify(res)


if __name__ == "__main__":
    app.run(port=5006)
