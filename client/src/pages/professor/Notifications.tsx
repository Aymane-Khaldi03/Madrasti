import React, { useEffect, useState } from "react";
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Bell, MailCheck } from "lucide-react";

interface Notification {
  id?: number | string;
  title: string;
  message: string;
  date: string; // ISO string
  read?: boolean;
}

const PROFESSOR_ID = 1; // À remplacer par l'ID dynamique du professeur connecté
const PAGE_SIZE = 5;

const ProfessorNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetch(`/api/professor/notifications?professorId=${PROFESSOR_ID}`)
      .then((res) => res.json())
      .then((data) => setNotifications(data))
      .finally(() => setLoading(false));
  }, []);

  // Recherche et pagination
  const filtered = notifications.filter(n =>
    n.title.toLowerCase().includes(search.toLowerCase()) ||
    n.message.toLowerCase().includes(search.toLowerCase())
  );
  const pageCount = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const handlePrev = () => setPage(p => Math.max(1, p - 1));
  const handleNext = () => setPage(p => Math.min(pageCount, p + 1));
  React.useEffect(() => { if (page > pageCount) setPage(1); }, [pageCount]);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 transition-colors duration-500">
      <main className="flex-1 p-4 md:p-8">
        <h1 className="text-3xl font-extrabold mb-6 text-gray-800 dark:text-white tracking-tight flex items-center gap-2">
          <Bell className="w-8 h-8 text-blue-500" /> Notifications
        </h1>
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-4 transition-all duration-300">
          <div className="flex justify-between items-center mb-4 flex-col md:flex-row gap-2">
            <h2 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2 mb-2 md:mb-0">
              <MailCheck className="w-5 h-5 text-purple-500" /> Mes notifications
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
                <li className="text-center py-4 text-gray-400 flex flex-col items-center">
                  <Bell className="w-10 h-10 mb-2 text-blue-200" />
                  Aucune notification trouvée
                </li>
              ) : (
                paginated.map((n, i) => (
                  <li
                    key={n.id || i}
                    className={`py-2 flex flex-col md:flex-row md:items-center md:justify-between gap-2 hover:bg-blue-50 dark:hover:bg-blue-950 rounded-xl px-2 transition-colors animate-fadeIn`}
                    tabIndex={0}
                    aria-label={`Notification : ${n.title}`}
                  >
                    <div className="flex flex-col gap-1">
                      <span className="font-semibold text-blue-700 dark:text-blue-300 text-sm">{n.title}</span>
                      <span className="text-gray-600 dark:text-gray-300 text-xs">{n.message}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {!n.read && <span className="inline-block w-3 h-3 bg-blue-500 rounded-full" title="Non lu" aria-label="Non lu"></span>}
                      <span className="text-xs text-gray-400">{n.date ? format(new Date(n.date), 'd MMMM yyyy', { locale: fr }) : ''}</span>
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

export default ProfessorNotifications;
