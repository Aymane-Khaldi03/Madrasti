import React, { useEffect, useState } from "react";

interface Course {
  id?: number | string;
  title: string;
  professor: string;
  progress: number;
}

const STUDENT_ID = 1; // À remplacer par l'ID dynamique de l'étudiant connecté

const MyCourses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/student/courses?studentId=${STUDENT_ID}`)
      .then((res) => res.json())
      .then((data) => setCourses(data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Mes Cours</h1>
      {loading ? (
        <p>Chargement...</p>
      ) : (
        <table className="min-w-full bg-white rounded shadow">
          <thead>
            <tr>
              <th className="p-2">Titre</th>
              <th className="p-2">Professeur</th>
              <th className="p-2">Progression</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((c, i) => (
              <tr key={i} className="border-t">
                <td className="p-2">{c.title}</td>
                <td className="p-2">{c.professor}</td>
                <td className="p-2">{c.progress}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MyCourses;