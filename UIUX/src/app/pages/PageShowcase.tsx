import { motion } from "motion/react";
import { useNavigate } from "react-router";

export function PageShowcase() {
  const navigate = useNavigate();

  const pages = [
    { name: "Loading", path: "/", color: "#9B59B6" },
    { name: "Home", path: "/home", color: "#FF8C42" },
    { name: "Chat", path: "/chat/demo", color: "#6FBF73" },
    { name: "History", path: "/history", color: "#F9E74D" },
    { name: "Settings", path: "/settings", color: "#9B59B6" },
    { name: "Profile", path: "/profile", color: "#FF8C42" },
    { name: "Manage Interests", path: "/manage-interests", color: "#6FBF73" },
  ];

  return (
    <div className="min-h-screen bg-[#2A2A2A] p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        <div className="text-center mb-12">
          <h1 className="text-5xl text-white font-serif italic mb-4">
            curioplay
          </h1>
          <p className="text-white/60 text-lg">Page Showcase</p>
          <div className="flex justify-center gap-2 mt-4">
            <div className="w-3 h-3 rounded-full bg-[#FF8C42]"></div>
            <div className="w-3 h-3 rounded-full bg-[#9B59B6]"></div>
            <div className="w-3 h-3 rounded-full bg-[#F9E74D]"></div>
            <div className="w-3 h-3 rounded-full bg-[#6FBF73]"></div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pages.map((page, index) => (
            <motion.button
              key={page.path}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              whileHover={{ scale: 1.05, y: -4 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate(page.path)}
              className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl p-6 text-white transition-all group"
            >
              <div
                className="w-12 h-12 rounded-full mb-4 mx-auto flex items-center justify-center"
                style={{ backgroundColor: page.color }}
              >
                <span className="text-white text-xl">
                  {index + 1}
                </span>
              </div>
              <h3 className="text-lg">{page.name}</h3>
              <p className="text-white/40 text-sm mt-2 group-hover:text-white/60 transition-colors">
                Click to view
              </p>
            </motion.button>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-12 text-center text-white/40 text-sm"
        >
          <p>Navigate through each page to see the complete application</p>
        </motion.div>
      </motion.div>
    </div>
  );
}
