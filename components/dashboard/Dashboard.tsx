
"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../ui/card";
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
import { cn } from "../../lib/utils";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");

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

  return (
    <div className="flex min-h-screen flex-col md:flex-row bg-background">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-card border-r border-border">
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
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-6 overflow-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Dashboard Overview</h1>
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