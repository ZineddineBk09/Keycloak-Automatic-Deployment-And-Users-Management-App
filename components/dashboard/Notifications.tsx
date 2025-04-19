
import React from "react";
import { useDashboardContext } from "../../context/dashboard";

const Notifications: React.FC = () => {
  const { notifications } = useDashboardContext();

  if (!notifications.length) return <div>No notifications available.</div>;

  return (
    <section className="mb-6">
      <h2 className="text-xl font-semibold mb-4">Notifications</h2>
      <ul className="space-y-4">
        {notifications.map((notif, index) => (
          <li key={index} className="p-4 bg-white shadow rounded">
            <p className="text-sm text-gray-500">{notif.timestamp}</p>
            <p className="text-lg">{notif.message}</p>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default Notifications;