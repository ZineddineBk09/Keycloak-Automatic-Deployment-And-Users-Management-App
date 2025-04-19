import React from "react";
import { useDashboardContext } from "../../context/dashboard";

const KeyMetrics: React.FC = () => {
  const { keyMetrics } = useDashboardContext();

  if (!keyMetrics) return <div>Loading...</div>;

  return (
    <section className="mb-6">
      <h2 className="text-xl font-semibold mb-4">Key Metrics</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="p-4 bg-white shadow rounded">
          <h3 className="text-lg font-bold">Total Users</h3>
          <p className="text-2xl">{keyMetrics.totalUsers}</p>
        </div>
        <div className="p-4 bg-white shadow rounded">
          <h3 className="text-lg font-bold">Active Sessions</h3>
          <p className="text-2xl">{keyMetrics.activeSessions}</p>
        </div>
        <div className="p-4 bg-white shadow rounded">
          <h3 className="text-lg font-bold">Resource Usage</h3>
          <p className="text-2xl">{keyMetrics.resourceUsage}%</p>
        </div>
      </div>
    </section>
  );
};

export default KeyMetrics;
