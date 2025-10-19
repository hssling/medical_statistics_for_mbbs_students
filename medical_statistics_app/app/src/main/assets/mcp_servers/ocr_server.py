import os
import subprocess
from flask import Flask, request, jsonify


app = Flask(__name__)

os.makedirs("citations", exist_ok=True)


@app.route("/extract", methods=["POST"])
def extract_ocr():
    data = request.json
    pdf_path = data.get("pdf_path")
    output_file = f"citations/{os.path.basename(pdf_path).replace('.pdf', '_extracted.txt')}"

    try:
        # Simulate OCR extraction with pdftotext or similar
        # In real implementation, use pytesseract or textract
        result = subprocess.run(["pdftotext", pdf_path, output_file], capture_output=True, text=True)
        text = f"Extracted OCR text from {pdf_path}"  # Placeholder

        return jsonify({"status": "ok", "text": text, "output_file": output_file})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)})


if __name__ == "__main__":
    app.run(port=5011)
