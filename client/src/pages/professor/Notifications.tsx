import React, { useEffect, useState } from "react";

type Notification = {
  title: string;
  message: string;
  date: string;
  read?: boolean;
};

const ProfessorNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/professor/notifications")
      .then((res) => res.json())
      .then((data) => setNotifications(data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-extrabold tracking-tight mb-6">
        Notifications
      </h1>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        {loading ? (
          <div className="p-4 text-center">Loading...</div>
        ) : notifications.length === 0 ? (
          <div className="p-4 text-center">No notifications.</div>
        ) : (
          <ul className="space-y-3">
            {notifications.map((n, i) => (
              <li
                key={i}
                className={`rounded p-3 flex justify-between items-center gap-4 ${
                  n.read ? "bg-gray-100" : "bg-blue-50"
                }`}
              >
                <span className="inline-block w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">
                  514
                </span>
                <div className="flex-1">
                  <div className="font-semibold">{n.title}</div>
                  <div className="text-sm">{n.message}</div>
                  <div className="text-xs text-gray-500">{n.date}</div>
                </div>
                {!n.read && (
                  <span
                    className="inline-block w-3 h-3 bg-blue-500 rounded-full"
                    title="Unread"
                  ></span>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ProfessorNotifications;
