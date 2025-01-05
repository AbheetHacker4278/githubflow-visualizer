'use client'

import { useEffect, useState } from 'react'
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { motion, AnimatePresence } from 'framer-motion'

interface VisitorCount {
  id: string;
  count: number;
  last_updated: string;
}

export const VisitorCounter = () => {
  const [visitorCount, setVisitorCount] = useState<number>(0)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const checkAndIncrementVisitorCount = async () => {
      try {
        setIsLoading(true)
        const hasVisited = localStorage.getItem('has_visited')
        
        const { data: currentData, error: fetchError } = await supabase
          .from('visitor_counts')
          .select('*')
          .single()

        if (fetchError) {
          console.error('Error fetching visitor count:', fetchError)
          return
        }

        let newCount = currentData?.count || 0

        if (!hasVisited) {
          newCount += 1
          await supabase
            .from('visitor_counts')
            .update({ count: newCount, last_updated: new Date().toISOString() })
            .eq('id', currentData?.id)

          localStorage.setItem('has_visited', 'true')
        }

        setVisitorCount(newCount)
        setIsLoading(false)
      } catch (error) {
        console.error('Error in visitor counter:', error)
        toast({
          title: "Error",
          description: "Failed to update visitor count",
          variant: "destructive",
        })
        setIsLoading(false)
      }
    }

    checkAndIncrementVisitorCount()

    // Set up real-time subscription
    const subscription = supabase
      .channel('visitor_counts')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'visitor_counts' }, (payload) => {
        setVisitorCount(payload.new.count)
      })
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return (
    <AnimatePresence>
      {!isLoading && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-center space-x-2 text-sm text-zinc-100 p-1 rounded-xl bg-gradient-to-r from-green-400 to-transparent shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 px-2"
        >
          <span className='text-white'>Unique Visitors:</span>
          <motion.div
            key={visitorCount}
            initial={{ rotateX: -90 }}
            animate={{ rotateX: 0 }}
            exit={{ rotateX: 90 }}
            transition={{ duration: 0.5 }}
            className="font-mono px-3 py-1 bg-white bg-opacity-20 rounded-full overflow-hidden"
          >
            <AnimatePresence mode="popLayout">
              {visitorCount.toString().split('').map((digit, index) => (
                <motion.span
                  key={`${index}-${digit}`}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="inline-block"
                >
                  {digit}
                </motion.span>
              ))}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

