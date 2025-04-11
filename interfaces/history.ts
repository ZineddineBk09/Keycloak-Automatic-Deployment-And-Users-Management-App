export interface ErrorDetails {
  code: string;
  message: string;
  stackTrace?: string;
  context?: Record<string, any>;
}

export interface HistoryEntry {
  id?: string;
  username: string;
  status: 'success' | 'failure' | 'warning';
  operation:string
  timestamp: Date;
  error?: ErrorDetails;
  metadata?: {
    browser?: string;
    os?: string;
    ipAddress?: string;
    requestId?: string;
    [key: string]: any;
  };
}

export interface Batch {
  id?: string;
  batchName: string;
  timestamp: Date;
  successCount: number;
  failureCount: number;
  histories: HistoryEntry[];
  totalOperations?: number;
  metadata?: {
    initiatedBy?: string;
    source?: string;
    environment?: string;
    [key: string]: any;
  };
}
