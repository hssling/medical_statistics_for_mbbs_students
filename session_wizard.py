import json
import os

CONFIG_FILE = "notes/session_content.json"

def run_wizard():
    print("=== AI Content Creator Wizard ===")

    # Step 1: Content Type
    content_types = [
        "Book", "Academic Article", "Blog Series", "Social Media Posts",
        "Marketing Copy", "Online Course", "Screenplay/Script",
        "Video Script", "Podcast", "Audiobook", "Slide Deck", "Meme"
    ]
    for i, t in enumerate(content_types, 1):
        print(f"{i}. {t}")
    choice = int(input("Choose content type (1-12): "))
    content_type = content_types[choice - 1]

    # Step 2: Language
    language = input("Language (default=English): ") or "English"

    # Step 3: Subject/Topic
    subject = input("Subject/Domain (e.g., AI, Biology, Marketing): ")
    topic = input("Main Topic/Theme: ")

    # Step 4: Genre/Style
    style = input("Style (Academic, Narrative, Poetic, Humorous, Minimalist): ")

    # Step 5: Extras
    extras = []
    extra_opts = ["Images", "Diagrams", "Citation Graphs", "Interactive Dashboards", "TTS Narration"]
    for i, e in enumerate(extra_opts, 1):
        choice = input(f"Include {e}? (y/n): ")
        if choice.lower() == "y":
            extras.append(e)

    # Save config
    config = {
        "content_type": content_type,
        "language": language,
        "subject": subject,
        "topic": topic,
        "style": style,
        "extras": extras
    }
    os.makedirs("notes", exist_ok=True)
    with open(CONFIG_FILE, "w", encoding="utf-8") as f:
        json.dump(config, f, indent=2)

    print("\n✅ Session configuration saved to notes/session_content.json")
    print("➡️ Now run Cline and choose 'AI Content Creator Matrix' agent to auto-generate content.")

if __name__ == "__main__":
    run_wizard()
