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
        console.log('Fetching initial user stats...');
        
        // Get total users count
        const { data: totalData, error: totalError } = await supabase
          .from('visitor_counts')
          .select('*')
          .eq('is_verified', false)
          .single();

        if (totalError) {
          console.error('Error fetching total users:', totalError);
        } else {
          console.log('Total users data:', totalData);
          setTotalUsers(totalData?.count || 0);
        }

        // Get verified users count
        const { data: verifiedData, error: verifiedError } = await supabase
          .from('visitor_counts')
          .select('*')
          .eq('is_verified', true)
          .single();

        if (verifiedError) {
          console.error('Error fetching verified users:', verifiedError);
        } else {
          console.log('Verified users data:', verifiedData);
          setVerifiedUsers(verifiedData?.count || 0);
        }

        // Subscribe to realtime changes
        const channel = supabase
          .channel('visitor-counts')
          .on(
            'postgres_changes',
            { 
              event: '*', 
              schema: 'public', 
              table: 'visitor_counts',
              filter: 'is_verified=false'
            },
            (payload) => {
              console.log('Realtime update for total users:', payload);
              const newData = payload.new as VisitorCount;
              if (newData) {
                setTotalUsers(newData.count || 0);
              }
            }
          )
          .on(
            'postgres_changes',
            { 
              event: '*', 
              schema: 'public', 
              table: 'visitor_counts',
              filter: 'is_verified=true'
            },
            (payload) => {
              console.log('Realtime update for verified users:', payload);
              const newData = payload.new as VisitorCount;
              if (newData) {
                setVerifiedUsers(newData.count || 0);
              }
            }
          )
          .subscribe((status) => {
            console.log('Subscription status:', status);
          });

        return () => {
          console.log('Cleaning up subscription...');
          supabase.removeChannel(channel);
        };
      } catch (error) {
        console.error('Error in fetchUserStats:', error);
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