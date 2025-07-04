import React, { useEffect, useState } from "react";
import { Star, BookOpen, Award } from "lucide-react";

interface SubjectGrade {
  subject: string;
  grade: number;
}

interface GradesData {
  average: number;
  subjects: SubjectGrade[];
}

const STUDENT_ID = 1; // À remplacer par l'ID dynamique de l'étudiant connecté

const getGradeColor = (grade: number) => {
  if (grade >= 15) return "bg-green-100 text-green-700";
  if (grade >= 10) return "bg-amber-100 text-amber-700";
  return "bg-red-100 text-red-700";
};

const Grades = () => {
  const [grades, setGrades] = useState<GradesData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/student/grades?studentId=${STUDENT_ID}`)
      .then((res) => res.json())
      .then((data) => setGrades(data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900">
      <div className="flex items-center gap-3 mb-8">
        <Award className="w-10 h-10 text-blue-400 dark:text-blue-200" aria-label="Icône notes" />
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">Mes Notes</h1>
      </div>
      {loading ? (
        <div className="text-center text-lg text-gray-500">Chargement...</div>
      ) : grades ? (
        <>
          <div className="mb-8 flex items-center gap-4">
            <span className="font-semibold text-lg text-gray-700 dark:text-gray-200">Moyenne générale :</span>
            <span
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xl font-bold shadow ${getGradeColor(grades.average)}`}
              aria-label={`Moyenne générale : ${grades.average}/20`}
            >
              <Star className="w-5 h-5 text-yellow-400" aria-label="Étoile" />
              {grades.average}/20
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {grades.subjects.map((s, i) => (
              <div
                key={i}
                className={`bg-white/95 dark:bg-gray-900/90 rounded-2xl shadow-lg p-6 flex items-center gap-4 hover:shadow-2xl transition group border-0 min-h-[120px]`}
                tabIndex={0}
                aria-label={`Note de ${s.subject}`}
              >
                <div className={`rounded-full shadow flex items-center justify-center bg-blue-100 text-blue-600 w-14 h-14 group-hover:scale-110 transition-transform`}>
                  <BookOpen className="w-8 h-8" aria-label="Icône matière" />
                </div>
                <div className="flex-1">
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors">{s.subject}</h2>
                </div>
                <span
                  className={`px-4 py-2 rounded-full text-lg font-bold flex items-center gap-1 ${getGradeColor(s.grade)}`}
                  aria-label={`Note : ${s.grade}/20`}
                >
                  <Star className="w-4 h-4 text-yellow-400" aria-label="Étoile" />
                  {s.grade}/20
                </span>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-20">
          <Award className="w-16 h-16 text-blue-200 mb-4" />
          <p className="text-lg text-gray-500">Aucune note disponible pour ce semestre.</p>
        </div>
      )}
    </div>
  );
};

export default Grades;