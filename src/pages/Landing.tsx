import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/components/AuthProvider";
import { FaCheck, FaClock } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { ArrowRight, BarChart2, Code2, GitBranch, Github, Twitter, Mail, ExternalLink, Menu, X, Check } from 'lucide-react';
import { motion } from "framer-motion";
import { useAnimateInView } from '@/hooks/useAnimateInView';
import GitHubReleaseBadge from '@/components/GitHubReleaseBadge';
import ElectricityAnimation from './ElectricityAnimation';
import SparkAnimation from './SparkAnimation';
import NavAnimation from './NavAnimation';
import ContributorsSection from '@/components/ContributorsSection';
import { useAnimationControls } from 'framer-motion';
import ActiveUsersCounter from '@/components/ActiveUsersCounter';
import DeveloperChallenges from '@/components/DeveloperChallenges';
import ChatBot from '@/components/ChatBot';
import ChatbotNotification from '@/components/ChatbotNotification';
import { UserMenu } from '@/components/UserMenu';
import { VisualizationHistory } from '@/components/VisualizationHistory';
import Documentation from '../components/Documentation';
import Graph3D from '@/components/Graph3D';

const Landing = () => {
  const navigate = useNavigate();
  const controls = useAnimationControls();
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

  const navLinks = [
    { label: "Features", href: "#features" },
    { label: "Documentation", href: "/Documentation" },
    { label: "About Us", href: "#about" },
    { label: "Discussion", href: "/discussion" },
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

  const aboutContent = {
    mainHeading: "Revolutionizing GitHub Analytics",
    description: "We're on a mission to transform how developers understand and interact with their GitHub data. Our platform combines powerful analytics with intuitive visualizations to help you make better decisions.",
    benefits: [
      {
        title: "Real-time Insights",
        description: "Get instant updates on your repository metrics and team performance."
      },
      {
        title: "AI-Powered Analysis",
        description: "Advanced algorithms help identify patterns and optimization opportunities."
      },
      {
        title: "Team Collaboration",
        description: "Foster better collaboration with shared dashboards and insights."
      }
    ]
  };

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
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-black/30 backdrop-blur-sm border-b border-white/10' : ''}`}>
        <div className="absolute inset-0 overflow-hidden">
          <NavAnimation />
        </div>
        <div className="container mx-auto px-4 relative z-10">
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
              {session ? (
                [
                  <UserMenu />,
                  <VisualizationHistory />
                ]
              ) : (
                <Button
                  onClick={() => navigate("/auth")}
                  variant="ghost"
                  className="text-zinc-400 hover:text-white hover:bg-white/10 border rounded-full border-purple-400"
                >
                  Sign In
                </Button>
              )}
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
            className={`md:hidden transition-all duration-300 ease-in-out ${isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 pointer-events-none'
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
                {session ? (
                  <Button
                    onClick={() => navigate("/app")}
                    variant="ghost"
                    className="w-full text-zinc-400 hover:text-white hover:bg-white/10"
                  >
                    Go to App
                  </Button>
                ) : (
                  <Button
                    onClick={() => navigate("/auth")}
                    variant="ghost"
                    className="w-full text-zinc-400 hover:text-white hover:bg-white/10"
                  >
                    Sign In
                  </Button>
                )}
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
              <div className="relative overflow-hidden">
                <p className="text-lg md:text-xl mb-8 max-w-xl opacity-0 animate-fade-in">
                  <span className="inline-block animate-slide-up bg-gradient-to-r from-emerald-400 via-yellow-300 to-purple-400 bg-[length:200%_auto] animate-gradient bg-clip-text text-transparent">
                    Transform your development insights with powerful visualization tools. Make data-driven decisions faster than ever before.
                  </span>
                </p>
              </div>
              <motion.div
                className="flex flex-wrap gap-4 justify-center lg:justify-start"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
              >
                <button
                  onClick={() => navigate("/app")}
                  className="relative group px-6 py-4 text-lg overflow-hidden rounded border border-purple-500 transition-all duration-300"
                >
                  {/* Gradient background */}
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-green-500 to-yellow-500 opacity-0 group-hover:opacity-20 bg-[length:200%_auto] animate-gradient transition-opacity duration-300" />

                  {/* Button content */}
                  <div className="relative flex items-center justify-center">
                    <span className="bg-gradient-to-r from-yellow-400 to-emerald-400 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
                      Get Started For Free
                    </span>
                    <ArrowRight className="ml-2 h-5 w-5 text-purple-400 transition-transform group-hover:translate-x-1" />
                  </div>
                </button>
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
                <div className="relative rounded-2xl p-4">
                  {/* Subtle inner glow */}
                  <div className="absolute inset-0 rounded-2xl" />

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
                      src="https://i.ibb.co/Pz1Prk6q/Untitled-removebg-preview.png"
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
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 relative">
            <span className="absolute inset-0 bg-gradient-to-r from-emerald-400 via-blue-500 to-emerald-400 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
              How GitViz works
            </span>
            {/* Create a subtle text shadow effect for depth */}
            <span className="opacity-0">
              How GitViz works
            </span>
          </h2>
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
                  className="group p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-purple-500/50 hover:bg-white/[0.07] transition-all duration-300"
                >
                  <div className="mb-4 p-3 rounded-lg bg-emerald-500/10 w-fit">
                    <feature.icon className="h-6 w-6 text-emerald-400" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-white group-hover:text-green-400 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-zinc-400 leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>

          <ChatbotNotification />

          {/* Timeline Sections */}
          <motion.div
            className="mt-32 relative"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 relative">
              <span className="absolute inset-0 bg-gradient-to-r from-emerald-400 via-blue-500 to-emerald-400 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
                Development Timeline
              </span>
              {/* Create a subtle text shadow effect for depth */}
              <span className="opacity-0">
                Development Timeline
              </span>
            </h2>
            <div className="relative">
              <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-px bg-gradient-to-b from-emerald-500/50 to-transparent" />
              {[
                {
                  year: "2025 - Phase 1",
                  title: "Launch With Core Feature",
                  description: "Initial platform release with core features",
                  isCompleted: true,
                },
                {
                  year: "2025 - Phase 2",
                  title: "Feature - 1",
                  description: "Discussion Page for Developers",
                  isCompleted: true,
                },
                {
                  year: "2025 - Phase 3",
                  title: "Feature - 2",
                  description: "Integrated Development Environment",
                  isCompleted: false,
                },
                {
                  year: "2025 - Phase 4",
                  title: "Feature - 3",
                  description: "More Customizations Editable features",
                  isCompleted: false,
                },
                {
                  year: "2025 - Phase 5",
                  title: "Expansion",
                  description: "More Features, Coming Soon...",
                  isCompleted: false,
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  className={`flex items-center gap-8 mb-12 ${index % 2 === 0 ? "flex-row" : "flex-row-reverse"
                    }`}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                >
                  <div className="flex-1 text-right">
                    <motion.div
                      className={`space-y-2 ${index % 2 === 0 ? "text-right" : "text-left"
                        } relative`}
                      whileHover="hover"
                    >
                      <motion.div
                        className="absolute inset-0 bg-emerald-500/10 rounded-lg -z-10"
                        initial={{ opacity: 0 }}
                        variants={{
                          hover: { opacity: 1 },
                        }}
                      />
                      <div className="text-emerald-400 font-mono">{item.year}</div>
                      <h3 className="text-xl font-semibold text-white">{item.title}</h3>
                      <p className="text-zinc-400">{item.description}</p>
                    </motion.div>
                  </div>
                  <div className="relative z-10 flex items-center justify-center">
                    {item.isCompleted ? (
                      <div className='group'>
                        <FaCheck className="w-6 h-6 text-zinc-900 border border-green-600 rounded-full p-1 bg-emerald-400" />
                        <span className="absolute invisible group-hover:visible bg-gray-800 text-white px-2 py-1 rounded text-sm -top-8 left-1/2 transform -translate-x-1/2">Completed</span>
                      </div>
                    ) : (
                      <div className='group'>
                        <FaClock className="w-6 h-6 text-zinc-900 border border-green-600 rounded-full p-1 bg-yellow-400" />
                        <span className="absolute invisible group-hover:visible bg-gray-800 text-white px-2 py-1 rounded text-sm -top-8 left-1/2 transform -translate-x-1/2">Under Development</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1" />
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            className="mt-32"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            <ActiveUsersCounter />
          </motion.div>

          <motion.section
            id='features'
            className="mt-32 relative"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            {/* Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-r from-emerald-500/20 to-blue-500/20 rounded-full blur-3xl" />
            </div>

            <div className="relative container mx-auto px-4">
              {/* Header */}
              <motion.div
                className="text-center max-w-3xl mx-auto mb-16"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 relative">
                  <span className="absolute inset-0 bg-gradient-to-r from-emerald-400 via-blue-500 to-emerald-400 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
                    {aboutContent.mainHeading}
                  </span>
                  {/* Create a subtle text shadow effect for depth */}
                  <span className="opacity-0">
                    {aboutContent.mainHeading}
                  </span>
                </h2>
                <p className="text-lg leading-relaxed overflow-hidden">
                  <span className="inline-block bg-gradient-to-r from-emerald-400 via-yellow-300 to-purple-400 bg-[length:200%_auto] animate-gradient bg-clip-text text-transparent">
                    {aboutContent.description}
                  </span>
                </p>
              </motion.div>

              {/* Benefits Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {aboutContent.benefits.map((benefit, index) => (
                  <motion.div
                    key={index}
                    className="relative group"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.2 }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-blue-500/5 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-300" />
                    <div className="relative p-6 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm">
                      <h3 className="text-xl font-semibold mb-3 text-white group-hover:text-emerald-400 transition-colors">
                        {benefit.title}
                      </h3>
                      <p className="text-zinc-400 leading-relaxed">
                        {benefit.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.section>

          <DeveloperChallenges />

          <div id='about'>
            <ContributorsSection />
          </div>

          {/* <div className='max-w-96 max-h-96'>
            <Graph3D />
          </div> */}

          {/* Statistics Section */}
          <h3 className="text-3xl md:text-4xl font-bold text-center mb-12 relative">
            <span className="absolute inset-0 bg-gradient-to-r from-emerald-400 via-blue-500 to-emerald-400 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
              How GitViz is been Optimized
            </span>
            {/* Create a subtle text shadow effect for depth */}
            <span className="opacity-0">
              How GitViz is been Optimized
            </span>
          </h3>
          <motion.div
            className="mt-20 grid md:grid-cols-3 gap-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            {[
              { value: "2 Months+ ", label: "Takes more than 2 months for code optimization" },
              { value: "8K+", label: "Lines of Code Written by Me + AI tools" },
              { value: "99.9%", label: "Uptime" },
            ].map((stat, index) => (
              <motion.div
                key={index}
                className="relative group"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-blue-500/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300" />
                <div className="relative p-8 rounded-2xl border border-white/10 bg-white/5">
                  <div className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent mb-2">
                    {stat.value}
                  </div>
                  <div className="text-zinc-400">{stat.label}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Footer Section */}
          <footer className="mt-32 border-t border-white/10">
            <div className="py-16">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
                {/* Brand section */}
                <div className="col-span-2 md:col-span-1">
                  <h3 className="font-bold text-lg mb-4 bg-gradient-to-r from-blue-400 to-green-200 bg-clip-text text-transparent">GitViz</h3>

                  <p className="text-zinc-400 text-sm mb-6">
                    Transforming GitHub data into actionable insights for developers and teams.
                  </p>
                  <div className="flex gap-4">
                    <a href="https://github.com/AbheetHacker4278/githubflow-visualizer.git" className="text-zinc-400 hover:text-white transition-colors">
                      <Github className="h-5 w-5" />
                    </a>
                    <a href="#" className="text-zinc-400 hover:text-white transition-colors">
                      <Twitter className="h-5 w-5" />
                    </a>
                    <a href="mailto:aseth9588@gmail.com" className="text-zinc-400 hover:text-white transition-colors">
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
                  © 2025 GitViz. All rights reserved.
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
          <ChatBot />
        </div>
      </div>
    </div>
  );
};

const keyframes = {
  '@keyframes gradient': {
    '0%': { backgroundPosition: '0% center' },
    '100%': { backgroundPosition: '-200% center' },
  },
};

const style = document.createElement('style');
style.textContent = `
  @keyframes gradient {
    0% { background-position: 0% center; }
    100% { background-position: -200% center; }
  }
  .animate-gradient {
    animation: gradient 3s linear infinite;
  }
  @keyframes fadeIn {
    0% { opacity: 0; }
    100% { opacity: 1; }
  }
  .animate-fade-in {
    animation: fadeIn 0.8s ease-out forwards;
  }
  @keyframes slideUp {
    0% { transform: translateY(20px); }
    100% { transform: translateY(0); }
  }
  .animate-slide-up {
    animation: slideUp 0.8s ease-out forwards;
  }
`;
document.head.appendChild(style);


export default Landing;