import os
import json
from flask import Flask, request, jsonify
from pyvis.network import Network


app = Flask(__name__)

os.makedirs("dashboards", exist_ok=True)


@app.route("/generate", methods=["POST"])
def generate_interactive_graph():
    data = request.json
    papers = data.get("papers", [])
    filename = f"dashboards/{data.get('name','interactive_graph')}.html"

    try:
        net = Network(height="750px", width="100%", bgcolor="#222222", font_color="white", directed=True)

        for p in papers:
            title = p["title"]
            net.add_node(title, label=title, color="skyblue")
            for cited in p.get("cited_by", []):
                net.add_node(cited, label=cited, color="lightgreen")
                net.add_edge(title, cited)

        net.show(filename)
        return jsonify({"status": "ok", "file": filename})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)})


if __name__ == "__main__":
    app.run(port=5010)
