import React, { useEffect, useState } from "react";

type Assignment = {
  title: string;
  course: string;
  due?: string;
  status: string;
  grade?: string;
};

const ProfessorAssignments: React.FC = () => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/professor/assignments")
      .then((res) => res.json())
      .then((data) => setAssignments(data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-extrabold tracking-tight mb-6">Assignments</h1>
      <div className="overflow-x-auto rounded-lg shadow bg-white dark:bg-gray-800">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th className="p-3 text-left font-semibold">Title</th>
              <th className="p-3 text-left font-semibold">Course</th>
              <th className="p-3 text-left font-semibold">Due</th>
              <th className="p-3 text-left font-semibold">Status</th>
              <th className="p-3 text-left font-semibold">Grade</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {loading ? (
              <tr><td colSpan={5} className="p-4 text-center">Loading...</td></tr>
            ) : assignments.length === 0 ? (
              <tr><td colSpan={5} className="p-4 text-center">No assignments found.</td></tr>
            ) : (
              assignments.map((a, i) => (
                <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-900 transition">
                  <td className="p-3 font-medium">{a.title}</td>
                  <td className="p-3">{a.course}</td>
                  <td className="p-3">{a.due || "-"}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${a.status === 'Open' ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-700'}`}>{a.status}</span>
                  </td>
                  <td className="p-3">{a.grade || "-"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProfessorAssignments;
