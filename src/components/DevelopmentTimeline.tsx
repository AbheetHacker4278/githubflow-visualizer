import React from 'react';
import { Check } from 'lucide-react';
import { motion } from 'framer-motion';

const DevelopmentTimeline = () => {
  const timelineItems = [
    { 
      year: "2025 - Phase 1", 
      title: "Launch", 
      description: "Initial platform release with core features",
      isCompleted: true 
    },
    { 
      year: "2025 - Phase 2", 
      title: "Feature - 1", 
      description: "Discussion Page for Developers",
      isCompleted: false 
    },
    { 
      year: "2025 - Phase 3", 
      title: "Feature - 2", 
      description: "AI powered Advanced analytics",
      isCompleted: false 
    },
    { 
      year: "2025 - Phase 4", 
      title: "Feature - 3", 
      description: "Integrated Development Environment",
      isCompleted: false 
    },
    { 
      year: "2025 - Phase 5", 
      title: "Expansion", 
      description: "More Features, Coming Soon...",
      isCompleted: false 
    }
  ];

  return (
    <div className="mt-32 relative">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent">
        Development Timeline
      </h2>
      <div className="relative">
        <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-px bg-gradient-to-b from-emerald-500/50 to-transparent" />
        {timelineItems.map((item, index) => (
          <motion.div
            key={index}
            className={`flex items-center gap-8 mb-12 ${
              index % 2 === 0 ? "flex-row" : "flex-row-reverse"
            }`}
            initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
          >
            <div className="flex-1">
              <motion.div
                className={`space-y-2 ${
                  index % 2 === 0 ? "text-right" : "text-left"
                } relative p-6 rounded-lg`}
                whileHover="hover"
              >
                <motion.div
                  className="absolute inset-0 bg-emerald-500/10 rounded-lg -z-10"
                  initial={{ opacity: 0 }}
                  variants={{
                    hover: { opacity: 1 }
                  }}
                />
                <div className="flex items-center justify-end gap-2">
                  <div className="text-emerald-400 font-mono">{item.year}</div>
                  {item.isCompleted && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{
                        type: "spring",
                        stiffness: 260,
                        damping: 20,
                      }}
                      className="bg-green-500/20 p-1 rounded-full"
                    >
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 0.6,
                          ease: "easeOut",
                        }}
                      >
                        <Check className="w-4 h-4 text-green-500" />
                      </motion.div>
                    </motion.div>
                  )}
                </div>
                <h3 className="text-xl font-semibold text-white">{item.title}</h3>
                <p className="text-zinc-400">{item.description}</p>
              </motion.div>
            </div>
            <div className="relative z-10">
              <motion.div
                className={`w-4 h-4 rounded-full ${
                  item.isCompleted ? 'bg-green-500' : 'bg-emerald-500'
                } ring-4 ring-emerald-500/20 relative`}
                whileHover="hover"
              />
            </div>
            <div className="flex-1" />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default DevelopmentTimeline;