import { ArrowLeft, Plus, X } from "lucide-react";
import { useNavigate } from "react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

interface Interest {
  id: string;
  name: string;
  color: string;
}

export function ManageInterestsPage() {
  const navigate = useNavigate();
  const [interests, setInterests] = useState<Interest[]>([
    { id: "1", name: "Computer Science", color: "#9B59B6" },
    { id: "2", name: "Physics", color: "#FF8C42" },
    { id: "3", name: "Computational Fields", color: "#6FBF73" },
    { id: "4", name: "Mathematics", color: "#F9E74D" },
    { id: "5", name: "History", color: "#9B59B6" },
    { id: "6", name: "Philosophy", color: "#FF8C42" },
  ]);

  const [newInterest, setNewInterest] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);

  const colors = ["#FF8C42", "#9B59B6", "#F9E74D", "#6FBF73"];

  const handleAddInterest = () => {
    if (newInterest.trim()) {
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      setInterests([
        ...interests,
        {
          id: Date.now().toString(),
          name: newInterest,
          color: randomColor,
        },
      ]);
      setNewInterest("");
      setShowAddForm(false);
    }
  };

  const handleRemoveInterest = (id: string) => {
    setInterests(interests.filter((interest) => interest.id !== id));
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
        <h1 className="text-xl text-white">manage interests</h1>
      </motion.header>

      {/* Interests List */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-md mx-auto space-y-3">
          <AnimatePresence mode="popLayout">
            {interests.map((interest, index) => (
              <motion.div
                key={interest.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20, height: 0 }}
                transition={{ duration: 0.3, delay: index * 0.03 }}
                whileHover={{ scale: 1.02, x: 4 }}
                className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center justify-between group hover:bg-white/10 transition-all"
              >
                <div className="flex items-center gap-3">
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: interest.color }}
                  ></motion.div>
                  <span className="text-white">{interest.name}</span>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleRemoveInterest(interest.id)}
                  className="opacity-0 group-hover:opacity-100 p-2 hover:bg-white/10 rounded-lg transition-all"
                  aria-label={`Remove ${interest.name}`}
                >
                  <X className="w-4 h-4 text-white/60" />
                </motion.button>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Add New Interest Form */}
          <AnimatePresence>
            {showAddForm && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                transition={{ duration: 0.2 }}
                className="bg-white/5 border border-white/10 rounded-xl p-4"
              >
                <input
                  type="text"
                  value={newInterest}
                  onChange={(e) => setNewInterest(e.target.value)}
                  placeholder="Enter new interest..."
                  className="w-full bg-white/5 text-white border border-white/10 rounded-lg px-3 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-[#9B59B6] placeholder:text-white/40"
                  autoFocus
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      handleAddInterest();
                    }
                  }}
                />
                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleAddInterest}
                    className="flex-1 bg-[#6FBF73] hover:bg-[#5FAF63] text-white py-2 rounded-lg transition-all"
                  >
                    Add
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setShowAddForm(false);
                      setNewInterest("");
                    }}
                    className="flex-1 bg-white/5 hover:bg-white/10 text-white py-2 rounded-lg transition-all"
                  >
                    Cancel
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Add Button */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="p-4 border-t border-white/10"
      >
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowAddForm(true)}
          disabled={showAddForm}
          className="w-full bg-[#6FBF73] hover:bg-[#5FAF63] text-white py-4 rounded-full flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus className="w-5 h-5" />
          <span>Add New Interest</span>
        </motion.button>
      </motion.div>
    </motion.div>
  );
}