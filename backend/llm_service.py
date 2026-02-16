import json
import os
from fastapi import HTTPException
from openai import OpenAI

# Groq API key
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

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
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": "You are a helpful AI tutor."},
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

        return {
            "ai_answer": text,
            "follow_up_questions": parsed_output.get("follow_up_questions", [])
        }
    
    except json.JSONDecodeError:
        raise HTTPException(
            status_code=500,
            detail=f"Model did not return valid JSON: {text}"
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Groq API failed: {str(e)}")
