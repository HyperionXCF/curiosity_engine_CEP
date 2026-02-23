from fastapi import HTTPException
from openai import OpenAI
from groq import Groq
import os
from dotenv import load_dotenv

load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY")

client = OpenAI(
    api_key=GROQ_API_KEY,
    base_url="https://api.groq.com/openai/v1"
)


def send_plain_prompt_to_llm(prompt: str) -> str:
    """
    Sends prompt to LLM and returns plain text response.
    Used for simple tasks like topic extraction.
    """
    try:
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": "You are a precise AI assistant."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.2,
            max_tokens=20
        )

        return response.choices[0].message.content.strip()

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Groq API failed: {str(e)}"
        )


def extract_topic_from_user_input(user_input: str) -> str:
    prompt = f"""
User asked: "{user_input}"

Extract a short topic name (1-3 words).
Return ONLY the topic name.
Do not explain.
"""

    try:
        topic = send_plain_prompt_to_llm(prompt)

        if not topic:
            return "General"

        return topic.strip()

    except Exception as e:
        print(f"Error extracting topic: {e}")
        return "General"
