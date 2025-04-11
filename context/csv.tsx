import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import { User } from "../interfaces";
import { Batch, HistoryEntry } from "../interfaces/history";
import { createGroup, createUser, getRecords } from "../lib/api/keycloak";
import { getClientInfo } from "../lib/utils/client-info";
import { getSystemInfo } from "../lib/utils/system-info";

export const UsersContext = createContext({});

export const useUsersContext = () =>
  useContext(UsersContext as React.Context<any>);

async function fetchClientIp(): Promise<string> {
  try {
    const response = await fetch("/api/ip");
    const data = await response.json();
    return data.ip;
  } catch (error) {
    console.error("Failed to fetch client IP:", error);
    return "unknown";
  }
}

export const UsersContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [users, setUsers] = useState<User[]>([]);
  const [fileName, setFileName] = useState<string>("");
  const [progress, setProgress] = useState<number>(0);
  const router = useRouter();

  const updateProgress = (completed: number, total: number) => {
    const percent = Math.round((completed / total) * 100);
    setProgress(percent);
  };

  const uploadToKeycloak = async () => {
    const localErrors: HistoryEntry[] = [];
    const systemInfo = getSystemInfo();
    const requestId = crypto.randomUUID();
    const startTime = new Date();
    let successCount = 0;
    let failureCount = 0;

    try {
      const ip = await fetchClientIp();
      const uniqueGroups = [
        ...new Set(users.flatMap((user) => user.groups || [])),
      ];
      const existingGroups = await getRecords("groups");
      const existingGroupNames = new Set(
        existingGroups.map((g: any) => g.name)
      );
      const groupsToCreate = uniqueGroups.filter(
        (group) => !existingGroupNames.has(group)
      );

      const totalOperations = users.length + groupsToCreate.length;
      let completedOperations = 0;

      for (const groupName of groupsToCreate) {
        try {
          await createGroup({ name: groupName });
          successCount++;
          localErrors.push({
            id: crypto.randomUUID(),
            username: `Group: ${groupName}`,
            status: "success",
            operation: "create_group",
            timestamp: new Date(),
            metadata: { ...systemInfo, ipAddress: ip, requestId },
          });
        } catch (error: any) {
          failureCount++;
          localErrors.push({
            id: crypto.randomUUID(),
            username: `Group: ${groupName}`,
            status: "failure",
            operation: "create_group",
            timestamp: new Date(),
            error: {
              code: error?.response?.status || "UNKNOWN",
              message: error?.response?.data?.errorMessage || error?.message,
              stackTrace: error.stack,
              context: error?.response?.data || {},
            },
            metadata: { ...systemInfo, ipAddress: ip, requestId },
          });
        }
        updateProgress(++completedOperations, totalOperations);
      }

      for (const user of users) {
        try {
          await createUser(user);
          successCount++;
          localErrors.push({
            id: crypto.randomUUID(),
            username: user.username,
            status: "success",
            operation: "create_user",
            timestamp: new Date(),
            metadata: { ...systemInfo, ipAddress: ip, requestId },
          });
        } catch (error: any) {
          failureCount++;
          localErrors.push({
            id: crypto.randomUUID(),
            username: user.username,
            status: "failure",
            operation: "create_user",
            timestamp: new Date(),
            error: {
              code: error?.response?.status || "UNKNOWN",
              message: error?.response?.data?.errorMessage || error?.message,
              stackTrace: error.stack,
              context: error?.response?.data || {},
            },
            metadata: { ...systemInfo, ipAddress: ip, requestId },
          });
        }
        updateProgress(++completedOperations, totalOperations);
      }

      const batch: Batch = {
        id: requestId,
        batchName: fileName,
        timestamp: startTime,
        totalOperations,
        successCount,
        failureCount,
        histories: localErrors,
        metadata: {
          initiatedBy: "CSV Upload",
          source: fileName,
          environment: process.env.NODE_ENV || "development",
          ...systemInfo,
          ipAddress: ip,
          requestId,
        },
      };

      await axios.post("/api/history", batch);

      if (failureCount > 0) {
        toast.error(`Upload completed with ${failureCount} errors`);
      } else {
        toast.success("Upload completed successfully");
      }

      setTimeout(() => {
        setUsers([]);
        router.push("/users");
      }, 3000);
    } catch (error: any) {
      console.error("Upload error:", error);
      toast.error("Unexpected error during upload");
    } finally {
      setProgress(100);
    }
  };

  const deleteUser = (username: string) => {
    setUsers((prev) => prev.filter((user) => user.username !== username));
  };

  return (
    <UsersContext.Provider
      value={{
        users,
        progress,
        fileName,
        setUsers,
        setFileName,
        uploadToKeycloak,
        deleteUser,
      }}
    >
      {children}
    </UsersContext.Provider>
  );
};
