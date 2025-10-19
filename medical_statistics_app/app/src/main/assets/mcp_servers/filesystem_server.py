import os
from flask import Flask, request, jsonify


app = Flask(__name__)

BASE_DIR = os.path.abspath(".")


@app.route("/read", methods=["POST"])
def read_file():
    path = request.json.get("path")
    abs_path = os.path.join(BASE_DIR, path)
    with open(abs_path, "r", encoding="utf-8") as f:
        content = f.read()
    return jsonify({"content": content})


@app.route("/write", methods=["POST"])
def write_file():
    path = request.json.get("path")
    content = request.json.get("content")
    abs_path = os.path.join(BASE_DIR, path)
    os.makedirs(os.path.dirname(abs_path), exist_ok=True)
    with open(abs_path, "w", encoding="utf-8") as f:
        f.write(content)
    return jsonify({"status": "ok", "path": abs_path})


if __name__ == "__main__":
    app.run(port=5005)
