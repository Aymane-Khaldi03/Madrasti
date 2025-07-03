import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

interface User {
  id: string;
  name: string;
  role: string;
  class?: string;
  passed?: boolean;
}

const AnalyticsPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  // Stats
  const students = users.filter(u => u.role === 'student');
  const totalStudents = students.length;
  const passedCount = students.filter(u => u.passed === true).length;
  const passRate = totalStudents ? Math.round((passedCount / totalStudents) * 100) : 0;

  // Stats par niveau
  const statsByClass: Record<string, number> = {};
  students.forEach(u => {
    const cls = u.class || 'Inconnu';
    statsByClass[cls] = (statsByClass[cls] || 0) + 1;
  });
  const classData = Object.entries(statsByClass).map(([cls, count]) => ({ niveau: cls, élèves: count }));

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 transition-colors duration-500">
      <main className="flex-1 p-4 md:p-8">
        <h1 className="text-3xl font-extrabold mb-8 text-gray-800 dark:text-white tracking-tight flex items-center gap-2">
          <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-purple-500"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 17a4 4 0 004-4V5a4 4 0 10-8 0v8a4 4 0 004 4zm0 0v1a3 3 0 006 0v-1m-6 0H5a2 2 0 01-2-2V7a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3"/></svg>
          Analyses & Statistiques
        </h1>
        {loading ? (
          <div className="text-center py-8 text-gray-500 animate-pulse">Chargement...</div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">{error}</div>
        ) : (
          <>
            {/* Widgets statistiques */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-6 flex flex-col items-center gap-2 transition-all duration-300">
                <div className="flex items-center gap-2 mb-2">
                  <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-green-500"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>
                  <span className="text-lg font-semibold text-gray-700 dark:text-gray-200">Taux de réussite</span>
                </div>
                <div className="text-4xl font-extrabold text-green-600 dark:text-green-400">{passRate}%</div>
                <span className="text-xs bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-200 px-2 py-1 rounded-full font-bold">% d'élèves ayant réussi</span>
              </div>
              <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-6 flex flex-col items-center gap-2 transition-all duration-300">
                <div className="flex items-center gap-2 mb-2">
                  <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-blue-500"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2h5"/></svg>
                  <span className="text-lg font-semibold text-gray-700 dark:text-gray-200">Total élèves</span>
                </div>
                <div className="text-4xl font-extrabold text-blue-600 dark:text-blue-400">{totalStudents}</div>
                <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 px-2 py-1 rounded-full font-bold">Nombre d'élèves inscrits</span>
              </div>
              <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-6 flex flex-col items-center gap-2 transition-all duration-300">
                <div className="flex items-center gap-2 mb-2">
                  <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-purple-500"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v4a1 1 0 001 1h3m10-5v4a1 1 0 01-1 1h-3m-4 4h6m-6 4h6"/></svg>
                  <span className="text-lg font-semibold text-gray-700 dark:text-gray-200">Statistiques par niveau</span>
                </div>
                <div className="text-4xl font-extrabold text-purple-600 dark:text-purple-400">{classData.length}</div>
                <span className="text-xs bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-200 px-2 py-1 rounded-full font-bold">Niveaux/classes détectés</span>
              </div>
            </div>
            {/* Graphique */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-6 transition-all duration-300">
              <div className="flex items-center gap-2 mb-4">
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-purple-500"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3v18h18"/></svg>
                <span className="text-lg font-semibold text-gray-700 dark:text-gray-200">Répartition des élèves par niveau</span>
              </div>
              <div className="w-full h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={classData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="niveau" />
                    <YAxis allowDecimals={false} />
                    <Tooltip contentStyle={{ borderRadius: 12, background: '#fff', color: '#333', fontWeight: 500 }} />
                    <Bar dataKey="élèves" fill="#6366f1" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default AnalyticsPage; 