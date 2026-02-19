import { Settings, Plus, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router";
import { useState } from "react";
import { motion } from "motion/react";

interface ChatHistoryItem {
  id: string;
  title: string;
  preview: string;
  timestamp: Date;
}

export function HistoryPage() {
  const navigate = useNavigate();
  const [chatHistory] = useState<ChatHistoryItem[]>([
    {
      id: "1",
      title: "Understanding Quantum Physics",
      preview: "Can you explain quantum entanglement?",
      timestamp: new Date(2026, 1, 14, 10, 30),
    },
    {
      id: "2",
      title: "Machine Learning Basics",
      preview: "What is the difference between supervised and unsupervised learning?",
      timestamp: new Date(2026, 1, 13, 15, 45),
    },
    {
      id: "3",
      title: "Ancient Roman History",
      preview: "Tell me about the fall of the Roman Empire",
      timestamp: new Date(2026, 1, 12, 9, 20),
    },
    {
      id: "4",
      title: "Python Programming",
      preview: "How do decorators work in Python?",
      timestamp: new Date(2026, 1, 11, 14, 15),
    },
    {
      id: "5",
      title: "Climate Change",
      preview: "What are the main causes of global warming?",
      timestamp: new Date(2026, 1, 10, 11, 0),
    },
  ]);

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days} days ago`;
    return date.toLocaleDateString();
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
          onClick={() => navigate("/home")}
          className="p-2 hover:bg-white/5 rounded-lg transition-colors"
          aria-label="Go back"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </motion.button>
        <h1 className="text-xl text-white">curioplay history</h1>
      </motion.header>

      {/* Chat History List */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-3">
          {chatHistory.map((chat, index) => (
            <motion.button
              key={chat.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              whileHover={{ scale: 1.02, x: 4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate(`/chat/${chat.id}`)}
              className="w-full bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl p-4 text-left transition-all"
            >
              <h3 className="text-white mb-1">{chat.title}</h3>
              <p className="text-white/60 text-sm mb-2 line-clamp-2">{chat.preview}</p>
              <p className="text-white/40 text-xs">{formatDate(chat.timestamp)}</p>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Bottom Actions */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="p-4 border-t border-white/10 space-y-3"
      >
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate("/settings")}
          className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white py-3 px-4 rounded-full flex items-center justify-center gap-2 transition-all"
        >
          <Settings className="w-5 h-5" />
          <span>Settings</span>
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate("/home")}
          className="w-full bg-[#6FBF73] hover:bg-[#5FAF63] text-white py-3 px-4 rounded-full flex items-center justify-center gap-2 transition-all"
        >
          <Plus className="w-5 h-5" />
          <span>New Chat</span>
        </motion.button>
      </motion.div>
    </motion.div>
  );
}