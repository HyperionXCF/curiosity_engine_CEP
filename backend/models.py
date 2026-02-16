from typing import Optional
from pydantic import BaseModel, EmailStr

class User(BaseModel):
    id: Optional[int] = None
    name : str
    age : int
    email : EmailStr

# below line will verify the data sent by the user
class RegisterRequest(BaseModel):
    name : str
    age: int
    email: EmailStr
    password: str 
    
# response sent to user
class RegisterResponse(BaseModel):
    message: str

# from the user we need to send the topic which they are studying
class StartLearningRequest(BaseModel):
    user_input: str

class RefreshRequest(BaseModel):
    refresh_token: str