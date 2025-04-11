"use client";

import { useState } from "react";
import { format } from "date-fns";
import {
  ChevronRight,
  AlertCircle,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { ScrollArea } from "../ui/scroll-area";
import { useHistoryContext } from "../../context/history";

interface User {
  id: string;
  username: string;
}

interface History {
  id: string;
  user: User;
  error?: {
    code: string;
    message: string;
    stackTrace?: string;
  };
  status: string;
  operation: string;
  timestamp: Date;
  metadata?: {
    browser?: string;
    os?: string;
    ipAddress?: string;
    requestId?: string;
  };
}

interface Batch {
  id: string;
  batchName: string;
  histories: History[];
  timestamp: Date;
  successCount: number;
  failureCount: number;
  metadata?: {
    initiatedBy?: string;
  };
}

// Mock data for demonstration
const mockBatches: Batch[] = [
  {
    id: "1",
    batchName: "Daily Update",
    histories: [
      {
        id: "h1",
        user: { id: "u1", username: "john_doe" },
        error: { code: "ERR001", message: "Failed to process data" },
        status: "failure",
        operation: "Data Processing",
        timestamp: new Date("2023-06-15T10:30:00"),
        metadata: {
          browser: "Chrome",
          os: "Windows",
          ipAddress: "192.168.1.1",
          requestId: "req123",
        },
      },
      {
        id: "h2",
        user: { id: "u2", username: "jane_smith" },
        error: { code: "ERR002", message: "Invalid input" },
        status: "failure",
        operation: "Data Validation",
        timestamp: new Date("2023-06-15T10:35:00"),
        metadata: {
          browser: "Firefox",
          os: "Linux",
          ipAddress: "192.168.1.2",
          requestId: "req124",
        },
      },
    ],
    timestamp: new Date("2023-06-15T10:30:00"),
    successCount: 0,
    failureCount: 2,
    metadata: {
      initiatedBy: "admin",
    },
  },
  {
    id: "2",
    batchName: "Weekly Report",
    histories: [
      {
        id: "h3",
        user: { id: "u3", username: "bob_johnson" },
        error: { code: "ERR003", message: "Database connection failed" },
        status: "failure",
        operation: "Database Connection",
        timestamp: new Date("2023-06-14T15:45:00"),
        metadata: {
          browser: "Safari",
          os: "macOS",
          ipAddress: "192.168.1.3",
          requestId: "req125",
        },
      },
    ],
    timestamp: new Date("2023-06-14T15:45:00"),
    successCount: 0,
    failureCount: 1,
    metadata: {
      initiatedBy: "system",
    },
  },
];

export default function Histories() {
  const { batches } = useHistoryContext();

  const formatDate = (date: string | number | Date) => {
    try {
      if (!date) return "N/A";
      // Convert string dates to Date objects
      const dateObj = typeof date === "string" ? new Date(date) : date;
      return format(dateObj, "PPpp");
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Invalid date";
    }
  };

  const formatTime = (date: string | number | Date) => {
    try {
      if (!date) return "N/A";
      const dateObj = typeof date === "string" ? new Date(date) : date;
      return format(dateObj, "HH:mm:ss");
    } catch (error) {
      console.error("Error formatting time:", error);
      return "Invalid time";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case "failure":
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-[90vw] container mx-auto p-4">
      <Accordion type="single" collapsible className="w-full">
        {batches?.map((batch) => (
          <AccordionItem value={batch.id as string} key={batch.id}>
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-4">
                  <ChevronRight className="h-4 w-4 transition-transform duration-200" />
                  <span className="font-semibold">{batch.batchName}</span>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-green-500">
                      {batch.successCount} successful
                    </span>
                    <span className="text-red-500">
                      {batch.failureCount} failed
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-muted-foreground">
                    Initiated by: {batch.metadata?.initiatedBy || "Unknown"}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {formatDate(batch.timestamp)}
                  </span>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <ScrollArea className="h-[500px] w-full rounded-md border p-4">
                {batch.histories?.map((history) => (
                  <Card key={history.id} className="mb-4">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(history.status)}
                          <CardTitle className="text-sm font-medium">
                            {history.username} - {history.operation}
                          </CardTitle>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {formatTime(history.timestamp)}
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {history.error && (
                        <div className="space-y-4">
                          <div className="flex items-start space-x-2">
                            <div className="space-y-1">
                              <p className="font-semibold">
                                Error Code: {history.error.code}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {history.error.message}
                              </p>
                            </div>
                          </div>
                          {history.error.stackTrace && (
                            <details className="text-sm">
                              <summary className="cursor-pointer text-muted-foreground">
                                Stack Trace
                              </summary>
                              <pre className="mt-2 whitespace-pre-wrap text-xs bg-slate-100 p-2 rounded dark:bg-slate-800">
                                {history.error.stackTrace}
                              </pre>
                            </details>
                          )}
                          {history.metadata && (
                            <div className="text-sm grid grid-cols-2 gap-2 bg-slate-50 p-2 rounded dark:bg-slate-900">
                              <div>Browser: {history.metadata.browser}</div>
                              <div>OS: {history.metadata.os}</div>
                              <div>IP: {history.metadata.ipAddress}</div>
                              <div>
                                Request ID: {history.metadata.requestId}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </ScrollArea>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
