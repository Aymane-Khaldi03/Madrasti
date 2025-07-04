import React, { useEffect, useState } from "react";

interface Event {
  id?: number | string;
  title: string;
  date: string;
  time: string;
}

const PROFESSOR_ID = 1; // À remplacer par l'ID dynamique du professeur connecté

const ProfessorCalendar: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/professor/calendar?professorId=${PROFESSOR_ID}`)
      .then((res) => res.json())
      .then((data) => setEvents(data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-extrabold tracking-tight mb-6">Calendar</h1>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        {loading ? (
          <div className="p-4 text-center">Loading...</div>
        ) : events.length === 0 ? (
          <div className="p-4 text-center">No events found.</div>
        ) : (
          <ul className="space-y-3">
            {events.map((e, i) => (
              <li
                key={i}
                className="flex items-center gap-4 border-b last:border-b-0 pb-3"
              >
                <span className="inline-block w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">
                  4C5
                </span>
                <div className="flex-1">
                  <div className="font-semibold">{e.title}</div>
                  <div className="text-sm text-gray-600">{e.date}</div>
                </div>
                <div className="text-right text-gray-700 font-mono">
                  {e.time}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ProfessorCalendar;
