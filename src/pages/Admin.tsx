import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Loader2, UserX } from "lucide-react";

interface UserAnalytics {
  user_id: string;
  email: string;
  total_time: number;
}

const AdminPage = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [totalUsers, setTotalUsers] = useState(0);
  const [userAnalytics, setUserAnalytics] = useState<UserAnalytics[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkAdminStatus();
    fetchData();
  }, []);

  const checkAdminStatus = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/auth");
      return;
    }

    const { data, error } = await supabase
      .from("admin_users")
      .select("email")
      .eq("email", session.user.email)
      .single();

    if (error || !data) {
      navigate("/");
      toast({
        title: "Access Denied",
        description: "You don't have permission to access this page.",
        variant: "destructive",
      });
      return;
    }

    setIsAdmin(true);
    setLoading(false);
  };

  const fetchData = async () => {
    try {
      // Fetch total users count
      const { count: userCount } = await supabase
        .from("auth.users")
        .select("*", { count: "exact" });

      setTotalUsers(userCount || 0);

      // Fetch user analytics
      const { data: analytics, error: analyticsError } = await supabase
        .from("user_analytics")
        .select(`
          user_id,
          auth.users!user_analytics_user_id_fkey(email),
          session_start,
          session_end
        `);

      if (analyticsError) throw analyticsError;

      // Process analytics data
      const processedData = analytics.reduce((acc: UserAnalytics[], session) => {
        const email = session.auth?.users?.email || "Unknown";
        const timeSpent = session.session_end 
          ? new Date(session.session_end).getTime() - new Date(session.session_start).getTime()
          : 0;

        const existingUser = acc.find(u => u.user_id === session.user_id);
        if (existingUser) {
          existingUser.total_time += timeSpent;
        } else {
          acc.push({
            user_id: session.user_id,
            email,
            total_time: timeSpent,
          });
        }
        return acc;
      }, []);

      setUserAnalytics(processedData);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast({
        title: "Error",
        description: "Failed to fetch analytics data",
        variant: "destructive",
      });
    }
  };

  const removeUser = async (userId: string) => {
    try {
      const { error } = await supabase.auth.admin.deleteUser(userId);
      if (error) throw error;

      toast({
        title: "Success",
        description: "User has been removed successfully",
      });
      
      fetchData(); // Refresh data
    } catch (error) {
      console.error("Error removing user:", error);
      toast({
        title: "Error",
        description: "Failed to remove user",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{totalUsers}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Active Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">
              {userAnalytics.filter(u => u.total_time > 0).length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>User Time Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={userAnalytics}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="email" 
                  angle={-45} 
                  textAnchor="end" 
                  height={100}
                />
                <YAxis 
                  label={{ 
                    value: 'Time Spent (minutes)', 
                    angle: -90, 
                    position: 'insideLeft' 
                  }}
                />
                <Tooltip />
                <Bar 
                  dataKey="total_time" 
                  fill="#8884d8"
                  name="Time Spent"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {userAnalytics.map((user) => (
              <div 
                key={user.user_id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div>
                  <p className="font-medium">{user.email}</p>
                  <p className="text-sm text-gray-500">
                    Time spent: {Math.round(user.total_time / 60000)} minutes
                  </p>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => removeUser(user.user_id)}
                >
                  <UserX className="h-4 w-4 mr-2" />
                  Remove User
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminPage;