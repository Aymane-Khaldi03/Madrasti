import React, { useState, useEffect, useRef } from 'react';
import { collection, addDoc, query, orderBy, onSnapshot, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface Notification {
  id: string;
  title: string;
  message: string;
  target: string;
  createdAt: Timestamp;
}

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ title: '', message: '', target: 'Tous' });
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 5;
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const q = query(collection(db, 'notifications'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snap) => {
      setNotifications(snap.docs.map(doc => ({ id: doc.id, ...doc.data() }) as Notification));
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    if (!form.title.trim() || !form.message.trim()) {
      setFormError('Titre et message requis.');
      return;
    }
    setFormLoading(true);
    try {
      await addDoc(collection(db, 'notifications'), {
        title: form.title,
        message: form.message,
        target: form.target,
        createdAt: Timestamp.now(),
      });
      setForm({ title: '', message: '', target: 'Tous' });
      setToast({ type: 'success', message: 'Notification envoyée !' });
      inputRef.current?.focus();
    } catch (err) {
      setToast({ type: 'error', message: "Erreur lors de l'envoi." });
    } finally {
      setFormLoading(false);
    }
  };

  // Pagination et recherche
  const filtered = notifications.filter(n =>
    n.title.toLowerCase().includes(search.toLowerCase()) ||
    n.message.toLowerCase().includes(search.toLowerCase())
  );
  const pageCount = Math.ceil(filtered.length / pageSize);
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);
  const handlePrev = () => setPage(p => Math.max(1, p - 1));
  const handleNext = () => setPage(p => Math.min(pageCount, p + 1));

  useEffect(() => {
    if (page > pageCount) setPage(1);
  }, [pageCount]);

  // Toast auto-hide
  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(t);
    }
  }, [toast]);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 transition-colors duration-500">
      <main className="flex-1 p-4 md:p-8">
        <h1 className="text-3xl font-extrabold mb-6 text-gray-800 dark:text-white tracking-tight flex items-center gap-2">
          <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-blue-500"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V4a2 2 0 10-4 0v1.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
          Notifications
        </h1>
        {/* Toast */}
        {toast && (
          <div className={`fixed top-6 right-6 z-50 px-4 py-2 rounded-xl shadow-lg text-white font-semibold ${toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>{toast.message}</div>
        )}
        {/* Formulaire d'envoi */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-4 mb-8 transition-all duration-300">
          <h2 className="text-lg font-bold mb-4 text-gray-700 dark:text-gray-200 flex items-center gap-2">
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-blue-500"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V4a2 2 0 10-4 0v1.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
            Envoyer une notification
          </h2>
          <form className="flex flex-col gap-2 md:flex-row md:items-end" onSubmit={handleFormSubmit}>
            <input
              ref={inputRef}
              type="text"
              name="title"
              placeholder="Titre"
              className="input input-bordered rounded-lg px-4 py-2"
              value={form.title}
              onChange={handleFormChange}
              required
            />
            <input
              type="text"
              name="message"
              placeholder="Message"
              className="input input-bordered rounded-lg px-4 py-2"
              value={form.message}
              onChange={handleFormChange}
              required
            />
            <select
              name="target"
              className="select select-bordered rounded-lg px-4 py-2"
              value={form.target}
              onChange={handleFormChange}
            >
              <option value="Tous">Tous</option>
              <option value="Professeurs">Professeurs</option>
              <option value="Élèves">Élèves</option>
            </select>
            <button
              className="btn btn-primary rounded-full flex items-center gap-2 shadow hover:scale-105 transition-transform"
              type="submit"
              disabled={formLoading}
              aria-label="Envoyer la notification"
            >
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>
              {formLoading ? 'Envoi...' : 'Envoyer'}
            </button>
          </form>
          {formError && <div className="text-red-500 text-sm mt-2">{formError}</div>}
        </div>
        {/* Historique des notifications */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-4 transition-all duration-300">
          <div className="flex justify-between items-center mb-4 flex-col md:flex-row gap-2">
            <h2 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2 mb-2 md:mb-0">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-purple-500"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V4a2 2 0 10-4 0v1.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
              Historique
            </h2>
            <input
              type="text"
              placeholder="Rechercher..."
              className="input input-bordered w-full md:w-1/3 rounded-full px-4 py-2 focus:ring-2 focus:ring-blue-400"
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              aria-label="Rechercher une notification"
            />
          </div>
          {loading ? (
            <div className="text-center py-8 text-gray-500 animate-pulse">Chargement...</div>
          ) : (
            <ul className="divide-y divide-gray-200 dark:divide-gray-800">
              {paginated.length === 0 ? (
                <li className="text-center py-4 text-gray-400">Aucune notification trouvée</li>
              ) : (
                paginated.map(n => (
                  <li key={n.id} className="py-3 flex flex-col md:flex-row md:items-center md:justify-between gap-2 hover:bg-blue-50 dark:hover:bg-blue-950 rounded-xl px-2 transition-colors">
                    <div className="flex flex-col gap-1">
                      <span className="font-semibold text-blue-700 dark:text-blue-300 text-sm">{n.title}</span>
                      <span className="text-gray-600 dark:text-gray-300 text-xs">{n.message}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-1 rounded-full text-xs font-bold bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-200">{n.target}</span>
                      <span className="text-xs text-gray-400">{n.createdAt && format(n.createdAt.toDate(), 'd MMMM yyyy', { locale: fr })}</span>
                    </div>
                  </li>
                ))
              )}
            </ul>
          )}
          {/* Pagination */}
          {pageCount > 1 && (
            <div className="flex justify-center items-center gap-4 mt-4">
              <button className="btn btn-sm rounded-full" onClick={handlePrev} disabled={page === 1} aria-label="Page précédente">Précédent</button>
              <span className="font-semibold">Page {page} / {pageCount}</span>
              <button className="btn btn-sm rounded-full" onClick={handleNext} disabled={page === pageCount} aria-label="Page suivante">Suivant</button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default NotificationsPage; 