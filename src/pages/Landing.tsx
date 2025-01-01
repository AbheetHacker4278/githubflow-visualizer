import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/components/AuthProvider";
import { Button } from "@/components/ui/button";
import { ArrowRight, BarChart2, Code2, GitBranch, Github, Twitter, Mail, ExternalLink, Menu, X } from 'lucide-react';
import { motion } from "framer-motion";
import ElectricityAnimation from './ElectricityAnimation';
import { useAnimateInView } from '@/hooks/useAnimateInView';


const Landing = () => {
  const navigate = useNavigate();
  const { session } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (session) {
      navigate("/app");
    }
  }, [session, navigate]);

  const navLinks = [
    { label: "Features", href: "#features" },
    { label: "Documentation", href: "#docs" },
    { label: "About", href: "#about" },
  ];

  const features = [
    {
      title: "Repository Analysis",
      description: "Get deep insights into your repositories with advanced analytics and metrics visualization.",
      icon: BarChart2,
    },
    {
      title: "Language Breakdown",
      description: "Comprehensive analysis of programming languages across your entire codebase.",
      icon: Code2,
    },
    {
      title: "Workflow Visualization",
      description: "Interactive visualization of your CI/CD pipelines and GitHub Actions workflows.",
      icon: GitBranch,
    },
  ];

  const footerLinks = [
    {
      title: "Product",
      links: [
        { label: "Features", href: "#features" },
        { label: "Integrations", href: "#integrations" },
        { label: "Documentation", href: "#docs" },
        { label: "API", href: "#api" },
      ]
    },
    {
      title: "Resources",
      links: [
        { label: "Community", href: "#community" },
        { label: "Help Center", href: "#help" },
        { label: "Security", href: "#security" },
        { label: "Roadmap", href: "#roadmap" },
      ]
    },
    {
      title: "Company",
      links: [
        { label: "About", href: "#about" },
        { label: "Blog", href: "#blog" },
        { label: "Careers", href: "#careers" },
        { label: "Contact", href: "#contact" },
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 to-black overflow-hidden">
      {/* Navbar */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-black/50 backdrop-blur-lg border-b border-white/10' : ''}`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <a href="/" className="flex items-center space-x-2">
              <span className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent">
                GitViz
              </span>
            </a>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  className="text-zinc-400 hover:text-white transition-colors duration-200 text-sm relative group"
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-emerald-400 transition-all duration-200 group-hover:w-full" />
                </a>
              ))}
            </div>

            {/* Desktop CTA */}
            <div className="hidden md:flex items-center space-x-4">
              <Button
                onClick={() => navigate("/auth")}
                variant="ghost"
                className="text-zinc-400 hover:text-white hover:bg-white/10 border rounded-full border-purple-400"
              >
                Sign In
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-zinc-400 hover:text-white transition-colors"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>

          {/* Mobile Navigation */}
          <div
            className={`md:hidden transition-all duration-300 ease-in-out ${isMobileMenuOpen
                ? 'max-h-96 opacity-100'
                : 'max-h-0 opacity-0 pointer-events-none'
              }`}
          >
            <div className="py-4 space-y-4 bg-gray-900 text-white">
              {navLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  className="block px-4 py-2 text-zinc-400 hover:text-white transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <div className="pt-4 border-t border-white/10 space-y-4 px-4">
                <Button
                  onClick={() => navigate("/auth")}
                  variant="ghost"
                  className="w-full text-zinc-400 hover:text-white hover:bg-white/10"
                >
                  Sign In
                </Button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="relative">
        {/* Background grid effect */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8882_1px,transparent_1px),linear-gradient(to_bottom,#8882_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        {/* Electricity Animation */}
        <ElectricityAnimation />

        <div className="container mx-auto px-4 py-16 relative">
          {/* Hero Section */}
          <motion.div
            className="flex flex-col lg:flex-row items-center justify-between gap-16 mb-32 pt-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-block">
                <span className="bg-gradient-to-r from-emerald-400/20 to-emerald-400/0 text-emerald-400 text-sm font-medium px-4 py-1 rounded-full mb-6 inline-block">
                  New Release v2.0
                </span>
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
                    onClick={() => navigate("/auth")}
                    className="border rounded border-purple-500 group px-6 py-6 text-lg bg-transparent hover:bg-white/10 text-white transition-colors duration-300"
                  >
                    Get Started Free
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Button>
              </motion.div>
            </div>
            <motion.div
              className="flex-1"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
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
            </motion.div>
          </motion.div>

          {/* Features Section */}
          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            {features.map((feature, index) => {
              const { ref, controls } = useAnimateInView();
              return (
                <motion.div
                  key={index}
                  ref={ref}
                  initial="hidden"
                  animate={controls}
                  variants={{
                    visible: { opacity: 1, y: 0 },
                    hidden: { opacity: 0, y: 20 }
                  }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  className="group p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-emerald-500/50 hover:bg-white/[0.07] transition-all duration-300"
                >
                  <div className="mb-4 p-3 rounded-lg bg-emerald-500/10 w-fit">
                    <feature.icon className="h-6 w-6 text-emerald-400" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-white group-hover:text-emerald-400 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-zinc-400 leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Footer Section */}
          <footer className="mt-32 border-t border-white/10">
            <div className="py-16">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
                {/* Brand section */}
                <div className="col-span-2 md:col-span-1">
                  <h3 className="text-white font-bold text-lg mb-4">GitViz</h3>
                  <p className="text-zinc-400 text-sm mb-6">
                    Transforming GitHub data into actionable insights for developers and teams.
                  </p>
                  <div className="flex gap-4">
                    <a href="#" className="text-zinc-400 hover:text-white transition-colors">
                      <Github className="h-5 w-5" />
                    </a>
                    <a href="#" className="text-zinc-400 hover:text-white transition-colors">
                      <Twitter className="h-5 w-5" />
                    </a>
                    <a href="#" className="text-zinc-400 hover:text-white transition-colors">
                      <Mail className="h-5 w-5" />
                    </a>
                  </div>
                </div>

                {/* Links sections */}
                {footerLinks.map((section, index) => (
                  <div key={index}>
                    <h3 className="text-white font-semibold mb-4">{section.title}</h3>
                    <ul className="space-y-3">
                      {section.links.map((link, linkIndex) => (
                        <li key={linkIndex}>
                          <a
                            href={link.href}
                            className="text-zinc-400 hover:text-white transition-colors text-sm flex items-center gap-1 group"
                          >
                            {link.label}
                            <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {/* Bottom footer */}
              <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
                <p className="text-zinc-400 text-sm">
                  © 2024 GitViz. All rights reserved.
                </p>
                <div className="flex gap-6">
                  <a href="#" className="text-zinc-400 hover:text-white transition-colors text-sm">
                    Privacy Policy
                  </a>
                  <a href="#" className="text-zinc-400 hover:text-white transition-colors text-sm">
                    Terms of Service
                  </a>
                  <a href="#" className="text-zinc-400 hover:text-white transition-colors text-sm">
                    Cookies
                  </a>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default Landing;

