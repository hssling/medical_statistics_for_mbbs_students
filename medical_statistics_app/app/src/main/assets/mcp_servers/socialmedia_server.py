from flask import Flask, request, jsonify


app = Flask(__name__)


@app.route("/generate", methods=["POST"])
def generate_social():
    data = request.json
    topic = data.get("topic")

    try:
        # Simulate social media generation
        twitter_posts = [f"🎓 Unleash the power of {topic}! #AI #Knowledge", f"Discover {topic} with these insights 📚"]
        linkedin_posts = [f"Exploring {topic}: Here's what matters most - [link]", f"New perspectives on {topic} from recent research"]
        instagram_captions = ["📖 Deep dive into {topic} 💡", "Unpacking {topic} one insight at a time ✨"]

        return jsonify({"twitter": twitter_posts, "linkedin": linkedin_posts, "instagram": instagram_captions})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)})


if __name__ == "__main__":
    app.run(port=5019)
