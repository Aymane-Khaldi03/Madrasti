import { Request, Response } from "express";

export const getProfessorStudents = (req: Request, res: Response) => {
  // TODO: Fetch students for the professor from the database
  res.json([
    {
      id: "1",
      name: "Alice Johnson",
      email: "alice.johnson@example.com",
      enrolledCourses: ["Math", "Physics"]
    },
    {
      id: "2",
      name: "Bob Smith",
      email: "bob.smith@example.com",
      enrolledCourses: ["Math"]
    }
  ]);
};
