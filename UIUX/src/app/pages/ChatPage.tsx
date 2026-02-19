import { useState, useRef, useEffect } from "react";
import { ArrowLeft, Send } from "lucide-react";
import { useNavigate, useLocation, useParams } from "react-router";
import { motion, AnimatePresence } from "motion/react";

interface Message {
  id: string;
  text: string;
  sender: "user" | "ai";
  timestamp: Date;
}

export function ChatPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { chatId } = useParams();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const initialMessage = location.state?.initialMessage;
    if (initialMessage && messages.length === 0) {
      const userMessage: Message = {
        id: Date.now().toString(),
        text: initialMessage,
        sender: "user",
        timestamp: new Date(),
      };
      setMessages([userMessage]);
      
      // Simulate AI response
      setIsTyping(true);
      setTimeout(() => {
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: `That's a great question! Let me help you learn about "${initialMessage}". I'm here to guide you through this topic in an engaging and educational way. What specific aspect would you like to explore first?`,
          sender: "ai",
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, aiMessage]);
        setIsTyping(false);
      }, 1500);
    }
  }, [location.state, messages.length]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");

    // Simulate AI response
    setIsTyping(true);
    setTimeout(() => {
      const responses = [
        "That's an excellent point! Let me break that down for you...",
        "Great question! Here's what you need to know...",
        "I can help you understand that better. Let's explore...",
        "Interesting! Let me explain this in detail...",
      ];
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: responses[Math.floor(Math.random() * responses.length)],
        sender: "ai",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-[#3A3A3A] flex flex-col"
    >
      {/* Header */}
      <motion.header 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="flex items-center gap-4 p-4 border-b border-white/10"
      >
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/history")}
          className="p-2 hover:bg-white/5 rounded-lg transition-colors"
          aria-label="Go back"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </motion.button>
        <h1 className="text-lg text-white font-serif italic">curioplay</h1>
      </motion.header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence mode="popLayout">
          {messages.map((message, index) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  message.sender === "user"
                    ? "bg-[#9B59B6] text-white"
                    : "bg-white/10 text-white border border-white/10"
                }`}
              >
                <p className="whitespace-pre-wrap">{message.text}</p>
                <p className="text-xs mt-1 opacity-60">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {isTyping && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex justify-start"
          >
            <div className="bg-white/10 text-white border border-white/10 rounded-2xl px-4 py-3">
              <div className="flex gap-1">
                <div className="w-2 h-2 rounded-full bg-white/60 animate-bounce" style={{ animationDelay: "0ms" }}></div>
                <div className="w-2 h-2 rounded-full bg-white/60 animate-bounce" style={{ animationDelay: "150ms" }}></div>
                <div className="w-2 h-2 rounded-full bg-white/60 animate-bounce" style={{ animationDelay: "300ms" }}></div>
              </div>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="p-4 border-t border-white/10"
      >
        <div className="flex gap-2 items-end">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask a follow-up question..."
            className="flex-1 bg-white/5 text-white border border-white/10 rounded-2xl px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-[#9B59B6] placeholder:text-white/40 max-h-32"
            rows={1}
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSend}
            disabled={!input.trim()}
            className="bg-[#9B59B6] text-white p-3 rounded-full transition-all hover:bg-[#8B49A6] disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
            aria-label="Send message"
          >
            <Send className="w-5 h-5" />
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}