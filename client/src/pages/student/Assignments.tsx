import React, { useEffect, useState } from "react";

interface Assignment {
  id?: number | string;
  title: string;
  course?: string;
  courseId?: number | string;
  due?: string;
  status: string;
  grade?: string | number;
}

const STUDENT_ID = 1; // À remplacer par l'ID dynamique de l'étudiant connecté

const Assignments = () => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/student/assignments?studentId=${STUDENT_ID}`)
      .then((res) => res.json())
      .then((data) => setAssignments(data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Devoirs</h1>
      {loading ? (
        <p>Chargement...</p>
      ) : (
        <table className="min-w-full bg-white rounded shadow">
          <thead>
            <tr>
              <th className="p-2">Titre</th>
              <th className="p-2">Cours</th>
              <th className="p-2">Échéance</th>
              <th className="p-2">Statut</th>
              <th className="p-2">Note</th>
            </tr>
          </thead>
          <tbody>
            {assignments.map((a, i) => (
              <tr key={i} className="border-t">
                <td className="p-2">{a.title}</td>
                <td className="p-2">{a.course || a.courseId}</td>
                <td className="p-2">{a.due || "-"}</td>
                <td className="p-2">{a.status}</td>
                <td className="p-2">{a.grade || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Assignments;