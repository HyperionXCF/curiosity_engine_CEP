import { ArrowLeft, User, Heart, RotateCcw } from "lucide-react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";

export function SettingsPage() {
  const navigate = useNavigate();

  const handleResetApp = () => {
    if (confirm("Are you sure you want to reset the app? This will clear all your data.")) {
      // In a real app, this would clear stored data
      alert("App reset successfully!");
      navigate("/home");
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
        <h1 className="text-xl text-white">settings</h1>
      </motion.header>

      {/* Settings Options */}
      <div className="flex-1 p-4">
        <div className="space-y-3 max-w-md mx-auto">
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            whileHover={{ scale: 1.02, x: 4 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate("/profile")}
            className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white py-4 px-6 rounded-2xl flex items-center gap-3 transition-all"
          >
            <div className="bg-[#9B59B6] p-2 rounded-full">
              <User className="w-5 h-5" />
            </div>
            <span className="text-lg">Profile</span>
          </motion.button>

          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            whileHover={{ scale: 1.02, x: 4 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate("/manage-interests")}
            className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white py-4 px-6 rounded-2xl flex items-center gap-3 transition-all"
          >
            <div className="bg-[#FF8C42] p-2 rounded-full">
              <Heart className="w-5 h-5" />
            </div>
            <span className="text-lg">Manage Interests</span>
          </motion.button>

          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            whileHover={{ scale: 1.02, x: 4 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleResetApp}
            className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white py-4 px-6 rounded-2xl flex items-center gap-3 transition-all"
          >
            <div className="bg-[#F9E74D] p-2 rounded-full">
              <RotateCcw className="w-5 h-5 text-[#3A3A3A]" />
            </div>
            <span className="text-lg">Reset App</span>
          </motion.button>
        </div>
      </div>

      {/* Color Dots Decoration */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
        className="p-6 flex justify-center gap-2"
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
    </motion.div>
  );
}