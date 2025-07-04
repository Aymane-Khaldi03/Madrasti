import React, { useEffect, useState } from "react";
import CalendarLib from "react-calendar";
import 'react-calendar/dist/Calendar.css';
import { CalendarDays, Clock, BookOpen, AlertCircle, XCircle } from "lucide-react";

interface Event {
  id?: number | string;
  title: string;
  date: string; // format YYYY-MM-DD
  time: string;
  type?: string; // ex: 'deadline', 'exam', 'event', 'course'
}

const STUDENT_ID = 1; // À remplacer par l'ID dynamique de l'étudiant connecté

const EVENT_COLORS: Record<string, string> = {
  deadline: 'bg-red-100 text-red-700',
  exam: 'bg-orange-100 text-orange-700',
  event: 'bg-blue-100 text-blue-700',
  course: 'bg-green-100 text-green-700',
  default: 'bg-gray-100 text-gray-700',
};

function formatDate(date: Date) {
  return date.toISOString().split('T')[0];
}

const Calendar = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [modalEvent, setModalEvent] = useState<Event | null>(null);

  useEffect(() => {
    fetch(`/api/student/calendar?studentId=${STUDENT_ID}`)
      .then((res) => res.json())
      .then((data) => setEvents(data))
      .finally(() => setLoading(false));
  }, []);

  // Regroupe les événements par date
  const eventsByDate = events.reduce((acc, ev) => {
    (acc[ev.date] = acc[ev.date] || []).push(ev);
    return acc;
  }, {} as Record<string, Event[]>);

  const selectedDayEvents = eventsByDate[formatDate(selectedDate)] || [];

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900">
      <div className="flex items-center gap-3 mb-8">
        <CalendarDays className="w-10 h-10 text-blue-400 dark:text-blue-200" aria-label="Icône calendrier" />
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">Calendrier</h1>
      </div>
      {loading ? (
        <div className="text-center text-lg text-gray-500">Chargement...</div>
      ) : (
        <div className="flex flex-col md:flex-row gap-10">
          <div className="max-w-md mx-auto md:mx-0">
            <CalendarLib
              value={selectedDate}
              onChange={(value) => {
                if (value instanceof Date) setSelectedDate(value);
                else if (Array.isArray(value) && value[0] instanceof Date) setSelectedDate(value[0]);
              }}
              tileContent={({ date, view }) => {
                const dayEvents = eventsByDate[formatDate(date)] || [];
                return view === 'month' && dayEvents.length > 0 ? (
                  <div className="flex flex-col items-center">
                    <span className="block mt-1 w-2 h-2 rounded-full bg-blue-500 mx-auto" aria-label="Événement ce jour" />
                    {dayEvents.length > 1 && (
                      <span className="text-[10px] font-bold text-blue-700 bg-blue-100 rounded px-1 mt-0.5" title={`${dayEvents.length} événements`}>{dayEvents.length}</span>
                    )}
                  </div>
                ) : null;
              }}
              tileClassName={({ date, view }) => {
                const dayEvents = eventsByDate[formatDate(date)] || [];
                return view === 'month' && dayEvents.length > 0 ? 'cursor-pointer hover:bg-blue-50' : '';
              }}
              // Tooltip rapide au survol d'un jour (desktop)
              tileDisabled={({ date }) => false}
              className="rounded-2xl shadow-lg border-0 bg-white dark:bg-gray-900"
              calendarType="iso8601"
              locale="fr-FR"
            />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-200 flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-blue-400" />
              Événements du {selectedDate.toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </h2>
            {selectedDayEvents.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10">
                <AlertCircle className="w-12 h-12 text-blue-200 mb-2" />
                <p className="text-lg text-gray-500">Aucun événement pour ce jour.</p>
              </div>
            ) : (
              <ul className="space-y-4">
                {selectedDayEvents.map((e, i) => (
                  <li
                    key={i}
                    className={`flex items-center gap-4 p-4 rounded-xl shadow bg-white/95 dark:bg-gray-900/90 border-l-4 ${EVENT_COLORS[e.type || 'default']} animate-fadeIn cursor-pointer hover:bg-blue-50`}
                    tabIndex={0}
                    aria-label={`Événement : ${e.title}`}
                    onClick={() => setModalEvent(e)}
                    onKeyDown={evt => { if (evt.key === 'Enter' || evt.key === ' ') setModalEvent(e); }}
                    title={e.title}
                  >
                    <Clock className="w-6 h-6 text-blue-400" aria-label="Heure" />
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900 dark:text-white">{e.title}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{e.time}</div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${EVENT_COLORS[e.type || 'default']}`}>{e.type || 'Événement'}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
      {modalEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" role="dialog" aria-modal="true">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8 max-w-md w-full relative animate-fadeIn">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-red-500 focus:outline-none"
              onClick={() => setModalEvent(null)}
              aria-label="Fermer le détail"
            >
              <XCircle className="w-7 h-7" />
            </button>
            <div className={`flex items-center gap-3 mb-4 ${EVENT_COLORS[modalEvent.type || 'default']}`}> 
              <CalendarDays className="w-8 h-8" />
              <h3 className="text-xl font-bold">{modalEvent.title}</h3>
            </div>
            <div className="mb-2 flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-400" />
              <span className="text-gray-700 dark:text-gray-200 font-semibold">{modalEvent.time}</span>
            </div>
            <div className="mb-2">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${EVENT_COLORS[modalEvent.type || 'default']}`}>{modalEvent.type || 'Événement'}</span>
            </div>
            {modalEvent.date && (
              <div className="mb-2 text-gray-500 text-sm">Date : {modalEvent.date}</div>
            )}
            {/* Ajoute ici d'autres détails si disponibles, ex: description, matière, lien, etc. */}
            <div className="mt-6 flex justify-end">
              <button
                className="px-4 py-2 rounded-lg bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 font-semibold shadow hover:bg-blue-200 dark:hover:bg-blue-800 transition"
                onClick={() => setModalEvent(null)}
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;