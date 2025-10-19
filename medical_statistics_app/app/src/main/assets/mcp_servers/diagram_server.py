import os
import subprocess
from flask import Flask, request, jsonify


app = Flask(__name__)

os.makedirs("diagrams", exist_ok=True)


@app.route("/generate", methods=["POST"])
def generate_diagram():
    data = request.json
    diagram_code = data.get("code")
    filename = f"diagrams/{data.get('name','diagram')}.svg"

    try:
        # Save code to temp file
        temp_file = "temp_diagram.mmd"
        with open(temp_file, "w") as f:
            f.write(diagram_code)

        # Use Mermaid CLI to render diagram
        subprocess.run(["mmdc", "-i", temp_file, "-o", filename], check=True)

        return jsonify({"status": "ok", "file": filename})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)})


if __name__ == "__main__":
    app.run(port=5008)
