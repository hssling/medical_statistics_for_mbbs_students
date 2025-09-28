import os
from flask import Flask, request, jsonify


app = Flask(__name__)


@app.route("/synthesize", methods=["POST"])
def synthesize_audio():
    data = request.json
    text = data.get("text")
    output_file = f"export/audio/{data.get('name','audiobook')}_chapter.mp3"

    try:
        # Simulate TTS synthesis
        # In real: use gTTS or boto3 polly
        audio_url = f"Simulated audio from text: {text[:50]}... saved to {output_file}"

        # Create the file
        os.makedirs("export/audio", exist_ok=True)
        with open(output_file.replace('.mp3', '.wav'), 'w') as f:
            f.write(audio_url)

        return jsonify({"status": "ok", "audio_file": output_file.replace('.mp3', '.wav')})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)})


if __name__ == "__main__":
    app.run(port=5014)
