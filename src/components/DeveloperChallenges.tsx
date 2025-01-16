import React, { useState } from 'react';
import { AlertTriangle, GitBranch, GitCommit, GitMerge } from 'lucide-react';

const challenges = [
  {
    icon: GitBranch,
    title: "Branch Management",
    description: "Struggling with creating, switching, and managing multiple branches."
  },
  {
    icon: GitCommit,
    title: "Commit Best Practices",
    description: "Unsure about how to write meaningful commit messages and when to commit."
  },
  {
    icon: GitMerge,
    title: "Merge Conflicts",
    description: "Difficulty in resolving merge conflicts and understanding their causes."
  },
  {
    icon: AlertTriangle,
    title: "GitHub Workflow",
    description: "Confusion about the overall GitHub workflow and collaboration process."
  },
];

const DeveloperChallenges = () => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  return (
    <div className="mt-16">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 relative">
        <span className="absolute inset-0 bg-gradient-to-r from-emerald-400 via-blue-500 to-emerald-400 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
          Common Challenges for New Developers
        </span>
        {/* Create a subtle text shadow effect for depth */}
        <span className="opacity-0">
          Common Challenges for New Developers
        </span>
      </h2>

      <div className="grid md:grid-cols-2 gap-8">
        {challenges.map((challenge, index) => (
          <div
            key={index}
            className={`
              p-6 rounded-xl border border-white/10
              transform transition-all duration-300 ease-in-out
              hover:scale-105 hover:shadow-lg hover:shadow-emerald-500/20
              ${hoveredIndex === index ? 'bg-white/10' : 'bg-white/5'}
              opacity-0 animate-slide-up
            `}
            style={{
              animationDelay: `${index * 150}ms`,
              animationFillMode: 'forwards'
            }}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <div className="relative">
              <challenge.icon
                className={`
                  w-10 h-10 mb-4
                  transition-all duration-300
                  ${hoveredIndex === index ? 'text-emerald-300 scale-110' : 'text-emerald-400'}
                `}
              />
              <div className={`
                absolute inset-0 bg-emerald-400 opacity-20 rounded-full w-10 h-10
                transform transition-transform duration-300
                ${hoveredIndex === index ? 'scale-150 animate-pulse' : 'scale-0'}
              `} />
            </div>

            <h3 className={`
              text-xl font-semibold mb-2 
              transition-colors duration-300
              ${hoveredIndex === index ? 'text-emerald-300' : 'text-white'}
            `}>
              {challenge.title}
            </h3>

            <p className={`
              transition-colors duration-300
              ${hoveredIndex === index ? 'text-zinc-300' : 'text-zinc-400'}
            `}>
              {challenge.description}
            </p>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .animate-slide-up {
          animation: slide-up 0.5s ease-out;
        }

        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};

export default DeveloperChallenges;