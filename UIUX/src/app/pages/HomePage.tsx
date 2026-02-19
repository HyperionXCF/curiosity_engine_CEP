import { Menu } from "lucide-react";
import { useNavigate } from "react-router";
import { useState } from "react";
import { motion } from "motion/react";

export function HomePage() {
  const navigate = useNavigate();
  const [userInput, setUserInput] = useState("");

  const handleStartChat = () => {
    if (userInput.trim()) {
      const chatId = Date.now().toString();
      navigate(`/chat/${chatId}`, { state: { initialMessage: userInput } });
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen bg-[#3A3A3A] flex flex-col"
    >
      {/* Header */}
      <motion.header 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="flex items-center justify-between p-4 border-b border-white/10"
      >
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/history")}
          className="p-2 hover:bg-white/5 rounded-lg transition-colors"
          aria-label="Open menu"
        >
          <Menu className="w-6 h-6 text-white" />
        </motion.button>
        <h1 className="text-xl text-white font-serif italic">curioplay</h1>
        <div className="w-10"></div>
      </motion.header>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-2xl text-white text-center mb-8"
          >
            what do you want to learn today?
          </motion.h2>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="flex gap-2 mb-4"
          >
            <motion.div 
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0 }}
              className="w-3 h-3 rounded-full bg-[#FF8C42]"
            ></motion.div>
            <motion.div 
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.2 }}
              className="w-3 h-3 rounded-full bg-[#9B59B6]"
            ></motion.div>
            <motion.div 
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.4 }}
              className="w-3 h-3 rounded-full bg-[#F9E74D]"
            ></motion.div>
            <motion.div 
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}
              className="w-3 h-3 rounded-full bg-[#6FBF73]"
            ></motion.div>
          </motion.div>

          <motion.textarea
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Type your question here..."
            className="w-full bg-white/5 text-white border border-white/10 rounded-xl p-4 min-h-[120px] resize-none focus:outline-none focus:ring-2 focus:ring-[#9B59B6] placeholder:text-white/40"
          />
        </div>
      </div>

      {/* Bottom Button */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="p-6"
      >
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleStartChat}
          disabled={!userInput.trim()}
          className="w-full bg-[#9B59B6] text-white py-4 rounded-full transition-all hover:bg-[#8B49A6] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          chat with curio...
        </motion.button>
      </motion.div>
    </motion.div>
  );
}