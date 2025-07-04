import React, { useEffect, useState } from "react";

type Event = {
  title: string;
  date: string;
  time: string;
};

const Calendar = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/student/calendar")
      .then((res) => res.json())
      .then((data) => setEvents(data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Calendrier</h1>
      {loading ? (
        <p>Chargement...</p>
      ) : (
        <ul className="space-y-3">
          {events.map((e, i) => (
            <li key={i} className="bg-white rounded shadow p-3 flex justify-between">
              <div>
                <div className="font-semibold">{e.title}</div>
                <div className="text-sm text-gray-600">{e.date}</div>
              </div>
              <div className="text-right text-gray-700">{e.time}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Calendar;