import React, { useState, useEffect } from 'react'
import { Menu, X, Github, Twitter, Mail, ExternalLink } from 'lucide-react'
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"
import { Hero } from '@/components/landing/Hero'
import { VisitorCounter } from '@/components/VisitorCounter'
import ElectricityAnimation from './ElectricityAnimation'
import ContributorsSection from '@/components/ContributorsSection'
import SparkAnimation from './SparkAnimation'
import { useInView } from 'react-intersection-observer'

const useAnimateInView = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  return { ref, controls: inView ? "visible" : "hidden" };
};

const features = [
  {
    title: "Real-time Visualization",
    description: "See your GitHub repository structure and activity in real-time with interactive visualizations.",
    icon: Github
  },
  {
    title: "Collaboration Insights",
    description: "Track team contributions and project progress with detailed analytics.",
    icon: ExternalLink
  },
  {
    title: "Custom Workflows",
    description: "Visualize and optimize your development workflow with customizable views.",
    icon: Mail
  }
];

const aboutContent = {
  mainHeading: "Powerful GitHub Visualization",
  description: "Transform your GitHub workflow with intuitive visualizations and powerful analytics tools.",
  benefits: [
    {
      title: "Interactive Graphs",
      description: "Visualize repository structure and relationships with interactive graph layouts."
    },
    {
      title: "Real-time Updates",
      description: "See changes and updates to your repository in real-time as they happen."
    },
    {
      title: "Team Collaboration",
      description: "Track team contributions and project progress with detailed analytics."
    }
  ]
};

const footerLinks = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "#features" },
      { label: "Documentation", href: "#docs" },
      { label: "About", href: "#about" }
    ]
  },
  {
    title: "Resources",
    links: [
      { label: "Blog", href: "#" },
      { label: "Support", href: "#" },
      { label: "Contact", href: "#" }
    ]
  }
];

const Landing = () => {
  const navigate = useNavigate()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { label: "Features", href: "#features" },
    { label: "Documentation", href: "#docs" },
    { label: "About Us", href: "#about" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 to-black overflow-hidden">
      {/* Navbar */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-black/30 backdrop-blur-sm border-b border-white/10' : ''}`}>
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
              <VisitorCounter />
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
            className={`md:hidden transition-all duration-300 ease-in-out ${
              isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 pointer-events-none'
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
              <div className="px-4">
                <VisitorCounter />
              </div>
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

        <div className="container mx-auto px-4 relative">
          {/* Hero Section */}
          <Hero />

          {/* Features Section */}
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent">
            How GitViz works
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

          {/* Timeline Sections */}
          <motion.div
            className="mt-32 relative"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent">
              Development Timeline
            </h2>
            <div className="relative">
              <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-px bg-gradient-to-b from-emerald-500/50 to-transparent" />
              {[
                { year: "2025", title: "Launch", description: "Initial platform release with core features" },
                { year: "2025 Q2", title: "Expansion", description: "Advanced analytics and team collaboration" },
                { year: "2025 Q3", title: "More Features", description: "Other Collaborators integrations and API access" },
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
                      className={`space-y-2 ${index % 2 === 0 ? "text-right" : "text-left"} relative`}
                      whileHover="hover"
                    >
                      <motion.div
                        className="absolute inset-0 bg-emerald-500/10 rounded-lg -z-10"
                        initial={{ opacity: 0 }}
                        variants={{
                          hover: { opacity: 1 }
                        }}
                      />
                      <ElectricityAnimation />
                      <div className="text-emerald-400 font-mono">{item.year}</div>
                      <h3 className="text-xl font-semibold text-white">{item.title}</h3>
                      <p className="text-zinc-400">{item.description}</p>
                    </motion.div>
                  </div>
                  <div className="relative z-10">
                    <motion.div
                      className="w-4 h-4 rounded-full bg-emerald-500 ring-4 ring-emerald-500/20 relative"
                      whileHover="hover"
                    >
                      <motion.div
                        className="absolute inset-0"
                        variants={{
                          hover: { scale: 1.5, opacity: 0 }
                        }}
                        transition={{ duration: 0.3 }}
                      >
                        <SparkAnimation />
                      </motion.div>
                    </motion.div>
                  </div>
                  <div className="flex-1" />
                </motion.div>
              ))}
            </div>
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
                <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent">
                  {aboutContent.mainHeading}
                </h2>
                <p className="text-zinc-400 text-lg leading-relaxed">
                  {aboutContent.description}
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

          <div id='about'>
            <ContributorsSection />
          </div>

          {/* Statistics Section */}
          <motion.div
            className="mt-32 grid md:grid-cols-3 gap-8"
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
        </div>
      </div>
    </div>
  )
}

export default Landing
