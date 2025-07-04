import React, { useEffect, useState } from "react";

type Student = {
  id: string;
  name: string;
  email: string;
  enrolledCourses: string[];
};

const ProfessorStudents: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/professor/students")
      .then((res) => res.json())
      .then((data) => setStudents(data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Students</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="min-w-full bg-white rounded shadow">
          <thead>
            <tr>
              <th className="p-2">Name</th>
              <th className="p-2">Email</th>
              <th className="p-2">Enrolled Courses</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id} className="border-t">
                <td className="p-2">{student.name}</td>
                <td className="p-2">{student.email}</td>
                <td className="p-2">{student.enrolledCourses.join(", ")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ProfessorStudents;
