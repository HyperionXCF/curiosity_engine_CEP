import { ArrowLeft, Save } from "lucide-react";
import { useNavigate } from "react-router";
import { useState } from "react";
import { motion } from "motion/react";

export function ProfilePage() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    name: "Alex Johnson",
    age: "25",
    email: "alex.johnson@example.com",
  });

  const handleSave = () => {
    // In a real app, this would save to a database
    alert("Profile updated successfully!");
    navigate("/settings");
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
          onClick={() => navigate("/settings")}
          className="p-2 hover:bg-white/5 rounded-lg transition-colors"
          aria-label="Go back"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </motion.button>
        <h1 className="text-xl text-white">profile</h1>
      </motion.header>

      {/* Profile Form */}
      <div className="flex-1 p-6">
        <div className="max-w-md mx-auto space-y-6">
          {/* Profile Picture Placeholder */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2, type: "spring" }}
            className="flex justify-center mb-8"
          >
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#FF8C42] via-[#9B59B6] to-[#6FBF73] flex items-center justify-center">
              <span className="text-white text-3xl">
                {profile.name.charAt(0)}
              </span>
            </div>
          </motion.div>

          {/* Name Field */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            <label htmlFor="name" className="block text-white mb-2">
              Name
            </label>
            <input
              id="name"
              type="text"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              className="w-full bg-white/5 text-white border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#9B59B6]"
            />
          </motion.div>

          {/* Age Field */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
          >
            <label htmlFor="age" className="block text-white mb-2">
              Age
            </label>
            <input
              id="age"
              type="text"
              value={profile.age}
              onChange={(e) => setProfile({ ...profile, age: e.target.value })}
              className="w-full bg-white/5 text-white border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#9B59B6]"
            />
          </motion.div>

          {/* Email Field (Read-only) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.5 }}
          >
            <label htmlFor="email" className="block text-white mb-2">
              Email
              <span className="text-white/40 text-sm ml-2">(can't be updated)</span>
            </label>
            <input
              id="email"
              type="email"
              value={profile.email}
              disabled
              className="w-full bg-white/5 text-white/60 border border-white/10 rounded-xl px-4 py-3 cursor-not-allowed"
            />
          </motion.div>

          {/* Save Button */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.6 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSave}
            className="w-full bg-[#9B59B6] hover:bg-[#8B49A6] text-white py-4 rounded-full flex items-center justify-center gap-2 transition-all mt-8"
          >
            <Save className="w-5 h-5" />
            <span>Save Changes</span>
          </motion.button>
        </div>
      </div>

      {/* Color Dots Decoration */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.7 }}
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