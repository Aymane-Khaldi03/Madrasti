import React, { useEffect, useState } from "react";

type Course = {
  title: string;
  professor: string;
  progress: number;
};

const ProfessorMyCourses: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/professor/courses")
      .then((res) => res.json())
      .then((data) => setCourses(data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Courses</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="min-w-full bg-white rounded shadow">
          <thead>
            <tr>
              <th className="p-2">Title</th>
              <th className="p-2">Professor</th>
              <th className="p-2">Progress</th>
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

export default ProfessorMyCourses;
