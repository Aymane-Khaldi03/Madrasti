import React, { useEffect, useState } from "react";
import { useAuth } from '@/contexts/AuthContext';
import { FileText, Eye, BookOpen, Star } from "lucide-react";

interface Assignment {
  id?: number | string;
  title: string;
  course?: string;
  courseId?: number | string;
  due?: string;
  status: string;
  grade?: string | number;
}

const COLORS = [
  'bg-blue-100 text-blue-600',
  'bg-green-100 text-green-600',
  'bg-purple-100 text-purple-600',
  'bg-amber-100 text-amber-600',
  'bg-pink-100 text-pink-600',
];

const STATUS_COLORS: Record<string, string> = {
  'pending': 'bg-amber-100 text-amber-700',
  'En attente': 'bg-amber-100 text-amber-700',
  'completed': 'bg-green-100 text-green-700',
  'Terminé': 'bg-green-100 text-green-700',
  'open': 'bg-blue-100 text-blue-700',
  'closed': 'bg-gray-200 text-gray-700',
};

const getGradeBadge = (grade?: string | number) => {
  if (grade === undefined || grade === null || grade === "") {
    return {
      color: "bg-gray-100 text-gray-500",
      label: "Non noté",
      icon: false,
    };
  }
  const g = typeof grade === "string" ? parseFloat(grade) : grade;
  if (isNaN(g)) {
    return {
      color: "bg-gray-100 text-gray-500",
      label: grade,
      icon: false,
    };
  }
  if (g >= 15) return { color: "bg-green-100 text-green-700", label: `${g}/20`, icon: true };
  if (g >= 10) return { color: "bg-amber-100 text-amber-700", label: `${g}/20`, icon: true };
  return { color: "bg-red-100 text-red-700", label: `${g}/20`, icon: true };
};

const Assignments = () => {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;
    fetch(`/api/student/assignments?studentId=${user.id}`)
      .then((res) => res.json())
      .then((data) => setAssignments(data))
      .finally(() => setLoading(false));
  }, [user?.id]);

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900">
      <h1 className="text-3xl font-extrabold mb-8 text-gray-900 dark:text-white tracking-tight">Mes Devoirs</h1>
      {loading ? (
        <div className="text-center text-lg text-gray-500">Chargement...</div>
      ) : assignments.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <FileText className="w-16 h-16 text-blue-200 mb-4" />
          <p className="text-lg text-gray-500">Aucun devoir trouvé pour ce semestre.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {assignments.map((a, i) => (
            <div
              key={i}
              className="bg-white/95 dark:bg-gray-900/90 rounded-2xl shadow-lg p-6 flex flex-col gap-4 hover:shadow-2xl transition group border-0 min-h-[210px]"
              tabIndex={0}
              aria-label={`Devoir ${a.title}`}
            >
              <div className="flex items-center gap-4 mb-2">
                <div className={`rounded-full shadow-lg flex items-center justify-center ${COLORS[i % COLORS.length]} w-14 h-14 group-hover:scale-110 transition-transform`}>
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
                  <span className="font-semibold">Échéance :</span> {a.due || '-'}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[a.status] || 'bg-gray-100 text-gray-700'}`}>{a.status}</span>
                {a.grade !== undefined && a.grade !== null ? (
                  (() => {
                    const badge = getGradeBadge(a.grade);
                    return (
                      <span
                        className={`ml-auto px-3 py-1 rounded-full text-base font-bold flex items-center gap-1 ${badge.color}`}
                        aria-label={`Note : ${badge.label}`}
                      >
                        {badge.icon && <Star className="w-4 h-4 text-yellow-400" aria-label="Étoile" />}
                        {badge.label}
                      </span>
                    );
                  })()
                ) : (
                  <span className="ml-auto px-3 py-1 rounded-full bg-gray-100 text-gray-500 text-base font-bold" aria-label="Non noté">Non noté</span>
                )}
              </div>
              <div className="mt-4 flex justify-end">
                <a
                  href={`/student/assignments/${a.id}`}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 font-semibold shadow hover:bg-blue-200 dark:hover:bg-blue-800 transition focus:outline-none focus:ring-2 focus:ring-blue-400"
                  aria-label={`Voir le détail du devoir ${a.title}`}
                >
                  <Eye className="w-5 h-5" />
                  <span>Voir détail</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Assignments;