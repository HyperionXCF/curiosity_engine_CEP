import { useState, useEffect, useRef } from 'react'
import './index.css'

const API_URL = 'http://localhost:8000'

function App() {
  const [view, setView] = useState('auth')
  const [mode, setMode] = useState('login')
  const [token, setToken] = useState(localStorage.getItem('access_token'))
  const [refreshToken, setRefreshToken] = useState(localStorage.getItem('refresh_token'))
  const [messages, setMessages] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [currentTopic, setCurrentTopic] = useState(null)
  const [debugInfo, setDebugInfo] = useState('')
  const messagesEndRef = useRef(null)

  useEffect(() => {
    if (token) {
      setView('chat')
    }
  }, [token])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleRegister = async (e) => {
    e.preventDefault()
    setError('')
    const formData = new FormData(e.target)
    
    try {
      const res = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.get('name'),
          age: parseInt(formData.get('age')),
          email: formData.get('email'),
          password: formData.get('password')
        })
      })
      
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.detail || 'Registration failed')
      }
      
      setMode('login')
      setError('Registration successful! Please login.')
    } catch (err) {
      setError(err.message)
    }
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    const formData = new FormData(e.target)
    
    try {
      const res = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `username=${encodeURIComponent(formData.get('email'))}&password=${encodeURIComponent(formData.get('password'))}`
      })
      
      if (!res.ok) {
        throw new Error('Invalid credentials')
      }
      
      const data = await res.json()
      localStorage.setItem('access_token', data.access_token)
      localStorage.setItem('refresh_token', data.refresh_token)
      setToken(data.access_token)
      setRefreshToken(data.refresh_token)
      setView('chat')
    } catch (err) {
      setError(err.message)
    }
  }

  const sendMessage = async (text) => {
    if (!text.trim() || loading) return
    
    const userMessage = { role: 'user', content: text }
    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setLoading(true)
    setError('')
    
    try {
      setDebugInfo('Sending request...')
      console.log('Sending request with token:', token ? 'yes' : 'no')
      
      const res = await fetch(`${API_URL}/start-learning`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ user_input: text })
      })
      
      console.log('Response status:', res.status)
      setDebugInfo(`Response: ${res.status}`)
      
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.detail || 'Request failed')
      }
      
      const data = await res.json()
      console.log('Response data:', data)
      setDebugInfo(`Got response: ${data.topic}`)
      
      setCurrentTopic(data.topic)
      
      const aiMessage = { 
        role: 'assistant', 
        content: data.ai_answer,
        followUps: data.follow_up_questions,
        topic: data.topic
      }
      setMessages(prev => [...prev, aiMessage])
    } catch (err) {
      console.error('Error:', err)
      setError(err.message)
      setMessages(prev => [...prev, { role: 'error', content: err.message }])
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    sendMessage(inputValue)
  }

  const handleLogout = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    setToken(null)
    setRefreshToken(null)
    setView('auth')
    setMessages([])
    setCurrentTopic(null)
  }

  if (view === 'auth') {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <div className="logo-icon">🧠</div>
            <h1 className="auth-title">CURIOPLAY</h1>
            <p className="auth-subtitle">Learn through Socratic questioning</p>
          </div>
          
          {error && <div className="error-banner">{error}</div>}
          
          {mode === 'register' ? (
            <form onSubmit={handleRegister} className="auth-form">
              <div className="form-group">
                <label className="form-label">Name</label>
                <input name="name" className="form-input" required placeholder="John Doe" />
              </div>
              
              <div className="form-group">
                <label className="form-label">Age</label>
                <input name="age" type="number" className="form-input" required placeholder="25" />
              </div>
              
              <div className="form-group">
                <label className="form-label">Email</label>
                <input name="email" type="email" className="form-input" required placeholder="john@example.com" />
              </div>
              
              <div className="form-group">
                <label className="form-label">Password</label>
                <input name="password" type="password" className="form-input" required placeholder="••••••••" />
              </div>
              
              <button type="submit" className="auth-btn">CREATE ACCOUNT</button>
            </form>
          ) : (
            <form onSubmit={handleLogin} className="auth-form">
              <div className="form-group">
                <label className="form-label">Email</label>
                <input name="email" type="email" className="form-input" required placeholder="john@example.com" />
              </div>
              
              <div className="form-group">
                <label className="form-label">Password</label>
                <input name="password" type="password" className="form-input" required placeholder="••••••••" />
              </div>
              
              <button type="submit" className="auth-btn">LOGIN</button>
            </form>
          )}
          
          <p className="auth-switch">
            {mode === 'login' ? (
              <>
                Don't have an account?{' '}
                <span onClick={() => { setMode('register'); setError('') }}>Sign up</span>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <span onClick={() => { setMode('login'); setError('') }}>Sign in</span>
              </>
            )}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="chat-container">
      <header className="chat-header">
        <div className="header-left">
          <div className="logo-icon small">🧠</div>
          <div>
            <h1 className="header-title">CURIOPLAY</h1>
            {currentTopic && <span className="topic-indicator">Topic: {currentTopic}</span>}
          </div>
        </div>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </header>

      <div className="chat-messages">
        {debugInfo && <div style={{padding: '0.5rem', background: '#eee', fontSize: '12px'}}>Debug: {debugInfo}</div>}
        {messages.length === 0 && (
          <div className="welcome-message">
            <div className="welcome-icon">💭</div>
            <h2>Welcome to Curioplay!</h2>
            <p>Start a conversation to begin learning. I'll help you explore topics through Socratic questioning.</p>
          </div>
        )}
        
        {messages.map((msg, index) => (
          <div key={index} className={`message-wrapper ${msg.role}`}>
            <div className="message-bubble">
              {msg.role === 'assistant' && (
                <div className="message-avatar">AI</div>
              )}
              <div className="message-content">
                <p>{msg.content}</p>
                
                {msg.followUps && msg.followUps.length > 0 && (
                  <div className="follow-ups">
                    <p className="follow-ups-label">Continue exploring:</p>
                    <div className="follow-up-buttons">
                      {msg.followUps.map((q, i) => (
                        <button 
                          key={i} 
                          className="follow-up-btn"
                          onClick={() => sendMessage(q)}
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        
        {loading && (
          <div className="message-wrapper assistant">
            <div className="message-bubble">
              <div className="message-avatar">AI</div>
              <div className="message-content">
                <div className="typing-indicator">
                  <span></span><span></span><span></span>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {error && (
          <div className="message-wrapper error">
            <div className="message-bubble error">
              <p>{error}</p>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      <form className="chat-input-area" onSubmit={handleSubmit}>
        <input 
          type="text" 
          className="chat-input" 
          placeholder="Ask a question or continue the conversation..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          disabled={loading}
        />
        <button 
          type="submit" 
          className="send-btn"
          disabled={loading || !inputValue.trim()}
        >
          {loading ? '...' : '➤'}
        </button>
      </form>
    </div>
  )
}

export default App
