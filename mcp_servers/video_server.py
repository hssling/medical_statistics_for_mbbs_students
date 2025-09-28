import os
import subprocess
from flask import Flask, request, jsonify


app = Flask(__name__)

os.makedirs("video", exist_ok=True)


@app.route("/summarize", methods=["POST"])
def summarize_video():
    data = request.json
    video_url = data.get("video_url")
    output_file = f"video/{video_url.split('/')[-1].replace('watch?v=', '')}_summary.txt"

    try:
        # Simulate video summarization
        summary = f"Summary of video from {video_url}: [Simulated key points and transcript here]"

        with open(output_file, 'w') as f:
            f.write(summary)

        return jsonify({"status": "ok", "summary": summary, "output_file": output_file})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)})


if __name__ == "__main__":
    app.run(port=5013)
