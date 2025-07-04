import React, { useEffect, useState } from "react";
import { FileText, BookOpen, CalendarDays, Award, Eye } from "lucide-react";

interface Assignment {
  id?: number | string;
  title: string;
  course?: string;
  courseId?: number | string;
  due?: string;
  status: string;
  grade?: string | number;
}

const PROFESSOR_ID = 1; // À remplacer par l'ID dynamique du professeur connecté

const STATUS_COLORS: Record<string, string> = {
  'Open': 'bg-green-100 text-green-700',
  'Closed': 'bg-gray-200 text-gray-700',
  'En attente': 'bg-amber-100 text-amber-700',
  'Terminé': 'bg-blue-100 text-blue-700',
};

const ProfessorAssignments: React.FC = () => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/professor/assignments?professorId=${PROFESSOR_ID}`)
      .then((res) => res.json())
      .then((data) => setAssignments(data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <div className="flex items-center gap-3 mb-8">
        <FileText className="w-10 h-10 text-blue-400 dark:text-blue-200" aria-label="Icône devoirs" />
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">Devoirs à corriger</h1>
      </div>
      {loading ? (
        <div className="text-center text-lg text-gray-500">Chargement...</div>
      ) : assignments.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <FileText className="w-16 h-16 text-blue-200 mb-4" />
          <p className="text-lg text-gray-500">Aucun devoir à corriger pour l'instant.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {assignments.map((a, i) => (
            <div
              key={i}
              className="bg-white/95 dark:bg-gray-900/90 rounded-2xl shadow-lg p-6 flex flex-col gap-4 hover:shadow-2xl transition group border-0 min-h-[180px] animate-fadeIn"
              tabIndex={0}
              aria-label={`Devoir : ${a.title}`}
            >
              <div className="flex items-center gap-4 mb-2">
                <div className="rounded-full shadow-lg flex items-center justify-center bg-blue-100 text-blue-600 w-14 h-14 group-hover:scale-110 transition-transform">
                  <FileText className="w-8 h-8" aria-label="Icône devoir" />
                </div>
                <div className="flex-1">
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors">{a.title}</h2>
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mt-1">
                    <BookOpen className="w-4 h-4" aria-label="Cours" />
                    {a.course || a.courseId}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                <span className="flex items-center gap-1">
                  <CalendarDays className="w-4 h-4" />
                  <span className="font-semibold">Échéance :</span> {a.due || '-'}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[a.status] || 'bg-gray-100 text-gray-700'}`}>{a.status}</span>
                {a.grade && (
                  <span className="ml-auto px-2 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-semibold flex items-center gap-1"><Award className="w-4 h-4 text-yellow-400" /> Note : {a.grade}</span>
                )}
              </div>
              <div className="mt-4 flex justify-end">
                <a
                  href={`/professor/assignments/${a.id}`}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 font-semibold shadow hover:bg-blue-200 dark:hover:bg-blue-800 transition focus:outline-none focus:ring-2 focus:ring-blue-400"
                  aria-label={`Voir copies à corriger pour le devoir ${a.title}`}
                >
                  <Eye className="w-5 h-5" />
                  <span>Voir copies à corriger</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProfessorAssignments;
