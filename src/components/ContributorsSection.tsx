import React from 'react';
import { motion } from 'framer-motion';
import { Github, Linkedin, Twitter } from 'lucide-react';

interface Contributor {
  name: string;
  role: string;
  image: string;
  github?: string;
  linkedin?: string;
  twitter?: string;
}

const contributors: Contributor[] = [
  {
    name: "Abheet Seth",
    role: "Lead Web Developer",
    image: "https://i.ibb.co/60Hgw4t/Whats-App-Image-2022-11-12-at-10-29-35.jpg",
    github: "https://github.com/AbheetHacker4278",
    linkedin: "https://www.linkedin.com/in/abheet-seth-58533a251/",
  },
  {
    name: "Abhishek Singhvi",
    role: "Supporting Web Developer",
    image: "https://avatars.githubusercontent.com/u/88542573?v=4",
    github: "https://github.com/abhisheksinghvi09",
    linkedin: "https://www.linkedin.com/in/abhishek--singhvi/"
  },
];

const ContributorsSection: React.FC = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const cardVariants = {
    hidden: { 
      opacity: 0,
      y: 20,
      scale: 0.95
    },
    visible: { 
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10
      }
    },
    hover: {
      scale: 1.05,
      boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    }
  };

  const imageVariants = {
    hidden: { scale: 0.8, rotate: -10 },
    visible: { 
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 20
      }
    },
    hover: {
      scale: 1.1,
      rotate: 5,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 15
      }
    }
  };

  const socialIconVariants = {
    hover: {
      scale: 1.2,
      rotate: 5,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    }
  };

  return (
    <section className="py-16 bg-transparent overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.h2
          className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            type: "spring",
            stiffness: 200,
            damping: 20,
            duration: 0.8
          }}
        >
          Meet Our Contributors
        </motion.h2>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {contributors.map((contributor, index) => (
            <motion.div
              key={index}
              className="bg-white/5 rounded-xl p-6 backdrop-blur-sm border border-white/10"
              variants={cardVariants}
              whileHover="hover"
            >
              <div className="flex items-center space-x-4">
                <motion.div
                  className="relative"
                  variants={imageVariants}
                  whileHover="hover"
                >
                  <motion.img
                    src={contributor.image}
                    alt={contributor.name}
                    className="w-16 h-16 rounded-full object-cover ring-2 ring-emerald-400/30"
                  />
                  <motion.div
                    className="absolute inset-0 rounded-full bg-gradient-to-r from-emerald-400/20 to-blue-500/20"
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0, 0.5, 0]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatType: "loop"
                    }}
                  />
                </motion.div>
                <div>
                  <motion.h3 
                    className="text-xl font-semibold text-white"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.2 }}
                  >
                    {contributor.name}
                  </motion.h3>
                  <motion.p 
                    className="text-emerald-400"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.2 + 0.1 }}
                  >
                    {contributor.role}
                  </motion.p>
                </div>
              </div>
              <motion.div 
                className="mt-4 flex space-x-3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 + 0.2 }}
              >
                {contributor.github && (
                  <motion.a
                    href={contributor.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-zinc-400 hover:text-white transition-colors"
                    variants={socialIconVariants}
                    whileHover="hover"
                  >
                    <Github className="h-5 w-5" />
                  </motion.a>
                )}
                {contributor.linkedin && (
                  <motion.a
                    href={contributor.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-zinc-400 hover:text-white transition-colors"
                    variants={socialIconVariants}
                    whileHover="hover"
                  >
                    <Linkedin className="h-5 w-5" />
                  </motion.a>
                )}
                {contributor.twitter && (
                  <motion.a
                    href={contributor.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-zinc-400 hover:text-white transition-colors"
                    variants={socialIconVariants}
                    whileHover="hover"
                  >
                    <Twitter className="h-5 w-5" />
                  </motion.a>
                )}
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default ContributorsSection;