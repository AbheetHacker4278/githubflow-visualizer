import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"
import GitHubReleaseBadge from "@/components/GitHubReleaseBadge"

export const Hero = () => {
  const navigate = useNavigate()

  return (
    <motion.div
      className="flex flex-col lg:flex-row items-center justify-between gap-16 mb-32 pt-16"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className="flex-1 text-center lg:text-left">
        <div className="inline-block">
          <div className="inline-block">
            <GitHubReleaseBadge />
          </div>
        </div>
        <motion.h1
          className="text-4xl md:text-6xl font-bold mb-6 leading-tight"
          initial={{ backgroundPosition: "0% 50%" }}
          animate={{ backgroundPosition: "100% 50%" }}
          transition={{ duration: 5, repeat: Infinity, repeatType: "reverse", ease: "linear" }}
          style={{
            backgroundImage: "linear-gradient(to right, #10B981, #3B82F6, #10B981)",
            backgroundSize: "200% auto",
            color: "transparent",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
          }}
        >
          Visualize Your
          <br />
          GitHub Universe
        </motion.h1>
        <p className="text-zinc-400 text-lg md:text-xl mb-8 max-w-xl">
          Transform your development insights with powerful visualization tools. Make data-driven decisions faster than ever before.
        </p>
        <motion.div
          className="flex flex-wrap gap-4 justify-center lg:justify-start"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          <Button
            onClick={() => navigate("/app")}
            className="border rounded border-purple-500 group px-6 py-6 text-lg bg-transparent hover:bg-white/10 text-white transition-colors duration-300"
          >
            Get Started For Free
            <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Button>
        </motion.div>
      </div>
      <div className="flex-1">
        <div className="relative w-full aspect-square max-w-lg mx-auto">
          {/* Multiple layered background effects */}
          <div className="absolute -inset-4">
            <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/30 via-blue-500/30 to-emerald-500/30 blur-3xl opacity-60 animate-pulse" />
            <div className="absolute inset-0 bg-gradient-to-bl from-purple-600/20 via-indigo-500/20 to-purple-500/20 blur-2xl" />
            <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 via-blue-500/20 to-purple-500/20 blur-xl opacity-80" />
          </div>

          {/* Content container with glass effect */}
          <div className="relative bg-zinc-900/40 backdrop-blur-xl rounded-2xl p-4 shadow-2xl border border-white/10">
            {/* Subtle inner glow */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-white/5 to-transparent" />

            {/* Image */}
            <motion.div
              className="relative rounded-xl overflow-hidden"
              initial={{ y: 0 }}
              animate={{ y: [-10, 10, -10] }}
              transition={{
                repeat: Infinity,
                duration: 6,
                ease: "easeInOut"
              }}
            >
              <motion.div
                className="absolute inset-0 bg to-transparent"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
              />
              <motion.img
                src="https://metaversus-web3.vercel.app/get-started.png"
                alt="GitHub Flow Visualization"
                className="w-full h-full object-cover"
                initial={{ scale: 1 }}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              />
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
