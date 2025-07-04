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
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-extrabold tracking-tight mb-6">Courses</h1>
      <div className="overflow-x-auto rounded-lg shadow bg-white dark:bg-gray-800">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th className="p-3 text-left font-semibold">Title</th>
              <th className="p-3 text-left font-semibold">Professor</th>
              <th className="p-3 text-left font-semibold">Progress</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {loading ? (
              <tr>
                <td colSpan={3} className="p-4 text-center">
                  Loading...
                </td>
              </tr>
            ) : courses.length === 0 ? (
              <tr>
                <td colSpan={3} className="p-4 text-center">
                  No courses found.
                </td>
              </tr>
            ) : (
              courses.map((c, i) => (
                <tr
                  key={i}
                  className="hover:bg-gray-50 dark:hover:bg-gray-900 transition"
                >
                  <td className="p-3 font-medium">{c.title}</td>
                  <td className="p-3">{c.professor}</td>
                  <td className="p-3">
                    <div className="w-full bg-gray-200 rounded-full h-3 dark:bg-gray-700">
                      <div
                        className="bg-blue-500 h-3 rounded-full"
                        style={{ width: `${c.progress}%` }}
                      ></div>
                    </div>
                    <span className="text-xs ml-2">{c.progress}%</span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProfessorMyCourses;
