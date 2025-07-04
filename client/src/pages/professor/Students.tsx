import React, { useEffect, useState } from "react";
import { useAuth } from '@/contexts/AuthContext';

interface Student {
  id: string;
  name: string;
  email: string;
  enrolledCourses: string[];
}

const ProfessorStudents: React.FC = () => {
  const { user } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!user?.id) return;
    fetch(`/api/professor/students?professorId=${user.id}`)
      .then((res) => res.json())
      .then((data) => setStudents(data))
      .finally(() => setLoading(false));
  }, [user?.id]);

  const filtered = students.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <h1 className="text-3xl font-extrabold tracking-tight">Students</h1>
        <input
          className="border rounded px-3 py-2 w-full sm:w-64 focus:outline-none focus:ring focus:border-blue-400"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div className="overflow-x-auto rounded-lg shadow bg-white dark:bg-gray-800">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th className="p-3 text-left font-semibold">Avatar</th>
              <th className="p-3 text-left font-semibold">Name</th>
              <th className="p-3 text-left font-semibold">Email</th>
              <th className="p-3 text-left font-semibold">Enrolled Courses</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {loading ? (
              <tr>
                <td colSpan={4} className="p-4 text-center">
                  Loading...
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-4 text-center">
                  No students found.
                </td>
              </tr>
            ) : (
              filtered.map((student) => (
                <tr
                  key={student.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-900 transition"
                >
                  <td className="p-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg">
                      {student.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                  </td>
                  <td className="p-3 font-medium">{student.name}</td>
                  <td className="p-3 text-blue-700 dark:text-blue-300">
                    {student.email}
                  </td>
                  <td className="p-3 text-sm">
                    {student.enrolledCourses.join(", ")}
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

export default ProfessorStudents;
