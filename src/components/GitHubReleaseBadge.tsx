'use client'

import React, { useState, useEffect } from 'react'
import { Github, Clock, Tag } from 'lucide-react'

interface ReleaseInfo {
  tag_name: string
  name: string
  published_at: string
  body: string
  html_url: string
}

const GitHubReleaseBadge = () => {
  const [releaseInfo, setReleaseInfo] = useState<ReleaseInfo | null>(null)
  const [isExpanded, setIsExpanded] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchLatestRelease = async () => {
      try {
        const response = await fetch(
          'https://api.github.com/repos/AbheetHacker4278/githubflow-visualizer/releases/latest'
        )

        if (response.status === 404) {
          setError('No releases found for this repository')
          setReleaseInfo({
            tag_name: 'v0.0.0',
            name: 'No Release',
            published_at: new Date().toISOString(),
            body: 'This repository has no releases yet.',
            html_url: 'https://github.com/AbheetHacker4278/githubflow-visualizer/releases',
          })
          return
        }

        if (!response.ok) {
          throw new Error('Failed to fetch release information')
        }

        const data = await response.json()
        setReleaseInfo(data)
        setError(null)
      } catch (err) {
        console.error('Error fetching release info:', err)
        setError('Failed to fetch release information')
        setReleaseInfo({
          tag_name: 'v0.0.0',
          name: 'Error',
          published_at: new Date().toISOString(),
          body: 'Unable to fetch release information.',
          html_url: 'https://github.com/AbheetHacker4278/githubflow-visualizer/releases',
        })
      } finally {
        setLoading(false)
      }
    }

    fetchLatestRelease()

    // Refresh every 5 minutes
    const interval = setInterval(fetchLatestRelease, 300000)
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <div className="inline-flex items-center bg-emerald-400/20 text-emerald-400 text-sm font-medium px-4 py-1 rounded-full">
        <div className="w-4 h-4 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin mr-2" />
        Loading release info...
      </div>
    )
  }

  if (!releaseInfo) {
    return null
  }

  const formattedDate = new Date(releaseInfo.published_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })

  return (
    <div className="relative inline-block" onMouseLeave={() => setIsExpanded(false)}>
      <div
        className="bg-gradient-to-r from-emerald-400/20 to-emerald-400/0 hover:from-emerald-400/30 
                   cursor-pointer transition-all duration-300 group rounded-full"
        onMouseEnter={() => setIsExpanded(true)}
      >
        <div className="flex items-center space-x-2 px-4 py-1 rounded-full">
          <Tag className="w-4 h-4 text-emerald-400" />
          <span className="text-emerald-400 text-sm font-medium">
            {error ? 'No Release' : `Release ${releaseInfo.tag_name}`}
          </span>
        </div>
      </div>

      {isExpanded && (
        <div className="absolute top-full left-0 mt-2 w-72 bg-zinc-900/95 backdrop-blur-lg 
                      border border-emerald-500/20 rounded-lg shadow-xl z-50 p-4">
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-white font-medium">{releaseInfo.name || releaseInfo.tag_name}</h3>
            <a
              href={releaseInfo.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-400 hover:text-emerald-300"
            >
              <Github className="w-4 h-4" />
            </a>
          </div>

          <div className="flex items-center text-zinc-400 text-xs mb-3">
            <Clock className="w-3 h-3 mr-1" />
            <span>{formattedDate}</span>
          </div>

          {releaseInfo.body && (
            <div className="text-zinc-300 text-sm max-h-32 overflow-y-auto custom-scrollbar">
              {releaseInfo.body.split('\n').map((line, i) => (
                <p key={i} className="mb-1">
                  {line}
                </p>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default GitHubReleaseBadge