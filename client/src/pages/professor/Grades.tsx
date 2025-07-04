import React, { useEffect, useState } from "react";

interface SubjectGrade {
  subject: string;
  grade: number;
}

interface GradesData {
  average: number;
  subjects: SubjectGrade[];
}

const PROFESSOR_ID = 1; // À remplacer par l'ID dynamique du professeur connecté

const ProfessorGrades = () => {
  const [grades, setGrades] = useState<GradesData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/professor/grades?professorId=${PROFESSOR_ID}`)
      .then((res) => res.json())
      .then((data) => setGrades(data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-extrabold tracking-tight mb-6">Grades</h1>
      {loading ? (
        <div className="p-4 text-center">Loading...</div>
      ) : grades ? (
        <>
          <div className="mb-6 flex items-center gap-4">
            <span className="font-semibold text-lg">Average:</span>
            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-bold text-lg">
              {grades.average}/20
            </span>
          </div>
          <div className="overflow-x-auto rounded-lg shadow bg-white dark:bg-gray-800">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th className="p-3 text-left font-semibold">Subject</th>
                  <th className="p-3 text-left font-semibold">Grade</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {grades.subjects.map((s, i) => (
                  <tr
                    key={i}
                    className="hover:bg-gray-50 dark:hover:bg-gray-900 transition"
                  >
                    <td className="p-3 font-medium">{s.subject}</td>
                    <td className="p-3">{s.grade}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <div className="p-4 text-center">No grades available.</div>
      )}
    </div>
  );
};

export default ProfessorGrades;
