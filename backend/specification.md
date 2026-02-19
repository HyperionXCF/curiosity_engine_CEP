/register 
- request body 
name: A string (e.g., "John Doe")
age: A whole number (e.g., 25)
email: Must be a valid email format (e.g., "john@example.com")
password: A string (e.g., "secret123")

- response body 


/refresh
- request body 
refresh_token: A long string of random characters that identifies your session.

- response body


/login
- request body 
username: (Required) Your email or handle.
password: (Required) Your password.
Hidden extras: It also looks for things like grant_type or client_id, but usually, these are handled automatically by the login screen.
- response body 



/start-learning
- request body 



response body
{
  "topic": "General",
  "ai_answer": "It seems like you're asking a casual greeting, 'wassup' is a slang expression that means 'what's up' or 'how are you'. In a learning context, we could interpret it as an invitation to explore new ideas or discuss interesting topics. Since you're here to learn, let's make the most of our time and explore something exciting. You've shown interest in general topics, so we could start with something broad and see where it takes us.",
  "follow_up_questions": [
    "What do you think is the most interesting thing about the world that you'd like to learn more about?",
    "How do you think learning about a wide range of topics can help you in your everyday life?",
    "Is there something specific that you've always wondered about but never had the chance to explore?"
  ]
}