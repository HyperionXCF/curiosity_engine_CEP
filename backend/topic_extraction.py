from llm_service import send_prompt_to_llm

def extract_topic_from_user_input(user_input: str) -> str:
    prompt = f"""
        User asked: "{user_input}"

        Task: Extract a short topic name (1-3 words) that best describes the subject of this question.
        Return only the topic name, nothing else.
        Task: 
    """
    try:
        llm_output = send_prompt_to_llm(prompt)
        topic = llm_output.get("ai_answer", "").strip()
        if not topic:
            return "General"  # fallback if LLm is not able to categorise it into domain
        return topic
    except Exception as e:
        print(f"Error extracting topic: {e}")
        return "General"
