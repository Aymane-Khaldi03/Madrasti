import React, { useEffect, useState } from "react";
import { useAuth } from '@/contexts/AuthContext';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Bell, MailCheck, Search, Filter, Download, Eye, EyeOff, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { useLanguage } from '@/contexts/LanguageContext';

interface Notification {
  id?: number | string;
  title: string;
  message: string;
  date: string; // ISO string
  read?: boolean;
  type: string;
}

const PAGE_SIZE = 5;

const ProfessorNotifications: React.FC = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    if (!user?.id) return;
    setLoading(true);
    fetch(`/api/professor/notifications?professorId=${user.id}`)
      .then((res) => res.json())
      .then((data) => setNotifications(data))
      .finally(() => setLoading(false));
  }, [user?.id]);

  // Recherche et pagination
  const filtered = notifications.filter(n =>
    n.title.toLowerCase().includes(search.toLowerCase()) ||
    n.message.toLowerCase().includes(search.toLowerCase())
  );
  const pageCount = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const handlePrev = () => setCurrentPage(p => Math.max(1, p - 1));
  const handleNext = () => setCurrentPage(p => Math.min(pageCount, p + 1));
  React.useEffect(() => { if (currentPage > pageCount) setCurrentPage(1); }, [pageCount]);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 transition-colors duration-500">
      <main className="flex-1 p-4 md:p-8">
        <h1 className="text-3xl font-extrabold mb-6 text-gray-800 dark:text-white tracking-tight flex items-center gap-2">
          <Bell className="w-8 h-8 text-blue-500" /> {t('professor.notifications')}
        </h1>
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-4 transition-all duration-300">
          <div className="flex justify-between items-center mb-4 flex-col md:flex-row gap-2">
            <h2 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2 mb-2 md:mb-0">
              <MailCheck className="w-5 h-5 text-purple-500" /> {t('professor.myNotifications')}
            </h2>
            <input
              type="text"
              placeholder={t('professor.notificationsSearchPlaceholder')}
              className="input input-bordered w-full md:w-1/3 rounded-full px-4 py-2 focus:ring-2 focus:ring-blue-400"
              value={search}
              onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
              aria-label={t('professor.notificationsSearchAria')}
            />
          </div>
          {loading ? (
            <div className="text-center py-8 text-gray-500 animate-pulse">{t('common.loading')}</div>
          ) : (
            <ul className="divide-y divide-gray-200 dark:divide-gray-800">
              {paginated.length === 0 ? (
                <li className="text-center py-4 text-gray-400 flex flex-col items-center">
                  <Bell className="w-10 h-10 mb-2 text-blue-200" />
                  {t('professor.noNotificationsFound')}
                </li>
              ) : (
                paginated.map((n, i) => (
                  <li
                    key={n.id || i}
                    className={`py-2 flex flex-col md:flex-row md:items-center md:justify-between gap-2 hover:bg-blue-50 dark:hover:bg-blue-950 rounded-xl px-2 transition-colors animate-fadeIn`}
                    tabIndex={0}
                    aria-label={`${t('professor.notificationAria')}: ${n.title}`}
                  >
                    <div className="flex flex-col gap-1">
                      <span className="font-semibold text-blue-700 dark:text-blue-300 text-sm">{n.title}</span>
                      <span className="text-gray-600 dark:text-gray-300 text-xs">{n.message}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {!n.read && <span className="inline-block w-3 h-3 bg-blue-500 rounded-full" title={t('professor.unread')} aria-label={t('professor.unread')}></span>}
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
              <button className="btn btn-sm rounded-full" onClick={handlePrev} disabled={currentPage === 1} aria-label={t('professor.prevPageAria')}>{t('common.prev')}</button>
              <span className="font-semibold">{t('common.page')} {currentPage} / {pageCount}</span>
              <button className="btn btn-sm rounded-full" onClick={handleNext} disabled={currentPage === pageCount} aria-label={t('professor.nextPageAria')}>{t('common.next')}</button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ProfessorNotifications;
