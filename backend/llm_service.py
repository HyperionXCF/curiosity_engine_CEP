import json
import os
from dotenv import load_dotenv
from fastapi import HTTPException
from openai import OpenAI
import requests # needed when we will use our own endpoint

load_dotenv()

# Groq API key
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

# CURIOSITY_ENGINE_URL = "http://localhost:9000/generate"  # endpoint by vipul.

# Initialize Groq client
client = OpenAI(
    api_key=GROQ_API_KEY,
    base_url="https://api.groq.com/openai/v1"
)

def send_prompt_to_llm(prompt: str) -> dict:
    """
    Sends prompt to Groq LLM
    and returns structured response.
    """
    try:

        # response = requests.post(
        #     CURIOSITY_ENGINE_URL,
        #     json={"question": prompt}
        # )

        # if response.status_code != 200:
        #     raise HTTPException(
        #         status_code=500,
        #         detail="Curiosity Engine failed"
        #     )
        
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system",
                "content": """
                You are a strict JSON API.
                You must ALWAYS return valid JSON.
                Never return plain text.
                Never explain outside JSON.
                If you fail, the system will crash.
                """
                },
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            max_tokens=500
        )

        text = response.choices[0].message.content
        
        # Remove accidental markdown
        if text.startswith("```"):
            text = text.replace("```json", "").replace("```", "").strip()

        # Convert string → dictionary
        parsed_output = json.loads(text)

        return parsed_output
    
    except json.JSONDecodeError:
        raise HTTPException(
            status_code=500,
            detail=f"Model did not return valid JSON: {text}"
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Groq API failed: {str(e)}")
