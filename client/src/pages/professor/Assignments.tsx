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
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Assignments</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="min-w-full bg-white rounded shadow">
          <thead>
            <tr>
              <th className="p-2">Title</th>
              <th className="p-2">Course</th>
              <th className="p-2">Due</th>
              <th className="p-2">Status</th>
              <th className="p-2">Grade</th>
            </tr>
          </thead>
          <tbody>
            {assignments.map((a, i) => (
              <tr key={i} className="border-t">
                <td className="p-2">{a.title}</td>
                <td className="p-2">{a.course}</td>
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

export default ProfessorAssignments;
