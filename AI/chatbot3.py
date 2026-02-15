from groq import Groq
from dotenv import load_dotenv
import os
import gradio as gr
import random

# ==============================
# LOAD API
# ==============================
load_dotenv()

groq_api = os.getenv("GROQ_API_KEY")
if not groq_api:
    raise ValueError("GROQ_API_KEY not found. Check your .env file.")

client = Groq(api_key=groq_api)
model = "openai/gpt-oss-120b"


# ==============================
# USER PROFILE + STATE
# ==============================
user_profile = {
    "interests": ["cricket", "football", "space"],
    "primary_interest": "cricket",
    "secondary_interests": ["football", "space"],
    "current_active_topic": "cricket",

    "interest_depth": {
        "cricket": 0,
        "football": 0,
        "space": 0
    },

    "learning_level": "beginner",

    # adaptive mixing
    "mix_probability": 0.35,
    "primary_streak": 0,

    # mastery
    "mastery_threshold": 20,

    # external topic handling
    "external_topic": None,
    "external_turn_count": 0
}


# ==============================
# GREETING DETECTOR
# ==============================
def is_greeting(message):
    greetings = ["hello","hi","hii","hey","good morning","good evening"]
    msg = message.lower()
    for g in greetings:
        if g in msg:
            return True
    return False


# ==============================
# SYSTEM PROMPT
# ==============================
def systemprompt_building(active_topic):

    return f"""
You are Curioplay — an interest-focused Socratic AI tutor.

Current teaching topic: {active_topic}

STRICT DOMAIN RULE:
- Keep all explanations inside cricket, football, space
- Avoid kitchen, school, family examples

TEACHING STYLE:
- Ask Socratic questions first
- Only explain when user says "answer please"
- After explanation, ask another Socratic question
- Focus mainly on primary interest
- Mix secondary interests naturally
- External topics allowed ONLY 2 turns
- Then return automatically to primary interest
- After mastery, shift interest gradually

Be human, friendly, curiosity-driven.
"""


# ==============================
# DEPTH TRACKING
# ==============================
def update_depth(topic):
    if topic not in user_profile["interest_depth"]:
        user_profile["interest_depth"][topic] = 0
    user_profile["interest_depth"][topic] += 1


# ==============================
# ANSWER PLEASE
# ==============================
def user_requested_answer(message):
    return "answer please" in message.lower()


# ==============================
# EXTERNAL TOPIC DETECTION
# ==============================
def detect_external_topic(message):
    for interest in user_profile["interests"]:
        if interest in message.lower():
            return None
    return message


# ==============================
# TOPIC DECISION ENGINE
# ==============================
def decide_next_topic(message):

    primary = user_profile["primary_interest"]

    # EXTERNAL TOPIC FLOW (STRICT 2 TURNS)
    if user_profile["external_topic"]:
        user_profile["external_turn_count"] += 1

        if user_profile["external_turn_count"] >= 2:
            user_profile["external_topic"] = None
            user_profile["external_turn_count"] = 0
            return primary

        return user_profile["external_topic"]

    # detect new external topic
    external = detect_external_topic(message)
    if external:
        user_profile["external_topic"] = external
        user_profile["external_turn_count"] = 1
        return external

    # adaptive mixing logic
    user_profile["primary_streak"] += 1
    depth = user_profile["interest_depth"].get(primary, 0)

    if user_profile["primary_streak"] > 5:
        mix_prob = 0.75
    elif user_profile["primary_streak"] > 3:
        mix_prob = 0.55
    elif depth > 5:
        mix_prob = 0.45
    else:
        mix_prob = user_profile["mix_probability"]

    if random.random() < mix_prob:
        user_profile["primary_streak"] = 0
        return random.choice(user_profile["secondary_interests"])

    return primary


# ==============================
# MASTERY CHECK
# ==============================
def check_mastery():
    primary = user_profile["primary_interest"]
    depth = user_profile["interest_depth"].get(primary, 0)
    return depth > user_profile["mastery_threshold"]


# ==============================
# SWITCH PRIMARY INTEREST
# ==============================
def switch_primary_interest():
    interests = user_profile["interests"]
    current = user_profile["primary_interest"]

    idx = interests.index(current)
    next_idx = (idx + 1) % len(interests)

    new_primary = interests[next_idx]

    user_profile["primary_interest"] = new_primary
    user_profile["secondary_interests"] = [i for i in interests if i != new_primary]

    return new_primary


# ==============================
# CHAT ENGINE
# ==============================
def toDoChat(message, history):

    # GREETING FLOW
    if is_greeting(message):

        active_topic = user_profile["primary_interest"]

        greeting_instruction = f"""
User greeted you.

Greet warmly.
Invite learning.
Start Socratic question about {active_topic}.
"""

        messages = [
            {"role": "system", "content": systemprompt_building(active_topic)},
            {"role": "system", "content": greeting_instruction}
        ]

    else:

        active_topic = decide_next_topic(message)
        update_depth(active_topic)
        mastery_reached = check_mastery()

        messages = [{"role": "system", "content": systemprompt_building(active_topic)}]

        if mastery_reached:
            new_primary = switch_primary_interest()
            messages.append({
                "role": "system",
                "content": f"Shift learning focus gradually to {new_primary}."
            })

        # SAFE HISTORY (Groq compatible)
        if history:
            for item in history:
                if isinstance(item, dict):
                    messages.append({
                        "role": item.get("role"),
                        "content": item.get("content")
                    })
                else:
                    u, a = item
                    messages.append({"role": "user", "content": u})
                    messages.append({"role": "assistant", "content": a})

        messages.append({"role": "user", "content": message})

        if user_requested_answer(message):
            messages.append({
                "role": "system",
                "content": "Provide explanation then ask new Socratic question."
            })

    # GROQ CALL
    stream = client.chat.completions.create(
        model=model,
        messages=messages,
        stream=True
    )

    response = ""
    for chunk in stream:
        token = chunk.choices[0].delta.content
        if token:
            response += token
            yield response


# ==============================
# GRADIO UI
# ==============================
gr.ChatInterface(
    fn=toDoChat,
    title="Curioplay — Adaptive Socratic Learning AI"
).launch()