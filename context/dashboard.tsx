import React, { createContext, useContext, useEffect, useState } from "react";
import { fetchKeyMetrics, fetchNotifications, fetchResourceUsage } from "../services/dashboardService";
import { Bell, CheckCircle, Info, XCircle } from "lucide-react";

interface DashboardContextProps {
  keyMetrics: any;
  notifications: any[];
  resourceUsage: any;
  userActivityData: any[];
  weeklyUserActivityData: any[];
  monthlyUserActivityData: any[];
  clientUsageData: any[];
  resourceAllocationData: any[];
  sessionTrendsData: any[];
  COLORS: string[];
  getActiveUserData: (view: string) => any[];
  getNotificationIcon: (type: string) => JSX.Element;
}

const DashboardContext = createContext<DashboardContextProps | undefined>(undefined);

export const DashboardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [keyMetrics, setKeyMetrics] = useState<any>({
    totalUsers: 1248,
    activeSessions: 87,
    resources: { cpu: 42, memory: 68, disk: 23 },
  });

  const [notifications, setNotifications] = useState<any[]>([
    { id: 1, type: "success", message: "Deployment completed successfully", timestamp: "2 minutes ago" },
    { id: 2, type: "error", message: "Failed to authenticate user john.doe", timestamp: "15 minutes ago" },
    { id: 3, type: "info", message: "System update scheduled for tomorrow", timestamp: "1 hour ago" },
    { id: 4, type: "warning", message: "High memory usage detected", timestamp: "3 hours ago" },
    { id: 5, type: "success", message: "New client registered: Mobile App", timestamp: "5 hours ago" },
  ]);

  const [resourceUsage, setResourceUsage] = useState<any>(null);

  const userActivityData = [
    { name: "Mon", users: 120, sessions: 80 },
    { name: "Tue", users: 150, sessions: 100 },
    { name: "Wed", users: 180, sessions: 120 },
    { name: "Thu", users: 170, sessions: 110 },
    { name: "Fri", users: 190, sessions: 130 },
    { name: "Sat", users: 110, sessions: 70 },
    { name: "Sun", users: 100, sessions: 60 },
  ];

  const weeklyUserActivityData = [
    { name: "Week 1", users: 850, sessions: 550 },
    { name: "Week 2", users: 940, sessions: 620 },
    { name: "Week 3", users: 1020, sessions: 680 },
    { name: "Week 4", users: 1120, sessions: 750 },
  ];

  const monthlyUserActivityData = [
    { name: "Jan", users: 3200, sessions: 2100 },
    { name: "Feb", users: 3500, sessions: 2300 },
    { name: "Mar", users: 3800, sessions: 2500 },
    { name: "Apr", users: 4100, sessions: 2700 },
    { name: "May", users: 4300, sessions: 2900 },
    { name: "Jun", users: 4500, sessions: 3100 },
  ];

  const clientUsageData = [
    { name: "Web App", usage: 45 },
    { name: "Mobile App", usage: 30 },
    { name: "Desktop App", usage: 15 },
    { name: "API Service", usage: 10 },
  ];

  const resourceAllocationData = [
    { name: "Authentication", value: 40 },
    { name: "Authorization", value: 30 },
    { name: "User Management", value: 20 },
    { name: "Client Management", value: 10 },
  ];

  const sessionTrendsData = [
    { name: "00:00", sessions: 20 },
    { name: "04:00", sessions: 10 },
    { name: "08:00", sessions: 45 },
    { name: "12:00", sessions: 75 },
    { name: "16:00", sessions: 85 },
    { name: "20:00", sessions: 60 },
  ];

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  const getActiveUserData = (view: string) => {
    switch (view) {
      case "daily":
        return userActivityData;
      case "weekly":
        return weeklyUserActivityData;
      case "monthly":
        return monthlyUserActivityData;
      default:
        return userActivityData;
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "error":
        return <XCircle className="h-5 w-5 text-red-500" />;
      case "info":
        return <Info className="h-5 w-5 text-blue-500" />;
      case "warning":
        return <Info className="h-5 w-5 text-amber-500" />;
      default:
        return <Bell className="h-5 w-5" />;
    }
  };

  const refreshData = async () => {
    const [metrics, notifs, usage] = await Promise.all([
      fetchKeyMetrics(),
      fetchNotifications(),
      fetchResourceUsage(),
    ]);
    setKeyMetrics(metrics);
    setNotifications(notifs);
    setResourceUsage(usage);
  };

  useEffect(() => {
    refreshData();
    const interval = setInterval(refreshData, 5000); // Poll every 5 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <DashboardContext.Provider
      value={{
        keyMetrics,
        notifications,
        resourceUsage,
        userActivityData,
        weeklyUserActivityData,
        monthlyUserActivityData,
        clientUsageData,
        resourceAllocationData,
        sessionTrendsData,
        COLORS,
        getActiveUserData,
        getNotificationIcon,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboardContext = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error("useDashboardContext must be used within a DashboardProvider");
  }
  return context;
};