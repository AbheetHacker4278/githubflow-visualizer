import React from 'react';
import { motion } from 'framer-motion';

const SparkAnimation: React.FC = () => {
  const sparkVariants = {
    initial: { scale: 0, opacity: 0 },
    animate: { scale: [0, 4, 0], opacity: [0, 5, 0] },
  };

  return (
    <div className="absolute inset-0 pointer-events-none">
      {[...Array(5)].map((_, index) => (
        <motion.div
          key={index}
          className="absolute w-1 h-1 bg-emerald-400"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          variants={sparkVariants}
          initial="initial"
          animate="animate"
          transition={{
            duration: 0.5,
            delay: index * 0.1,
            repeat: Infinity,
            repeatDelay: 1,
          }}
        />
      ))}
    </div>
  );
};

export default SparkAnimation;
