import React, { useEffect, useState, useRef } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import frLocale from '@fullcalendar/core/locales/fr';
import { format, isToday, isPast, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';

interface Event {
  id: string;
  title: string;
  date: string;
  description?: string;
}

const emptyEvent: Omit<Event, 'id'> = { title: '', date: '', description: '' };
const PAGE_SIZE = 10;

const CalendarPage = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [currentEvent, setCurrentEvent] = useState<Event | null>(null);
  const [form, setForm] = useState<Omit<Event, 'id'>>(emptyEvent);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const { toast } = useToast();
  const inputRef = useRef<HTMLInputElement>(null);

  // Fetch events
  const fetchEvents = async () => {
    setLoading(true);
    setError(null);
    try {
      const querySnapshot = await getDocs(collection(db, 'events'));
      const data: Event[] = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Event));
      setEvents(data);
    } catch (err) {
      setError('Erreur lors du chargement des événements');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // Recherche + tri par date
  const filteredEvents = events
    .filter(e =>
      (e.title || '').toLowerCase().includes(search.toLowerCase()) ||
      (e.description || '').toLowerCase().includes(search.toLowerCase()) ||
      (e.date || '').toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => (a.date > b.date ? 1 : -1));
  const pageCount = Math.ceil(filteredEvents.length / PAGE_SIZE);
  const paginatedEvents = filteredEvents.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Ouvre la modale pour ajouter
  const openAddModal = (date?: string) => {
    setModalMode('add');
    setForm({ ...emptyEvent, date: date || new Date().toISOString().slice(0, 10) });
    setCurrentEvent(null);
    setFormError(null);
    setModalOpen(true);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  // Ouvre la modale pour modifier
  const openEditModal = (e: Event) => {
    setModalMode('edit');
    setForm({ title: e.title, date: e.date, description: e.description || '' });
    setCurrentEvent(e);
    setFormError(null);
    setModalOpen(true);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  // Ferme la modale
  const closeModal = () => {
    setModalOpen(false);
    setFormError(null);
  };

  // Accessibilité : fermeture par Échap
  useEffect(() => {
    if (!modalOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeModal();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [modalOpen]);

  // Gère le formulaire (ajout/modif)
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Soumission du formulaire
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError(null);
    try {
      if (modalMode === 'add') {
        await addDoc(collection(db, 'events'), form);
        toast({ title: 'Succès', description: 'Événement ajouté avec succès', });
      } else if (modalMode === 'edit' && currentEvent) {
        await updateDoc(doc(db, 'events', currentEvent.id), form);
        toast({ title: 'Succès', description: 'Événement modifié avec succès', });
      }
      closeModal();
      fetchEvents();
    } catch (err) {
      setFormError('Erreur lors de la sauvegarde');
      toast({ title: 'Erreur', description: 'Erreur lors de la sauvegarde', });
    } finally {
      setFormLoading(false);
    }
  };

  // Suppression
  const handleDelete = async (e: Event) => {
    if (!window.confirm(`Supprimer l'événement "${e.title}" ?`)) return;
    try {
      await deleteDoc(doc(db, 'events', e.id));
      toast({ title: 'Succès', description: 'Événement supprimé' });
      fetchEvents();
    } catch (err) {
      setError('Erreur lors de la suppression');
      toast({ title: 'Erreur', description: 'Erreur lors de la suppression' });
    }
  };

  // Pagination controls
  const handlePrev = () => setPage(p => Math.max(1, p - 1));
  const handleNext = () => setPage(p => Math.min(pageCount, p + 1));

  // FullCalendar event mapping
  const calendarEvents = events.map(e => ({
    id: e.id,
    title: e.title,
    start: e.date,
    allDay: true,
    extendedProps: { description: e.description }
  }));

  // Handlers FullCalendar
  const handleDateClick = (arg: any) => {
    openAddModal(arg.dateStr);
  };
  const handleEventClick = (arg: any) => {
    const found = events.find(ev => ev.id === arg.event.id);
    if (found) openEditModal(found);
  };

  const badgeColor = (date: string) => {
    const d = parseISO(date);
    if (isToday(d)) return 'bg-blue-500 text-white';
    if (isPast(d)) return 'bg-gray-400 text-white';
    return 'bg-green-500 text-white';
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 transition-colors duration-500">
      <main className="flex-1 p-4 md:p-8">
        <h1 className="text-3xl font-extrabold mb-6 text-gray-800 dark:text-white tracking-tight flex items-center gap-2">
          <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-blue-500"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
          Calendrier
        </h1>
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-4 mb-8 transition-all duration-300">
          <div className="flex justify-between items-center mb-4 flex-col md:flex-row gap-2">
            <span className="font-semibold text-lg text-gray-700 dark:text-gray-200">Emploi du temps & événements</span>
            <button className="btn btn-primary rounded-full flex items-center gap-2 shadow hover:scale-105 transition-transform" onClick={() => openAddModal()} aria-label="Ajouter un événement">
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/></svg>
              Ajouter
            </button>
          </div>
          <div className="w-full max-w-4xl mx-auto rounded-xl overflow-hidden shadow-md bg-gradient-to-br from-blue-100 via-white to-purple-100 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 p-2">
            <FullCalendar
              plugins={[dayGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              locale={frLocale}
              events={calendarEvents}
              dateClick={handleDateClick}
              eventClick={handleEventClick}
              height={420}
              headerToolbar={{ left: 'prev,next today', center: 'title', right: 'dayGridMonth' }}
              eventContent={renderEventContent}
              dayMaxEvents={2}
              fixedWeekCount={false}
              aspectRatio={2.2}
              themeSystem="standard"
            />
          </div>
        </div>
        {/* Liste des événements */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-4 transition-all duration-300">
          <div className="flex justify-between items-center mb-4 flex-col md:flex-row gap-2">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2 mb-2 md:mb-0">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-purple-500"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2a4 4 0 014-4h3m-7 4v2a4 4 0 004 4h3m-7-4H5a2 2 0 01-2-2V7a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3"/></svg>
              Événements à venir
            </h2>
            <input
              type="text"
              placeholder="Rechercher..."
              className="input input-bordered w-full md:w-1/3 rounded-full px-4 py-2 focus:ring-2 focus:ring-blue-400"
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              aria-label="Rechercher un événement"
            />
          </div>
          {loading ? (
            <div className="text-center py-8 text-gray-500 animate-pulse">Chargement...</div>
          ) : error ? (
            <div className="text-center py-8 text-red-500">{error}</div>
          ) : (
            <div className="overflow-x-auto rounded-xl">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800 text-sm">
                <thead>
                  <tr className="bg-blue-50 dark:bg-gray-800">
                    <th className="px-4 py-2 text-left font-semibold">Titre</th>
                    <th className="px-4 py-2 text-left font-semibold">Date</th>
                    <th className="px-4 py-2 text-left font-semibold">Description</th>
                    <th className="px-4 py-2 text-left font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedEvents.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="text-center py-4 text-gray-400">Aucun événement trouvé</td>
                    </tr>
                  ) : (
                    paginatedEvents.map((e, idx) => (
                      <tr key={e.id} className={`transition-colors ${idx % 2 === 0 ? 'bg-gray-50 dark:bg-gray-800' : 'bg-white dark:bg-gray-900'} hover:bg-blue-100 dark:hover:bg-blue-950`}>
                        <td className="px-4 py-2 flex items-center gap-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-bold ${badgeColor(e.date)}`}>{isToday(parseISO(e.date)) ? "Aujourd'hui" : isPast(parseISO(e.date)) ? 'Passé' : 'À venir'}</span>
                          {e.title}
                        </td>
                        <td className="px-4 py-2">{format(parseISO(e.date), 'd MMMM yyyy', { locale: fr })}</td>
                        <td className="px-4 py-2 text-gray-600 dark:text-gray-300">{e.description}</td>
                        <td className="px-4 py-2 flex gap-2">
                          <button className="btn btn-xs btn-warning rounded-full flex items-center gap-1 shadow hover:scale-105 transition-transform" onClick={() => openEditModal(e)} aria-label="Modifier">
                            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a2 2 0 01-2.828 0L9 13zm0 0V17h4"/></svg>
                            Modifier
                          </button>
                          <button className="btn btn-xs btn-error rounded-full flex items-center gap-1 shadow hover:scale-105 transition-transform" onClick={() => handleDelete(e)} aria-label="Supprimer">
                            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
                            Supprimer
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
              {/* Pagination */}
              {pageCount > 1 && (
                <div className="flex justify-center items-center gap-4 mt-4">
                  <button className="btn btn-sm rounded-full" onClick={handlePrev} disabled={page === 1} aria-label="Page précédente">Précédent</button>
                  <span className="font-semibold">Page {page} / {pageCount}</span>
                  <button className="btn btn-sm rounded-full" onClick={handleNext} disabled={page === pageCount} aria-label="Page suivante">Suivant</button>
                </div>
              )}
            </div>
          )}
        </div>
        {/* Modale d'ajout/modification événement */}
        {modalOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="absolute inset-0 bg-black bg-opacity-40 backdrop-blur-sm transition-opacity duration-300" onClick={closeModal} aria-label="Fermer la modale" />
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8 w-full max-w-md relative z-10 animate-fade-in">
              <button className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 dark:hover:text-white text-2xl font-bold focus:outline-none" onClick={closeModal} aria-label="Fermer">
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
              <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">{modalMode === 'add' ? 'Ajouter' : 'Modifier'} un événement</h2>
              <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-200">Titre</label>
                <input
                  ref={inputRef}
                  type="text"
                  name="title"
                  placeholder="Titre de l'événement"
                  className="input input-bordered rounded-lg px-4 py-2"
                  value={form.title}
                  onChange={handleFormChange}
                  required
                />
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-200">Date</label>
                <input
                  type="date"
                  name="date"
                  className="input input-bordered rounded-lg px-4 py-2"
                  value={form.date}
                  onChange={handleFormChange}
                  required
                />
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-200">Description</label>
                <textarea
                  name="description"
                  placeholder="Description (optionnelle)"
                  className="input input-bordered rounded-lg px-4 py-2"
                  value={form.description}
                  onChange={handleFormChange}
                  rows={3}
                />
                {formError && <div className="text-red-500 text-sm">{formError}</div>}
                <button className="btn btn-primary mt-2 rounded-full flex items-center gap-2 shadow hover:scale-105 transition-transform" type="submit" disabled={formLoading}>
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>
                  {formLoading ? 'Enregistrement...' : modalMode === 'add' ? 'Ajouter' : 'Enregistrer'}
                </button>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

// Affichage custom des événements dans le calendrier
function renderEventContent(eventInfo: any) {
  return (
    <div className="flex flex-col items-start px-1 py-0.5">
      <span className="font-semibold text-blue-700 dark:text-blue-300 text-xs truncate">{eventInfo.event.title}</span>
      {eventInfo.event.extendedProps?.description && (
        <span className="text-xs text-gray-500 dark:text-gray-400 truncate">{eventInfo.event.extendedProps.description}</span>
      )}
    </div>
  );
}

export default CalendarPage; 