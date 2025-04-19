"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Progress } from "../ui/progress";
import {
  Bell,
  CheckCircle,
  Clock,
  CpuIcon,
  Database,
  HardDrive,
  Info,
  Moon,
  Server,
  Settings,
  Shield,
  Sun,
  Users,
  XCircle,
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "../../components/ui/tabs";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { cn } from "../../lib/utils";
import { useTheme } from "next-themes";

export default function Dashboard() {
  const { theme, setTheme } = useTheme();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [chartView, setChartView] = useState("daily");

  // Mock data for metrics
  const metrics = {
    totalUsers: 1248,
    activeSessions: 87,
    resources: {
      cpu: 42,
      memory: 68,
      disk: 23,
    },
  };

  // Mock data for notifications
  const notifications = [
    {
      id: 1,
      type: "success",
      message: "Deployment completed successfully",
      timestamp: "2 minutes ago",
    },
    {
      id: 2,
      type: "error",
      message: "Failed to authenticate user john.doe",
      timestamp: "15 minutes ago",
    },
    {
      id: 3,
      type: "info",
      message: "System update scheduled for tomorrow",
      timestamp: "1 hour ago",
    },
    {
      id: 4,
      type: "warning",
      message: "High memory usage detected",
      timestamp: "3 hours ago",
    },
    {
      id: 5,
      type: "success",
      message: "New client registered: Mobile App",
      timestamp: "5 hours ago",
    },
  ];

  // Mock data for charts
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

  // Function to get notification icon based on type
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

  // Colors for charts
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  // Get active user activity data based on selected view
  const getActiveUserData = () => {
    switch (chartView) {
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

  return (
    <div className="flex min-h-screen flex-col md:flex-row bg-background">
      {/* Sidebar Navigation */}
      {/* <aside className="w-full md:w-64 bg-card border-r border-border">
        <div className="p-4 flex items-center justify-between md:justify-start gap-2 border-b border-border">
          <Shield className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-bold">Keycloak Admin</h1>
        </div>
        <nav className="p-2">
          <ul className="space-y-1">
            <li>
              <button
                onClick={() => setActiveTab("dashboard")}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
                  activeTab === "dashboard"
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-accent"
                )}
              >
                <Server className="h-5 w-5" />
                <span>Dashboard</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab("users")}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
                  activeTab === "users"
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-accent"
                )}
              >
                <Users className="h-5 w-5" />
                <span>Users</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab("clients")}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
                  activeTab === "clients"
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-accent"
                )}
              >
                <Database className="h-5 w-5" />
                <span>Clients</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab("settings")}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
                  activeTab === "settings"
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-accent"
                )}
              >
                <Settings className="h-5 w-5" />
                <span>Settings</span>
              </button>
            </li>
          </ul>
        </nav>
      </aside> */}

      {/* Main Content */}
      {/* Main Content */}
      <main className="flex-1 p-4 md:p-6 overflow-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Dashboard Overview</h1>
          <button
            className="hidden md:flex items-center gap-2 p-2 rounded-md hover:bg-accent"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? (
              <>
                <Sun className="h-5 w-5" />
                <span>Light Mode</span>
              </>
            ) : (
              <>
                <Moon className="h-5 w-5" />
                <span>Dark Mode</span>
              </>
            )}
          </button>
        </div>

        {/* Key Metrics Section */}
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Key Metrics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Users
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <Users className="h-8 w-8 text-primary mr-3" />
                  <div className="text-2xl font-bold">{metrics.totalUsers}</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Active Sessions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <Clock className="h-8 w-8 text-primary mr-3" />
                  <div className="text-2xl font-bold">
                    {metrics.activeSessions}
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="md:col-span-2 lg:col-span-1">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Resource Usage
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <CpuIcon className="h-4 w-4 text-primary mr-2" />
                      <span className="text-sm">CPU</span>
                    </div>
                    <span className="text-sm font-medium">
                      {metrics.resources.cpu}%
                    </span>
                  </div>
                  <Progress value={metrics.resources.cpu} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Database className="h-4 w-4 text-primary mr-2" />
                      <span className="text-sm">Memory</span>
                    </div>
                    <span className="text-sm font-medium">
                      {metrics.resources.memory}%
                    </span>
                  </div>
                  <Progress value={metrics.resources.memory} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <HardDrive className="h-4 w-4 text-primary mr-2" />
                      <span className="text-sm">Disk</span>
                    </div>
                    <span className="text-sm font-medium">
                      {metrics.resources.disk}%
                    </span>
                  </div>
                  <Progress value={metrics.resources.disk} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Charts Section */}
        <section className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Analytics</h2>
            <Tabs
              value={chartView}
              onValueChange={setChartView}
              className="w-auto"
            >
              <TabsList>
                <TabsTrigger value="daily">Daily</TabsTrigger>
                <TabsTrigger value="weekly">Weekly</TabsTrigger>
                <TabsTrigger value="monthly">Monthly</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
            {/* User Activity Chart */}
            <Card>
              <CardHeader>
                <CardTitle>User Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={getActiveUserData()}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke={theme === "dark" ? "#374151" : "#e5e7eb"}
                      />
                      <XAxis
                        dataKey="name"
                        stroke={theme === "dark" ? "#9ca3af" : "#6b7280"}
                      />
                      <YAxis
                        stroke={theme === "dark" ? "#9ca3af" : "#6b7280"}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor:
                            theme === "dark" ? "#1f2937" : "#ffffff",
                          borderColor: theme === "dark" ? "#374151" : "#e5e7eb",
                          color: theme === "dark" ? "#f9fafb" : "#111827",
                        }}
                      />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="users"
                        name="Users"
                        stroke="#0088FE"
                        activeDot={{ r: 8 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="sessions"
                        name="Sessions"
                        stroke="#00C49F"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Client Usage Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Client Usage</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={clientUsageData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke={theme === "dark" ? "#374151" : "#e5e7eb"}
                      />
                      <XAxis
                        dataKey="name"
                        stroke={theme === "dark" ? "#9ca3af" : "#6b7280"}
                      />
                      <YAxis
                        stroke={theme === "dark" ? "#9ca3af" : "#6b7280"}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor:
                            theme === "dark" ? "#1f2937" : "#ffffff",
                          borderColor: theme === "dark" ? "#374151" : "#e5e7eb",
                          color: theme === "dark" ? "#f9fafb" : "#111827",
                        }}
                      />
                      <Legend />
                      <Bar dataKey="usage" name="Usage %" fill="#0088FE" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Resource Allocation Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Resource Allocation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80 flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={resourceAllocationData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) =>
                          `${name} ${(percent * 100).toFixed(0)}%`
                        }
                      >
                        {resourceAllocationData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor:
                            theme === "dark" ? "#1f2937" : "#ffffff",
                          borderColor: theme === "dark" ? "#374151" : "#e5e7eb",
                          color: theme === "dark" ? "#f9fafb" : "#111827",
                        }}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Session Trends Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Session Trends (24h)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={sessionTrendsData}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke={theme === "dark" ? "#374151" : "#e5e7eb"}
                      />
                      <XAxis
                        dataKey="name"
                        stroke={theme === "dark" ? "#9ca3af" : "#6b7280"}
                      />
                      <YAxis
                        stroke={theme === "dark" ? "#9ca3af" : "#6b7280"}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor:
                            theme === "dark" ? "#1f2937" : "#ffffff",
                          borderColor: theme === "dark" ? "#374151" : "#e5e7eb",
                          color: theme === "dark" ? "#f9fafb" : "#111827",
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="sessions"
                        stroke="#8884d8"
                        fill="#8884d8"
                        fillOpacity={0.3}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Notifications Section */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Recent Notifications</h2>
          <Card>
            <CardContent className="p-0">
              <ul className="divide-y divide-border">
                {notifications.map((notification) => (
                  <li
                    key={notification.id}
                    className="p-4 flex items-start gap-3"
                  >
                    {getNotificationIcon(notification.type)}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm">{notification.message}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                        <Clock className="h-3 w-3" />
                        {notification.timestamp}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
}
