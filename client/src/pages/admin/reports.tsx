import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  class?: string;
  cycle?: string;
  subject?: string;
}

interface Report {
  id: string;
  type: string;
  details: string;
  date: string;
}

const PAGE_SIZE = 10;

const ReportsPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterType, setFilterType] = useState('student');
  const [filterValue, setFilterValue] = useState('');
  const [reports, setReports] = useState<Report[]>([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);
      try {
        const snap = await getDocs(collection(db, 'users'));
        setUsers(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as User)));
      } catch (err) {
        setError('Erreur lors du chargement des données');
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // Génération dynamique des rapports
  const generateReports = () => {
    let filtered: User[] = users;
    if (filterType === 'student') filtered = users.filter(u => u.role === 'student');
    if (filterType === 'class') filtered = users.filter(u => u.class && u.class.toLowerCase().includes(filterValue.toLowerCase()));
    if (filterType === 'subject') filtered = users.filter(u => u.subject && u.subject.toLowerCase().includes(filterValue.toLowerCase()));
    if (filterType === 'cycle') filtered = users.filter(u => u.cycle && u.cycle.toLowerCase().includes(filterValue.toLowerCase()));
    const now = new Date().toISOString().slice(0, 10);
    const genReports: Report[] = filtered.map(u => ({
      id: u.id,
      type: `Par ${filterType}`,
      details: filterType === 'student' ? `Nom: ${u.name}` : filterType === 'class' ? `Classe: ${u.class}` : filterType === 'subject' ? `Matière: ${u.subject}` : `Cycle: ${u.cycle}`,
      date: now,
    }));
    setReports(genReports);
    setPage(1);
    toast({ title: 'Rapports générés', description: `${genReports.length} rapport(s) trouvés.` });
  };

  // Export CSV
  const exportCSV = () => {
    const header = 'Type,Détails,Date\n';
    const rows = reports.map(r => `${r.type},${r.details},${r.date}`).join('\n');
    const csv = header + rows;
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'rapports.csv';
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: 'Export CSV', description: 'Export CSV réussi.' });
  };

  // Pagination + recherche
  const filteredReports = reports.filter(r =>
    r.type.toLowerCase().includes(search.toLowerCase()) ||
    r.details.toLowerCase().includes(search.toLowerCase()) ||
    r.date.toLowerCase().includes(search.toLowerCase())
  );
  const pageCount = Math.ceil(filteredReports.length / PAGE_SIZE);
  const paginatedReports = filteredReports.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Voir détail
  const openModal = (report: Report) => {
    setSelectedReport(report);
    setModalOpen(true);
  };
  const closeModal = () => setModalOpen(false);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 transition-colors duration-500">
      <main className="flex-1 p-4 md:p-8">
        <h1 className="text-3xl font-extrabold mb-6 text-gray-800 dark:text-white tracking-tight flex items-center gap-2">
          <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-blue-500"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2a4 4 0 014-4h3m-7 4v2a4 4 0 004 4h3m-7-4H5a2 2 0 01-2-2V7a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3"/></svg>
          Rapports
        </h1>
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-4 mb-8 transition-all duration-300">
          <div className="flex flex-wrap gap-4 mb-4 items-center">
            <select className="select select-bordered rounded-full px-4 py-2" value={filterType} onChange={e => setFilterType(e.target.value)}>
              <option value="student">Par étudiant</option>
              <option value="class">Par classe</option>
              <option value="subject">Par matière</option>
              <option value="cycle">Par cycle</option>
            </select>
            <input type="text" placeholder="Filtrer..." className="input input-bordered rounded-full px-4 py-2" value={filterValue} onChange={e => setFilterValue(e.target.value)} />
            <button className="btn btn-primary rounded-full flex items-center gap-2 shadow hover:scale-105 transition-transform" onClick={generateReports} aria-label="Générer les rapports">
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/></svg>
              Générer
            </button>
            <button className="btn btn-secondary rounded-full flex items-center gap-2 shadow hover:scale-105 transition-transform" onClick={exportCSV} disabled={reports.length === 0} aria-label="Exporter CSV">
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7"/></svg>
              Exporter CSV
            </button>
          </div>
          <div className="flex justify-between mb-4 flex-col md:flex-row gap-2">
            <input
              type="text"
              placeholder="Recherche dans les rapports..."
              className="input input-bordered w-full md:w-1/3 rounded-full px-4 py-2 focus:ring-2 focus:ring-blue-400"
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              aria-label="Recherche dans les rapports"
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
                    <th className="px-4 py-2 text-left font-semibold">Type</th>
                    <th className="px-4 py-2 text-left font-semibold">Détails</th>
                    <th className="px-4 py-2 text-left font-semibold">Date</th>
                    <th className="px-4 py-2 text-left font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedReports.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="text-center py-4 text-gray-400">Aucun rapport trouvé</td>
                    </tr>
                  ) : (
                    paginatedReports.map((r, idx) => (
                      <tr key={r.id} className={`transition-colors ${idx % 2 === 0 ? 'bg-gray-50 dark:bg-gray-800' : 'bg-white dark:bg-gray-900'} hover:bg-blue-100 dark:hover:bg-blue-950`}>
                        <td className="px-4 py-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-bold ${r.type.includes('étudiant') ? 'bg-green-500 text-white' : r.type.includes('classe') ? 'bg-blue-500 text-white' : r.type.includes('matière') ? 'bg-purple-500 text-white' : 'bg-yellow-500 text-white'}`}>{r.type}</span>
                        </td>
                        <td className="px-4 py-2 text-gray-600 dark:text-gray-300">{r.details}</td>
                        <td className="px-4 py-2 text-gray-500 dark:text-gray-400">{r.date}</td>
                        <td className="px-4 py-2 flex gap-2">
                          <button className="btn btn-xs btn-primary rounded-full flex items-center gap-1 shadow hover:scale-105 transition-transform" onClick={() => openModal(r)} aria-label="Voir le rapport">
                            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0zm-6 0a6 6 0 1112 0 6 6 0 01-12 0z"/></svg>
                            Voir
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
                  <button className="btn btn-sm rounded-full" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} aria-label="Page précédente">Précédent</button>
                  <span className="font-semibold">Page {page} / {pageCount}</span>
                  <button className="btn btn-sm rounded-full" onClick={() => setPage(p => Math.min(pageCount, p + 1))} disabled={page === pageCount} aria-label="Page suivante">Suivant</button>
                </div>
              )}
            </div>
          )}
        </div>
        {/* Modale de détail */}
        {modalOpen && selectedReport && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="absolute inset-0 bg-black bg-opacity-40 backdrop-blur-sm transition-opacity duration-300" onClick={closeModal} aria-label="Fermer la modale" />
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8 w-full max-w-md relative z-10 animate-fade-in">
              <button className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 dark:hover:text-white text-2xl font-bold focus:outline-none" onClick={closeModal} aria-label="Fermer">
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
              <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Détail du rapport</h2>
              <div className="mb-2"><b>Type :</b> <span className="px-2 py-1 rounded-full text-xs font-bold bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200">{selectedReport.type}</span></div>
              <div className="mb-2"><b>Détails :</b> <span className="text-gray-700 dark:text-gray-200">{selectedReport.details}</span></div>
              <div className="mb-2"><b>Date :</b> <span className="text-gray-500 dark:text-gray-400">{selectedReport.date}</span></div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ReportsPage; 