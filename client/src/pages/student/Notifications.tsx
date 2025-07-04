import React, { useEffect, useState } from "react";

interface Notification {
  id?: number | string;
  title: string;
  message: string;
  date: string;
  read?: boolean;
}

const STUDENT_ID = 1; // À remplacer par l'ID dynamique de l'étudiant connecté

const Notifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/student/notifications?studentId=${STUDENT_ID}`)
      .then((res) => res.json())
      .then((data) => setNotifications(data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Notifications</h1>
      {loading ? (
        <p>Chargement...</p>
      ) : notifications.length === 0 ? (
        <p>Aucune notification.</p>
      ) : (
        <ul className="space-y-3">
          {notifications.map((n, i) => (
            <li
              key={i}
              className={`rounded shadow p-3 ${
                n.read ? "bg-gray-100" : "bg-blue-50"
              } flex justify-between items-center`}
            >
              <div>
                <div className="font-semibold">{n.title}</div>
                <div className="text-sm">{n.message}</div>
                <div className="text-xs text-gray-500">{n.date}</div>
              </div>
              {!n.read && (
                <span className="inline-block w-3 h-3 bg-blue-500 rounded-full" title="Non lu"></span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Notifications;