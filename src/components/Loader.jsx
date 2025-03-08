import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Loader = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 4000);
  }, []);

  const Particle = ({ angle }) => (
    <motion.div
      className="absolute w-2 h-2 bg-blue-400 rounded-full"
      initial={{ scale: 0, opacity: 0 }}
      animate={{
        scale: [0, 1, 0],
        opacity: [0, 1, 0],
        x: Math.cos(angle) * 50,
        y: Math.sin(angle) * 50,
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "anticipate",
      }}
    />
  );

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          className="fixed inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-slate-300 to-white z-[9999]"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Floating Particles */}
          {[...Array(8)].map((_, i) => (
            <Particle key={i} angle={(i * Math.PI) / 4} />
          ))}

          {/* Main Orb */}
          <motion.div
            className="relative w-32 h-32 rounded-full bg-gradient-to-br from-cyan-400 to-blue-200 shadow-2xl"
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360],
              borderRadius: ["50%", "40%", "50%"],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            {/* Inner Glow */}
            <div className="absolute inset-0 bg-cyan-300/20 rounded-full animate-pulse" />

            {/* Dynamic Rings */}
            <motion.div
              className="absolute inset-0 border-4 border-cyan-300/30 rounded-full"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.8, 0.2, 0.8],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </motion.div>

          {/* Text Animation */}
          <motion.div
            className="mt-8 flex space-x-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {["L", "O", "A", "D", "I", "N", "G"].map((char, i) => (
              <motion.span
                key={i}
                className="text-2xl font-bold text-cyan-400"
                animate={{ y: [0, -15, 0] }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.1,
                }}
              >
                {char}
              </motion.span>
            ))}
          </motion.div>

          {/* Progress Bar */}
          <motion.div
            className="mt-6 w-48 h-2 bg-gray-800 rounded-full overflow-hidden"
            initial={{ width: 0 }}
            animate={{ width: "12rem" }}
            transition={{ duration: 3, ease: "linear" }}
          >
            <div className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 w-full" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Loader;
