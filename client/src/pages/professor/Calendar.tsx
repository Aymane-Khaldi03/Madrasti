import React, { useEffect, useState } from "react";
import { useAuth } from '@/contexts/AuthContext';
import CalendarLib from "react-calendar";
import 'react-calendar/dist/Calendar.css';
import { CalendarDays, Clock, BookOpen, AlertCircle, PlusCircle, XCircle, Filter } from "lucide-react";

interface Event {
  id?: number | string;
  title: string;
  date: string; // format YYYY-MM-DD
  time: string;
  type?: string; // ex: 'correction', 'meeting', 'exam', 'event'
  description?: string;
}

const EVENT_COLORS: Record<string, string> = {
  correction: 'bg-blue-100 text-blue-700',
  meeting: 'bg-green-100 text-green-700',
  exam: 'bg-orange-100 text-orange-700',
  event: 'bg-purple-100 text-purple-700',
  default: 'bg-gray-100 text-gray-700',
};

function formatDate(date: Date) {
  return date.toISOString().split('T')[0];
}

const ProfessorCalendar: React.FC = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [modalEvent, setModalEvent] = useState<Event | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState({ title: '', date: formatDate(new Date()), time: '', type: 'correction', description: '' });
  const [addError, setAddError] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'month' | 'week'>('month');
  const [addLoading, setAddLoading] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [editEvent, setEditEvent] = useState<Event | null>(null);
  const [editForm, setEditForm] = useState(addForm);
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    if (!user?.id) return;
    fetch(`/api/professor/calendar?professorId=${user.id}`)
      .then((res) => res.json())
      .then((data) => setEvents(data))
      .finally(() => setLoading(false));
  }, [user?.id]);

  // Toast auto-hide
  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(t);
    }
  }, [toast]);

  const filteredEvents = filterType === 'all' ? events : events.filter(e => e.type === filterType);
  const eventsByDate = filteredEvents.reduce((acc, ev) => {
    (acc[ev.date] = acc[ev.date] || []).push(ev);
    return acc;
  }, {} as Record<string, Event[]>);
  const selectedDayEvents = eventsByDate[formatDate(selectedDate)] || [];

  // Semaine courante (lundi-dimanche)
  function getWeekDates(date: Date) {
    const d = new Date(date);
    const day = d.getDay() || 7;
    d.setHours(0,0,0,0);
    d.setDate(d.getDate() - day + 1);
    return Array.from({length: 7}, (_, i) => {
      const dt = new Date(d);
      dt.setDate(d.getDate() + i);
      return formatDate(dt);
    });
  }
  const weekDates = getWeekDates(selectedDate);
  const weekEvents = weekDates.flatMap(d => eventsByDate[d] || []);

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <div className="flex items-center gap-3 mb-8">
        <CalendarDays className="w-10 h-10 text-blue-400 dark:text-blue-200" aria-label="Icône calendrier" />
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">Calendrier professeur</h1>
        <button
          className="ml-auto flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 font-semibold shadow hover:bg-blue-200 dark:hover:bg-blue-800 transition focus:outline-none focus:ring-2 focus:ring-blue-400"
          aria-label="Ajouter un événement"
          onClick={() => setShowAddModal(true)}
        >
          <PlusCircle className="w-5 h-5" />
          <span>Ajouter un événement</span>
        </button>
      </div>
      {/* Filtres et vue */}
      <div className="flex flex-wrap gap-2 mb-6 items-center">
        <Filter className="w-5 h-5 text-blue-400" />
        <button onClick={() => setFilterType('all')} className={`px-3 py-1 rounded-full font-semibold text-xs ${filterType==='all' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-200'} transition`}>Tous</button>
        <button onClick={() => setFilterType('correction')} className={`px-3 py-1 rounded-full font-semibold text-xs ${filterType==='correction' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-blue-700 dark:bg-gray-800 dark:text-blue-300'} transition`}>Corrections</button>
        <button onClick={() => setFilterType('meeting')} className={`px-3 py-1 rounded-full font-semibold text-xs ${filterType==='meeting' ? 'bg-green-500 text-white' : 'bg-gray-100 text-green-700 dark:bg-gray-800 dark:text-green-300'} transition`}>Réunions</button>
        <button onClick={() => setFilterType('exam')} className={`px-3 py-1 rounded-full font-semibold text-xs ${filterType==='exam' ? 'bg-orange-500 text-white' : 'bg-gray-100 text-orange-700 dark:bg-gray-800 dark:text-orange-300'} transition`}>Examens</button>
        <button onClick={() => setFilterType('event')} className={`px-3 py-1 rounded-full font-semibold text-xs ${filterType==='event' ? 'bg-purple-500 text-white' : 'bg-gray-100 text-purple-700 dark:bg-gray-800 dark:text-purple-300'} transition`}>Autres</button>
        <span className="ml-4 font-semibold text-xs text-gray-500">Vue :</span>
        <button onClick={() => setViewMode('month')} className={`px-3 py-1 rounded-full font-semibold text-xs ${viewMode==='month' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-blue-700 dark:bg-gray-800 dark:text-blue-300'} transition`}>Mois</button>
        <button onClick={() => setViewMode('week')} className={`px-3 py-1 rounded-full font-semibold text-xs ${viewMode==='week' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-blue-700 dark:bg-gray-800 dark:text-blue-300'} transition`}>Semaine</button>
      </div>
      {/* Affichage calendrier/mois ou semaine */}
      {viewMode === 'month' ? (
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
      ) : (
        <div className="bg-white/80 dark:bg-gray-900/80 rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-200 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-blue-400" />
            Agenda de la semaine
          </h2>
          {weekEvents.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10">
              <AlertCircle className="w-12 h-12 text-blue-200 mb-2" />
              <p className="text-lg text-gray-500">Aucun événement cette semaine.</p>
            </div>
          ) : (
            <ul className="space-y-4">
              {weekDates.map((d, idx) => (
                <li key={d}>
                  <div className="font-semibold text-blue-700 dark:text-blue-300 mb-1">
                    {new Date(d).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
                  </div>
                  <ul className="space-y-2">
                    {(eventsByDate[d] || []).map((e, i) => (
                      <li
                        key={i}
                        className={`flex items-center gap-4 p-3 rounded-xl shadow bg-white/95 dark:bg-gray-900/90 border-l-4 ${EVENT_COLORS[e.type || 'default']} animate-fadeIn cursor-pointer hover:bg-blue-50`}
                        tabIndex={0}
                        aria-label={`Événement : ${e.title}`}
                        onClick={() => setModalEvent(e)}
                        onKeyDown={evt => { if (evt.key === 'Enter' || evt.key === ' ') setModalEvent(e); }}
                        title={e.title}
                      >
                        <Clock className="w-5 h-5 text-blue-400" aria-label="Heure" />
                        <div className="flex-1">
                          <div className="font-semibold text-gray-900 dark:text-white">{e.title}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">{e.time}</div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${EVENT_COLORS[e.type || 'default']}`}>{e.type || 'Événement'}</span>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
      {/* Modal d'ajout d'événement */}
      {(showAddModal || editEvent) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" role="dialog" aria-modal="true">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8 max-w-md w-full relative animate-fadeIn">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-red-500 focus:outline-none"
              onClick={() => { setShowAddModal(false); setEditEvent(null); }}
              aria-label="Fermer le formulaire"
            >
              <XCircle className="w-7 h-7" />
            </button>
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <PlusCircle className="w-6 h-6 text-blue-400" /> {editEvent ? 'Modifier' : 'Ajouter'} un événement
            </h3>
            <form
              className="flex flex-col gap-4"
              onSubmit={async e => {
                e.preventDefault();
                setAddError('');
                setEditError('');
                if (!(editEvent ? editForm.title : addForm.title).trim() || !(editEvent ? editForm.date : addForm.date) || !(editEvent ? editForm.time : addForm.time)) {
                  editEvent ? setEditError('Titre, date et heure requis.') : setAddError('Titre, date et heure requis.');
                  return;
                }
                if (editEvent) {
                  setEditLoading(true);
                  try {
                    const res = await fetch(`/api/professor/calendar/${editEvent.id}`, {
                      method: 'PUT',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify(editForm)
                    });
                    if (!res.ok) throw new Error('Erreur API');
                    setToast({ type: 'success', message: 'Événement modifié !' });
                    setEditEvent(null);
                    setEditForm(addForm);
                    // Refresh
                    setLoading(true);
                    fetch(`/api/professor/calendar?professorId=${user?.id}`)
                      .then((res) => res.json())
                      .then((data) => setEvents(data))
                      .finally(() => setLoading(false));
                  } catch {
                    setEditError('Erreur lors de la modification.');
                    setToast({ type: 'error', message: 'Erreur lors de la modification.' });
                  } finally {
                    setEditLoading(false);
                  }
                } else {
                  setAddLoading(true);
                  try {
                    const res = await fetch(`/api/professor/calendar`, {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify(addForm)
                    });
                    if (!res.ok) throw new Error('Erreur API');
                    setToast({ type: 'success', message: 'Événement ajouté !' });
                    setShowAddModal(false);
                    setAddForm({ title: '', date: formatDate(new Date()), time: '', type: 'correction', description: '' });
                    // Refresh
                    setLoading(true);
                    fetch(`/api/professor/calendar?professorId=${user?.id}`)
                      .then((res) => res.json())
                      .then((data) => setEvents(data))
                      .finally(() => setLoading(false));
                  } catch {
                    setAddError('Erreur lors de l\'ajout.');
                    setToast({ type: 'error', message: 'Erreur lors de l\'ajout.' });
                  } finally {
                    setAddLoading(false);
                  }
                }
              }}
            >
              <input
                type="text"
                className="input input-bordered rounded-lg px-4 py-2"
                placeholder="Titre"
                value={editEvent ? editForm.title : addForm.title}
                onChange={e => editEvent ? setEditForm(f => ({ ...f, title: e.target.value })) : setAddForm(f => ({ ...f, title: e.target.value }))}
                required
              />
              <input
                type="date"
                className="input input-bordered rounded-lg px-4 py-2"
                value={editEvent ? editForm.date : addForm.date}
                onChange={e => editEvent ? setEditForm(f => ({ ...f, date: e.target.value })) : setAddForm(f => ({ ...f, date: e.target.value }))}
                required
              />
              <input
                type="time"
                className="input input-bordered rounded-lg px-4 py-2"
                value={editEvent ? editForm.time : addForm.time}
                onChange={e => editEvent ? setEditForm(f => ({ ...f, time: e.target.value })) : setAddForm(f => ({ ...f, time: e.target.value }))}
                required
              />
              <select
                className="select select-bordered rounded-lg px-4 py-2"
                value={editEvent ? editForm.type : addForm.type}
                onChange={e => editEvent ? setEditForm(f => ({ ...f, type: e.target.value })) : setAddForm(f => ({ ...f, type: e.target.value }))}
              >
                <option value="correction">Correction</option>
                <option value="meeting">Réunion</option>
                <option value="exam">Examen</option>
                <option value="event">Autre</option>
              </select>
              <textarea
                className="textarea textarea-bordered rounded-lg px-4 py-2"
                placeholder="Description (optionnel)"
                value={editEvent ? editForm.description : addForm.description}
                onChange={e => editEvent ? setEditForm(f => ({ ...f, description: e.target.value })) : setAddForm(f => ({ ...f, description: e.target.value }))}
              />
              {(addError || editError) && <div className="text-red-500 text-sm">{addError || editError}</div>}
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 font-semibold shadow hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                  onClick={() => { setShowAddModal(false); setEditEvent(null); }}
                  disabled={addLoading || editLoading}
                >Annuler</button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 font-semibold shadow hover:bg-blue-200 dark:hover:bg-blue-800 transition"
                  disabled={addLoading || editLoading}
                >{editEvent ? (editLoading ? 'Modification...' : 'Modifier') : (addLoading ? 'Ajout...' : 'Ajouter')}</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Toast */}
      {toast && (
        <div className={`fixed top-6 right-6 z-50 px-4 py-2 rounded-xl shadow-lg text-white font-semibold ${toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>{toast.message}</div>
      )}
      {/* Modal de détail événement */}
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
            {modalEvent.description && (
              <div className="mb-2 text-gray-700 dark:text-gray-200 text-sm">{modalEvent.description}</div>
            )}
            <div className="mt-6 flex justify-between gap-2">
              <button
                className="px-4 py-2 rounded-lg bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 font-semibold shadow hover:bg-red-200 dark:hover:bg-red-800 transition"
                onClick={async () => {
                  if (!modalEvent?.id) return;
                  setDeleteLoading(true);
                  try {
                    const res = await fetch(`/api/professor/calendar/${modalEvent.id}`, { method: 'DELETE' });
                    if (!res.ok) throw new Error('Erreur API');
                    setToast({ type: 'success', message: 'Événement supprimé !' });
                    setModalEvent(null);
                    // Refresh
                    setLoading(true);
                    fetch(`/api/professor/calendar?professorId=${user?.id}`)
                      .then((res) => res.json())
                      .then((data) => setEvents(data))
                      .finally(() => setLoading(false));
                  } catch {
                    setToast({ type: 'error', message: 'Erreur lors de la suppression.' });
                  } finally {
                    setDeleteLoading(false);
                  }
                }}
                disabled={deleteLoading}
              >{deleteLoading ? 'Suppression...' : 'Supprimer'}</button>
              <button
                className="px-4 py-2 rounded-lg bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 font-semibold shadow hover:bg-blue-200 dark:hover:bg-blue-800 transition"
                onClick={() => {
                  setEditEvent(modalEvent);
                  setEditForm({
                    title: modalEvent.title,
                    date: modalEvent.date,
                    time: modalEvent.time,
                    type: modalEvent.type || 'correction',
                    description: modalEvent.description || ''
                  });
                  setModalEvent(null);
                }}
              >Modifier</button>
              <button
                className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 font-semibold shadow hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                onClick={() => setModalEvent(null)}
              >Fermer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfessorCalendar;
