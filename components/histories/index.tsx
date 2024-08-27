"use client";

import { useState } from "react";
import { format } from "date-fns";
import { ChevronRight, AlertCircle } from "lucide-react";
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
  };
}

interface Batch {
  id: string;
  batchName: string;
  histories: History[];
  timestamp: Date;
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
      },
      {
        id: "h2",
        user: { id: "u2", username: "jane_smith" },
        error: { code: "ERR002", message: "Invalid input" },
      },
    ],
    timestamp: new Date("2023-06-15T10:30:00"),
  },
  {
    id: "2",
    batchName: "Weekly Report",
    histories: [
      {
        id: "h3",
        user: { id: "u3", username: "bob_johnson" },
        error: { code: "ERR003", message: "Database connection failed" },
      },
    ],
    timestamp: new Date("2023-06-14T15:45:00"),
  },
];

export default function Histories() {
  const { batches } = useHistoryContext();

  return (
    <div className="container mx-auto p-4">
      <Accordion type="single" collapsible className="w-full">
        {batches?.map((batch) => (
          <AccordionItem value={batch.id} key={batch.id}>
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center">
                  <ChevronRight className="h-4 w-4 mr-2 transition-transform duration-200" />
                  <span className="font-semibold">{batch.batchName}</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {format(batch.timestamp, "PPpp")}
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <ScrollArea className="h-[300px] w-full rounded-md border p-4">
                {batch.histories?.map((history) => (
                  <Card key={history.id} className="mb-4">
                    <CardHeader>
                      <CardTitle className="text-sm font-medium">
                        User: {history.user.username}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {history.error && (
                        <div className="flex items-start space-x-2">
                          <AlertCircle className="h-5 w-5 text-destructive mt-0.5" />
                          <div>
                            <p className="font-semibold">
                              Error Code: {history.error.code}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {history.error.message}
                            </p>
                          </div>
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
