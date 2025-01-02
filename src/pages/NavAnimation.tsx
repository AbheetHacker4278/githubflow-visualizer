import React from 'react';
import { motion, Variants } from 'framer-motion';

const NavAnimation: React.FC = () => {
  const lineVariants: Variants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: { 
      pathLength: 1, 
      opacity: 1,
      transition: { 
        duration: 2,
        ease: "easeInOut",
        repeat: Infinity,
        repeatType: "reverse",
      }
    }
  };

  return (
    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
      <motion.path
        d="M0,50 Q25,30 50,50 T100,50"
        stroke="rgba(52, 211, 153, 0.2)"
        strokeWidth="4.1"
        fill="none"
        variants={lineVariants}
        initial="hidden"
        animate="visible"
      />
      <motion.path
        d="M0,70 Q35,50 70,70 T100,70"
        stroke="rgba(59, 130, 246, 0.2)"
        strokeWidth="4.1"
        fill="none"
        variants={lineVariants}
        initial="hidden"
        animate="visible"
      />
    </svg>
  );
};

export default NavAnimation;

