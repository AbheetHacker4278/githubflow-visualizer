// import React from 'react';
// import { motion, Variants } from 'framer-motion';

// const ElectricityAnimation: React.FC = () => {
//   const lineVariants: Variants = {
//     hidden: { pathLength: 0, opacity: 0 },
//     visible: { 
//       pathLength: 1, 
//       opacity: 1,
//       transition: { 
//         duration: 2,
//         ease: "easeInOut",
//         repeat: Infinity,
//         repeatType: "reverse",
//       }
//     }
//   };

//   return (
//     <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
//       <motion.path
//         d="M0,50 Q25,30 50,50 T100,50"
//         stroke="rgba(52, 211, 153, 0.2)"
//         strokeWidth="0.1"
//         fill="none"
//         variants={lineVariants}
//         initial="hidden"
//         animate="visible"
//       />
//       <motion.path
//         d="M0,70 Q35,50 70,70 T100,70"
//         stroke="rgba(59, 130, 246, 0.2)"
//         strokeWidth="0.1"
//         fill="none"
//         variants={lineVariants}
//         initial="hidden"
//         animate="visible"
//       />
//     </svg>
//   );
// };

// export default ElectricityAnimation;

import React from 'react';
import { motion, Variants } from 'framer-motion';

const ElectricityAnimation: React.FC = () => {
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

  const kiteVariants: Variants = {
    initial: { x: -20, y: 80, rotate: -5 },
    animate: {
      x: 120,
      y: 20,
      rotate: 5,
      transition: {
        duration: 8,
        repeat: Infinity,
        ease: "easeInOut",
        repeatType: "reverse"
      }
    }
  };

  const tailVariants: Variants = {
    initial: { pathLength: 0 },
    animate: {
      pathLength: 1,
      transition: {
        duration: 1.5,
        ease: "easeInOut",
        repeat: Infinity,
        repeatType: "reverse"
      }
    }
  };

  return (
    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
      {/* Background electricity lines */}
      <motion.path
        d="M0,50 Q25,30 50,50 T100,50"
        stroke="rgba(52, 211, 153, 0.2)"
        strokeWidth="0.1"
        fill="none"
        variants={lineVariants}
        initial="hidden"
        animate="visible"
      />
      <motion.path
        d="M0,70 Q35,50 70,70 T100,70"
        stroke="rgba(59, 130, 246, 0.2)"
        strokeWidth="0.1"
        fill="none"
        variants={lineVariants}
        initial="hidden"
        animate="visible"
      />

      {/* Diamond Kite */}
      <motion.g
        variants={kiteVariants}
        initial="initial"
        animate="animate"
      >
        <path d="M0,-4 L1.5,0 L0,4 L-1.5,0 Z" fill="url(#rainbowGradient)" />
        <path d="M0,-4 L1.5,0 L0,4 L-1.5,0 Z" fill="url(#sparklePattern)" fillOpacity="0.7" />
        <line x1="-1.5" y1="0" x2="1.5" y2="0" stroke="rgba(255, 255, 255, 0.8)" strokeWidth="0.15" />
        <line x1="0" y1="-4" x2="0" y2="4" stroke="rgba(255, 255, 255, 0.8)" strokeWidth="0.15" />
        <motion.path
          d="M0,4 Q1,6 0,8 Q-1,10 0,12"
          stroke="#FFD700"
          strokeWidth="0.15"
          fill="none"
          variants={tailVariants}
        />
      </motion.g>

      {/* Box Kite */}
      <motion.g
        variants={{
          ...kiteVariants,
          initial: { x: -10, y: 60, rotate: 5 },
          animate: {
            x: 110,
            y: 30,
            rotate: -5,
            transition: {
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
              repeatType: "reverse",
              delay: 2
            }
          }
        }}
        initial="initial"
        animate="animate"
      >
        <rect x="-1.5" y="-3" width="3" height="6" fill="url(#butterflyGradient)" />
        <rect x="-1.5" y="-3" width="3" height="6" fill="url(#glitterPattern)" fillOpacity="0.6" />
        <line x1="-1.5" y1="-1" x2="1.5" y2="-1" stroke="rgba(255, 255, 255, 0.8)" strokeWidth="0.15" />
        <line x1="-1.5" y1="1" x2="1.5" y2="1" stroke="rgba(255, 255, 255, 0.8)" strokeWidth="0.15" />
        <motion.path
          d="M0,3 Q1.5,5 0,7 Q-1.5,9 0,11"
          stroke="#FF69B4"
          strokeWidth="0.15"
          fill="none"
          variants={tailVariants}
        />
      </motion.g>

      {/* Delta Kite */}
      <motion.g
        variants={{
          ...kiteVariants,
          initial: { x: -15, y: 70, rotate: -8 },
          animate: {
            x: 115,
            y: 40,
            rotate: 8,
            transition: {
              duration: 9,
              repeat: Infinity,
              ease: "easeInOut",
              repeatType: "reverse",
              delay: 4
            }
          }
        }}
        initial="initial"
        animate="animate"
      >
        <path d="M0,-2 L3,2 L0,1 L-3,2 Z" fill="url(#starGradient)" />
        <line x1="0" y1="-2" x2="0" y2="2" stroke="rgba(255, 255, 255, 0.8)" strokeWidth="0.15" />
        <motion.path
          d="M0,2 Q1.5,4 0,6 Q-1.5,8 0,10"
          stroke="#9B59B6"
          strokeWidth="0.15"
          fill="none"
          variants={tailVariants}
        />
      </motion.g>

      {/* New Hexagonal Kite */}
      <motion.g
        variants={{
          ...kiteVariants,
          initial: { x: -5, y: 85, rotate: 0 },
          animate: {
            x: 105,
            y: 15,
            rotate: 360,
            transition: {
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut",
              repeatType: "reverse",
              delay: 1
            }
          }
        }}
        initial="initial"
        animate="animate"
      >
        <path 
          d="M0,-3 L2.6,-1.5 L2.6,1.5 L0,3 L-2.6,1.5 L-2.6,-1.5 Z" 
          fill="url(#hexagonGradient)"
        />
        <path 
          d="M0,-3 L2.6,-1.5 L2.6,1.5 L0,3 L-2.6,1.5 L-2.6,-1.5 Z" 
          fill="url(#hexSparklePattern)" 
          fillOpacity="0.5"
        />
        <motion.path
          d="M0,3 Q2,5 0,7 Q-2,9 0,11 Q2,13 0,15"
          stroke="#4CAF50"
          strokeWidth="0.15"
          fill="none"
          variants={tailVariants}
        />
      </motion.g>

      {/* New Starburst Kite */}
      <motion.g
        variants={{
          ...kiteVariants,
          initial: { x: -25, y: 75, rotate: 15 },
          animate: {
            x: 125,
            y: 25,
            rotate: -15,
            scale: [1, 1.2, 1],
            transition: {
              duration: 11,
              repeat: Infinity,
              ease: "easeInOut",
              repeatType: "reverse",
              delay: 3
            }
          }
        }}
        initial="initial"
        animate="animate"
      >
        <path 
          d="M0,-3 L0.8,-0.8 L3,0 L0.8,0.8 L0,3 L-0.8,0.8 L-3,0 L-0.8,-0.8 Z" 
          fill="url(#starburstGradient)"
        />
        <motion.path
          d="M0,3 Q-1,5 0,7 Q1,9 0,11 Q-1,13 0,15"
          stroke="#FFA726"
          strokeWidth="0.15"
          fill="none"
          variants={tailVariants}
        />
      </motion.g>

      {/* Gradients and Patterns */}
      <defs>
        {/* Existing gradients */}
        <linearGradient id="rainbowGradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FF0000" stopOpacity="0.8" />
          <stop offset="33%" stopColor="#FFFF00" stopOpacity="0.8" />
          <stop offset="66%" stopColor="#00FF00" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#0000FF" stopOpacity="0.8" />
        </linearGradient>

        <linearGradient id="butterflyGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FF69B4" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#DA70D6" stopOpacity="0.8" />
        </linearGradient>

        <linearGradient id="starGradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#9B59B6" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#3498DB" stopOpacity="0.8" />
        </linearGradient>

        {/* New gradients */}
        <linearGradient id="hexagonGradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#4CAF50" stopOpacity="0.8" />
          <stop offset="50%" stopColor="#81C784" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#A5D6A7" stopOpacity="0.8" />
        </linearGradient>

        <linearGradient id="starburstGradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FFA726" stopOpacity="0.8" />
          <stop offset="50%" stopColor="#FFB74D" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#FFCC80" stopOpacity="0.8" />
        </linearGradient>

        {/* Existing patterns */}
        <pattern id="sparklePattern" x="0" y="0" width="2" height="2" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r="0.15" fill="white" />
          <circle cx="0" cy="0" r="0.1" fill="white" />
        </pattern>

        <pattern id="glitterPattern" x="0" y="0" width="1" height="1" patternUnits="userSpaceOnUse">
          <circle cx="0.5" cy="0.5" r="0.15" fill="white" />
        </pattern>

        {/* New pattern */}
        <pattern id="hexSparklePattern" x="0" y="0" width="2" height="2" patternUnits="userSpaceOnUse">
          <path d="M1,1 L1.3,1.3 L1,1.6 L0.7,1.3 Z" fill="white" />
          <path d="M0,0 L0.3,0.3 L0,0.6 L-0.3,0.3 Z" fill="white" />
        </pattern>
      </defs>
    </svg>
  );
};

export default ElectricityAnimation;