import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

export const useActiveUsers = () => {
  const [count, setCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchInitialCount = async () => {
      try {
        const { data, error } = await supabase
          .from('active_users')
          .select('count')
          .single();

        if (error) throw error;
        if (data) setCount(data.count);
      } catch (error) {
        console.error('Error fetching active users:', error);
        toast({
          title: "Error fetching active users",
          description: "Please try refreshing the page",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    // Subscribe to real-time changes
    const channel = supabase
      .channel('active_users_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'active_users'
        },
        (payload: any) => {
          console.log('Real-time update received:', payload);
          if (payload.new && typeof payload.new.count === 'number') {
            setCount(payload.new.count);
          }
        }
      )
      .subscribe();

    fetchInitialCount();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { count, isLoading };
};