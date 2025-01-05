'use client'

import { useEffect, useState } from 'react'
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"

interface VisitorCount {
  id: string;
  count: number;
  last_updated: string;
}

export const VisitorCounter = () => {
  const [visitorCount, setVisitorCount] = useState<number>(0)
  const { toast } = useToast()

  useEffect(() => {
    const checkAndIncrementVisitorCount = async () => {
      try {
        // Check if user has already visited
        const hasVisited = localStorage.getItem('has_visited')
        
        if (hasVisited) {
          console.log('User has already visited, fetching current count...')
          // Just fetch and display the current count without incrementing
          const { data: currentData, error: fetchError } = await supabase
            .from('visitor_counts')
            .select('*')
            .single()

          if (fetchError) {
            console.error('Error fetching visitor count:', fetchError)
            return
          }

          console.log('Current visitor count:', currentData?.count)
          setVisitorCount(currentData?.count || 0)
          return
        }

        console.log('New visitor detected, incrementing count...')
        
        // First, get the current count
        const { data: currentData, error: fetchError } = await supabase
          .from('visitor_counts')
          .select('*')
          .single()

        if (fetchError) {
          console.error('Error fetching visitor count:', fetchError)
          return
        }

        console.log('Current visitor count:', currentData?.count)

        // Increment the count
        const newCount = (currentData?.count || 0) + 1
        const { error: updateError } = await supabase
          .from('visitor_counts')
          .update({ count: newCount, last_updated: new Date().toISOString() })
          .eq('id', currentData?.id)

        if (updateError) {
          console.error('Error updating visitor count:', updateError)
          return
        }

        console.log('Visitor count updated to:', newCount)
        setVisitorCount(newCount)

        // Mark user as having visited
        localStorage.setItem('has_visited', 'true')

      } catch (error) {
        console.error('Error in visitor counter:', error)
        toast({
          title: "Error",
          description: "Failed to update visitor count",
          variant: "destructive",
        })
      }
    }

    checkAndIncrementVisitorCount()
  }, []) // Run once on component mount

  return (
    <div className="flex items-center justify-center space-x-2 text-sm text-zinc-400">
      <span>Unique Visitors:</span>
      <span className="font-mono bg-zinc-800/50 px-2 py-0.5 rounded">
        {visitorCount.toLocaleString()}
      </span>
    </div>
  )
}