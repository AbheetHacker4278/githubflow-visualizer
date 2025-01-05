import React, { useState, useEffect } from 'react';

const ActiveUsersCounter = () => {
  const [count, setCount] = useState(65000000);
  const [isIncrementing, setIsIncrementing] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount(prevCount => {
        setIsIncrementing(true);
        setTimeout(() => setIsIncrementing(false), 200);
        return prevCount + Math.floor(Math.random() * 10);
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formattedCount = count.toLocaleString();

  return (
    <div className="relative overflow-hidden w-full max-w-md mx-auto hover:rounded-2xl">
      <div 
        className="transform transition-all duration-700 ease-out hover:scale-105 hover:rounded-2xl"
      >
        <div className="relative p-8 rounded-2xl bg-gradient-to-br from-emerald-700 to-transparent shadow-xl border border-slate-700 hover:rounded-2xl">
          {/* Animated background glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-blue-500/10 animate-pulse rounded-2xl hover:rounded-2xl" />
          
          <div className="relative hover:rounded-2xl">
            <h3 className="text-2xl font-bold mb-6 bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent animate-fade-in hover:rounded-2xl">
              Active GitHub Users
            </h3>
            
            <div className="relative">
              <div className={`text-5xl font-bold text-white transition-all duration-300 ${
                isIncrementing ? 'transform translate-y-1 scale-105' : ''
              }`}>
                {formattedCount}
              </div>
              
              {/* Floating particles */}
              <div className="absolute -right-2 -top-2">
                <div className="h-2 w-2 rounded-full bg-emerald-400 animate-ping opacity-75" />
              </div>
              <div className="absolute -left-1 bottom-0">
                <div className="h-1 w-1 rounded-full bg-blue-400 animate-ping opacity-75 animation-delay-700" />
              </div>
            </div>

            <p className="mt-4 text-zinc-400 font-medium">
              and growing every second!
            </p>

            {/* Animated indicator */}
            <div className="absolute -bottom-1 -right-1">
              <div className="h-3 w-3 rounded-full bg-emerald-500">
                <div className="h-3 w-3 rounded-full bg-emerald-400 animate-ping opacity-75" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActiveUsersCounter;  