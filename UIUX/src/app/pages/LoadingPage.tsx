import { useEffect } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";

export function LoadingPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/home");
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-[#3A3A3A] flex items-center justify-center">
      <div className="text-center">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-6xl mb-8 text-white font-serif italic"
        >
          curioplay
        </motion.h1>
        <div className="flex justify-center gap-3">
          <motion.div 
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="w-4 h-4 rounded-full bg-[#FF8C42] animate-bounce" 
            style={{ animationDelay: "0ms" }}
          ></motion.div>
          <motion.div 
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="w-4 h-4 rounded-full bg-[#9B59B6] animate-bounce" 
            style={{ animationDelay: "150ms" }}
          ></motion.div>
          <motion.div 
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.5 }}
            className="w-4 h-4 rounded-full bg-[#F9E74D] animate-bounce" 
            style={{ animationDelay: "300ms" }}
          ></motion.div>
          <motion.div 
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.6 }}
            className="w-4 h-4 rounded-full bg-[#6FBF73] animate-bounce" 
            style={{ animationDelay: "450ms" }}
          ></motion.div>
        </div>
      </div>
    </div>
  );
}