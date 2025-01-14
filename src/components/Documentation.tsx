import React, { useState } from 'react';
import { Search, Menu, X, ChevronRight, ExternalLink, Github, GitBranch, GitCommit, Settings, Users, Code, BookOpen, Terminal, Shield, Zap, ArrowLeft } from 'lucide-react';

const Documentation = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSection, setActiveSection] = useState('Introduction');

  // Navigation data
  const navigation = [
    {
      section: 'Getting Started',
      items: ['Introduction', 'Quick Start Guide', 'Features Overview']
    },
    {
      section: 'Core Features',
      items: ['Repository Visualization', 'Commit History', 'Branch Management', 'Collaboration Tools']
    },
    {
      section: 'Guides',
      items: ['Setting Up GitViz', 'Connecting Repositories', 'Team Management', 'Custom Visualizations']
    },
    {
      section: 'Advanced Usage',
      items: ['API Integration', 'Security Best Practices', 'Performance Optimization', 'Custom Workflows']
    },
    {
      section: 'Resources',
      items: ['FAQs', 'Troubleshooting', 'API Reference', 'Community & Support']
    }
  ];

  // Content data
  const contentSections = {
    'Introduction': {
      title: 'Welcome to GitViz',
      content: (
        <>
          <p className="text-gray-300">
            GitViz is a powerful Git repository visualization tool that helps you understand and manage your codebase more effectively.
            Our platform provides intuitive visualizations of repository structures, commit histories, and team collaboration patterns.
          </p>

          <div className="mt-6 p-4 bg-blue-900/20 border border-blue-800/30 rounded-lg">
            <div className="flex items-center gap-2 text-blue-400">
              <h3 className="font-semibold">What's New</h3>
              <ExternalLink size={16} />
            </div>
            <p className="mt-2 text-blue-100">
              Explore our latest features including enhanced branch visualization, real-time collaboration tools, and improved performance analytics.
            </p>
          </div>

          <h2 className="mt-8">Platform Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <div className="p-4 bg-gray-800 rounded-lg border border-gray-700">
              <div className="flex items-center gap-2 mb-2">
                <GitBranch className="text-blue-400" size={20} />
                <h3 className="font-semibold">Repository Visualization</h3>
              </div>
              <p className="text-sm text-gray-300">
                Interactive visualization of your repository structure, branches, and merge patterns.
              </p>
            </div>

            <div className="p-4 bg-gray-800 rounded-lg border border-gray-700">
              <div className="flex items-center gap-2 mb-2">
                <GitCommit className="text-green-400" size={20} />
                <h3 className="font-semibold">Commit Analysis</h3>
              </div>
              <p className="text-sm text-gray-300">
                Deep insights into commit patterns, code changes, and development timeline.
              </p>
            </div>

            <div className="p-4 bg-gray-800 rounded-lg border border-gray-700">
              <div className="flex items-center gap-2 mb-2">
                <Users className="text-purple-400" size={20} />
                <h3 className="font-semibold">Team Collaboration</h3>
              </div>
              <p className="text-sm text-gray-300">
                Track team contributions, review patterns, and collaboration metrics.
              </p>
            </div>

            <div className="p-4 bg-gray-800 rounded-lg border border-gray-700">
              <div className="flex items-center gap-2 mb-2">
                <Settings className="text-yellow-400" size={20} />
                <h3 className="font-semibold">Custom Integration</h3>
              </div>
              <p className="text-sm text-gray-300">
                Flexible API and customization options for your workflow needs.
              </p>
            </div>
          </div>
        </>
      )
    },
    'Features Overview': {
      title: 'Features Overview',
      content: (
        <>
          <p className="text-gray-300 mb-6">
            GitViz offers a comprehensive set of features designed to enhance your Git workflow and team collaboration.
          </p>

          <div className="space-y-6">
            <div className="p-4 bg-gray-800 rounded-lg border border-gray-700">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Zap className="text-yellow-400" size={20} />
                Core Capabilities
              </h3>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start gap-2">
                  <ChevronRight className="mt-1 flex-shrink-0" size={16} />
                  <span>Real-time repository visualization with interactive graphs</span>
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight className="mt-1 flex-shrink-0" size={16} />
                  <span>Advanced commit history analysis and filtering</span>
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight className="mt-1 flex-shrink-0" size={16} />
                  <span>Branch management and merge visualization</span>
                </li>
              </ul>
            </div>

            <div className="p-4 bg-gray-800 rounded-lg border border-gray-700">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Users className="text-purple-400" size={20} />
                Collaboration Features
              </h3>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start gap-2">
                  <ChevronRight className="mt-1 flex-shrink-0" size={16} />
                  <span>Team activity monitoring and contributor insights</span>
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight className="mt-1 flex-shrink-0" size={16} />
                  <span>Code review integration and tracking</span>
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight className="mt-1 flex-shrink-0" size={16} />
                  <span>Custom team dashboards and reports</span>
                </li>
              </ul>
            </div>
          </div>
        </>
      )
    },
    'Commit History': {
      title: 'Commit History Analysis',
      content: (
        <>
          <p className="text-gray-300 mb-6">
            Understand your project's development history with GitViz's powerful commit analysis tools.
          </p>

          <div className="space-y-6">
            <div className="p-4 bg-gray-800 rounded-lg border border-gray-700">
              <h3 className="text-lg font-semibold mb-4">Commit Analysis Features</h3>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start gap-2">
                  <ChevronRight className="mt-1 flex-shrink-0" size={16} />
                  <span>Detailed commit metadata and change statistics</span>
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight className="mt-1 flex-shrink-0" size={16} />
                  <span>File change history and impact analysis</span>
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight className="mt-1 flex-shrink-0" size={16} />
                  <span>Author contribution tracking and timeline visualization</span>
                </li>
              </ul>
            </div>

            <div className="p-4 bg-gray-800 rounded-lg border border-gray-700">
              <h3 className="text-lg font-semibold mb-4">Usage Example</h3>
              <code className="block bg-gray-950 p-3 rounded text-sm">
                {`// Commit history analysis configuration
{
  "commitAnalysis": {
    "timeRange": "last-3-months",
    "authors": ["all"],
    "metrics": ["changes", "frequency", "impact"],
    "visualization": "timeline"
  }
}`}
              </code>
            </div>
          </div>
        </>
      )
    },
    'Branch Management': {
      title: 'Branch Management',
      content: (
        <>
          <p className="text-gray-300 mb-6">
            Efficiently manage and visualize your repository's branch structure with GitViz's branch management tools.
          </p>

          <div className="space-y-6">
            <div className="p-4 bg-gray-800 rounded-lg border border-gray-700">
              <h3 className="text-lg font-semibold mb-4">Branch Visualization</h3>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start gap-2">
                  <ChevronRight className="mt-1 flex-shrink-0" size={16} />
                  <span>Interactive branch tree visualization</span>
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight className="mt-1 flex-shrink-0" size={16} />
                  <span>Merge conflict detection and resolution tracking</span>
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight className="mt-1 flex-shrink-0" size={16} />
                  <span>Branch health and status monitoring</span>
                </li>
              </ul>
            </div>

            <div className="p-4 bg-blue-900/20 border border-blue-800/30 rounded-lg">
              <div className="flex items-center gap-2 text-blue-400">
                <h3 className="font-semibold">Best Practices</h3>
                <ExternalLink size={16} />
              </div>
              <p className="mt-2 text-blue-100">
                Follow our recommended branching strategies and workflows to maintain a clean and efficient repository structure.
              </p>
            </div>
          </div>
        </>
      )
    },
    'Setting Up GitViz': {
      title: 'Setting Up GitViz',
      content: (
        <>
          <p className="text-gray-300 mb-6">
            Follow these steps to set up GitViz for your repository and team.
          </p>

          <div className="space-y-6">
            <div className="p-4 bg-gray-800 rounded-lg border border-gray-700">
              <h3 className="text-lg font-semibold mb-4">Prerequisites</h3>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start gap-2">
                  <ChevronRight className="mt-1 flex-shrink-0" size={16} />
                  <span>Git repository (GitHub, GitLab, or Bitbucket)</span>
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight className="mt-1 flex-shrink-0" size={16} />
                  <span>Node.js v14 or higher</span>
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight className="mt-1 flex-shrink-0" size={16} />
                  <span>GitViz account (Free or Pro)</span>
                </li>
              </ul>
            </div>

            <div className="p-4 bg-gray-800 rounded-lg border border-gray-700">
              <h3 className="text-lg font-semibold mb-4">Installation Steps</h3>
              <code className="block bg-gray-950 p-3 rounded text-sm">
                {`# Install GitViz CLI
npm install -g @gitviz/cli

# Initialize in your repository
cd your-repository
gitviz init

# Configure your settings
gitviz config set --token YOUR_API_TOKEN
gitviz config set --team your-team-name`}
              </code>
            </div>
          </div>
        </>
      )
    },
    'Team Management': {
      title: 'Team Management',
      content: (
        <>
          <p className="text-gray-300 mb-6">
            Learn how to manage your team and collaborate effectively using GitViz.
          </p>

          <div className="space-y-6">
            <div className="p-4 bg-gray-800 rounded-lg border border-gray-700">
              <h3 className="text-lg font-semibold mb-4">Team Features</h3>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start gap-2">
                  <ChevronRight className="mt-1 flex-shrink-0" size={16} />
                  <span>Role-based access control and permissions</span>
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight className="mt-1 flex-shrink-0" size={16} />
                  <span>Team activity monitoring and reports</span>
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight className="mt-1 flex-shrink-0" size={16} />
                  <span>Collaboration metrics and insights</span>
                </li>
              </ul>
            </div>

            <div className="p-4 bg-gray-800 rounded-lg border border-gray-700">
              <h3 className="text-lg font-semibold mb-4">Team Configuration</h3>
              <code className="block bg-gray-950 p-3 rounded text-sm">
                {`// Team configuration example
{
  "team": {
    "name": "your-team",
    "roles": {
      "admin": ["user1", "user2"],
      "developer": ["user3", "user4"],
      "viewer": ["user5"]
    },
    "notifications": {
      "slack": true,
      "email": true
    }
  }
}`}
              </code>
            </div>
          </div>
        </>
      )
    },
    // ... (rest of the component remains the same)
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* Header */}
      <header className="fixed top-0 z-50 w-full bg-gray-800 border-b border-gray-700">
        <div className="flex items-center justify-between px-4 h-16">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-gray-700 rounded-lg"
            >
              {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div className="flex items-center gap-2">
              <GitBranch className="text-blue-400" size={24} />
              <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent">GitViz Documentation</h1>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <a href="https://github.com/AbheetHacker4278" className="p-2 hover:bg-gray-700 rounded-lg">
              <Github size={20} />
            </a>
            <a href="/" className="p-2 hover:bg-gray-700 rounded-lg">
              <ArrowLeft size={20} />
            </a>
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-gray-800 border-r border-gray-700 transform transition-transform duration-200 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        <nav className="h-full overflow-y-auto p-4">
          {navigation.map((nav) => (
            <div key={nav.section} className="mb-6">
              <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">
                {nav.section}
              </h2>
              <ul className="space-y-1">
                {nav.items.map((item) => (
                  <li key={item}>
                    <button
                      onClick={() => setActiveSection(item)}
                      className={`w-full flex items-center text-gray-300 hover:text-white hover:bg-gray-700 px-3 py-2 rounded-lg transition-colors ${activeSection === item ? 'bg-gray-700 text-white' : ''
                        }`}
                    >
                      <ChevronRight size={16} className="mr-2" />
                      {item}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main
        className={`pt-16 transition-all duration-200 ${isSidebarOpen ? 'ml-64' : 'ml-0'
          }`}
      >
        <div className="max-w-4xl mx-auto px-8 py-12">
          <article className="prose prose-invert max-w-none">
            {contentSections[activeSection] ? (
              <>
                <h1>{contentSections[activeSection].title}</h1>
                {contentSections[activeSection].content}
              </>
            ) : (
              <div className="p-4 bg-blue-900/20 border border-blue-800/30 rounded-lg">
                <p className="text-blue-100">
                  This section is currently being developed. Please check back soon!
                </p>
              </div>
            )}
          </article>
        </div>
      </main>
    </div>
  );
};

export default Documentation;