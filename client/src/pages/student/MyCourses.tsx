import React, { useEffect, useState } from "react";
import { useAuth } from '@/contexts/AuthContext';
import { BookOpen, User, Eye } from "lucide-react";
import { Progress } from '@/components/ui/progress';

interface Course {
  id?: number | string;
  title: string;
  professor: string;
  progress: number;
  credits?: number;
  schedule?: string;
}

const COLORS = [
  'bg-blue-100 text-blue-600',
  'bg-green-100 text-green-600',
  'bg-purple-100 text-purple-600',
  'bg-amber-100 text-amber-600',
  'bg-pink-100 text-pink-600',
];

const MyCourses = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;
    fetch(`/api/student/courses?studentId=${user.id}`)
      .then((res) => res.json())
      .then((data) => setCourses(data))
      .finally(() => setLoading(false));
  }, [user?.id]);

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900">
      <h1 className="text-3xl font-extrabold mb-8 text-gray-900 dark:text-white tracking-tight">Mes Cours</h1>
      {loading ? (
        <div className="text-center text-lg text-gray-500">Chargement...</div>
      ) : courses.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <BookOpen className="w-16 h-16 text-blue-200 mb-4" />
          <p className="text-lg text-gray-500">Aucun cours trouvé pour ce semestre.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {courses.map((c, i) => (
            <div
              key={i}
              className="bg-white/95 dark:bg-gray-900/90 rounded-2xl shadow-lg p-6 flex flex-col gap-4 hover:shadow-2xl transition group border-0 min-h-[210px]"
              tabIndex={0}
              aria-label={`Cours ${c.title}`}
            >
              <div className="flex items-center gap-4 mb-2">
                <div className={`rounded-full shadow-lg flex items-center justify-center ${COLORS[i % COLORS.length]} w-14 h-14 group-hover:scale-110 transition-transform`}>
                  <BookOpen className="w-8 h-8" aria-label="Icône cours" />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors">{c.title}</h2>
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mt-1">
                    <User className="w-4 h-4" aria-label="Professeur" />
                    {c.professor}
                  </div>
                </div>
              </div>
              <div className="mt-auto">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-500">Progression</span>
                  <span className="text-xs font-semibold text-blue-700 dark:text-blue-300">{c.progress}%</span>
                </div>
                <Progress value={c.progress} className="h-3 rounded-full" />
              </div>
              <div className="mt-4 flex justify-end">
                <a
                  href={`/student/courses/${c.id}`}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 font-semibold shadow hover:bg-blue-200 dark:hover:bg-blue-800 transition focus:outline-none focus:ring-2 focus:ring-blue-400"
                  aria-label={`Voir le détail du cours ${c.title}`}
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

export default MyCourses;