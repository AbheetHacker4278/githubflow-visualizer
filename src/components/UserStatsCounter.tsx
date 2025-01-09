import React, { useEffect, useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import type { Database } from '@/integrations/supabase/types';

type VisitorCount = Database['public']['Tables']['visitor_counts']['Row'];

const UserStatsCounter = () => {
  const [totalUsers, setTotalUsers] = useState(0);
  const [verifiedUsers, setVerifiedUsers] = useState(0);

  useEffect(() => {
    const fetchUserStats = async () => {
      try {
        // Get total users count
        const { data: totalData } = await supabase
          .from('visitor_counts')
          .select('count')
          .single();

        setTotalUsers(totalData?.count || 0);

        // Get verified users count
        const { data: verifiedData } = await supabase
          .from('visitor_counts')
          .select('count')
          .eq('is_verified', true)
          .single();

        setVerifiedUsers(verifiedData?.count || 0);

        // Subscribe to realtime changes
        const channel = supabase
          .channel('user-stats')
          .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'visitor_counts' },
            (payload) => {
              console.log('Realtime update:', payload);
              const newData = payload.new as VisitorCount;
              if (newData) {
                if (newData.is_verified) {
                  setVerifiedUsers(newData.count || 0);
                } else {
                  setTotalUsers(newData.count || 0);
                }
              }
            }
          )
          .subscribe();

        return () => {
          supabase.removeChannel(channel);
        };
      } catch (error) {
        console.error('Error fetching user stats:', error);
      }
    };

    fetchUserStats();
  }, []);

  return (
    <div className="flex items-center space-x-4 text-sm">
      <div className="flex flex-col items-center">
        <span className="text-zinc-400">Total Users</span>
        <span className="font-bold text-emerald-400">{totalUsers.toLocaleString()}</span>
      </div>
      <div className="h-8 w-px bg-zinc-700" />
      <div className="flex flex-col items-center">
        <span className="text-zinc-400">Verified Users</span>
        <span className="font-bold text-emerald-400">{verifiedUsers.toLocaleString()}</span>
      </div>
    </div>
  );
};

export default UserStatsCounter;