
"use client";

import { useEffect, useState } from "react";
import { useUsersContext } from "../../context/users";

function ActivityLogs({ userId }: { userId: string }) {
  const { fetchActivityLogs } = useUsersContext();
  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
    fetchActivityLogs(userId).then(setLogs).catch(console.error);
  }, [userId]);

  return (
    <div>
      <h2 className="text-lg font-bold">Activity Logs</h2>
      <ul>
        {logs.map((log, index) => (
          <li key={index}>{log.message}</li>
        ))}
      </ul>
    </div>
  );
}

export default ActivityLogs;