import React, { useEffect, useState } from "react";

interface SubjectGrade {
  subject: string;
  grade: number;
}

interface GradesData {
  average: number;
  subjects: SubjectGrade[];
}

const STUDENT_ID = 1; // À remplacer par l'ID dynamique de l'étudiant connecté

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
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Mes Notes</h1>
      {loading ? (
        <p>Chargement...</p>
      ) : grades ? (
        <>
          <div className="mb-4">
            <span className="font-semibold">Moyenne générale :</span>{" "}
            <span>{grades.average}/20</span>
          </div>
          <table className="min-w-full bg-white rounded shadow">
            <thead>
              <tr>
                <th className="p-2">Matière</th>
                <th className="p-2">Note</th>
              </tr>
            </thead>
            <tbody>
              {grades.subjects.map((s, i) => (
                <tr key={i} className="border-t">
                  <td className="p-2">{s.subject}</td>
                  <td className="p-2">{s.grade}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      ) : (
        <p>Aucune note disponible.</p>
      )}
    </div>
  );
};

export default Grades;