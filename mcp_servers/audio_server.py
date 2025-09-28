import os
from flask import Flask, request, jsonify


app = Flask(__name__)

os.makedirs("audio", exist_ok=True)


@app.route("/transcribe", methods=["POST"])
def transcribe_audio():
    data = request.json
    audio_path = data.get("audio_path")
    output_file = f"audio/{os.path.basename(audio_path).replace('.mp3', '_transcript.txt')}"

    try:
        # Simulate transcript with speech recognition
        transcript = f"Transcript of audio from {audio_path}: [Simulated transcript text here]"

        with open(output_file, 'w') as f:
            f.write(transcript)

        return jsonify({"status": "ok", "transcript": transcript, "output_file": output_file})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)})


if __name__ == "__main__":
    app.run(port=5012)
