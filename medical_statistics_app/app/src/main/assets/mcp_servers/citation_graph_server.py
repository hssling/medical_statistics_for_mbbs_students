import os
import json
import networkx as nx
import matplotlib.pyplot as plt
from flask import Flask, request, jsonify


app = Flask(__name__)

os.makedirs("diagrams", exist_ok=True)


@app.route("/generate", methods=["POST"])
def generate_citation_graph():
    data = request.json
    papers = data.get("papers", [])
    filename = f"diagrams/{data.get('name','citation_graph')}.png"

    try:
        G = nx.DiGraph()

        # Build graph: each paper has "title" and "cited_by"
        for p in papers:
            G.add_node(p["title"])
            for cited in p.get("cited_by", []):
                G.add_node(cited)
                G.add_edge(p["title"], cited)

        # Draw graph
        plt.figure(figsize=(12, 8))
        nx.draw_networkx(
            G,
            node_size=800,
            font_size=8,
            font_weight="bold",
            node_color="lightblue",
            edge_color="gray",
            arrows=True
        )
        plt.axis("off")
        plt.savefig(filename, format="PNG", bbox_inches="tight")
        plt.close()

        return jsonify({"status": "ok", "file": filename})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)})


if __name__ == "__main__":
    app.run(port=5009)
