import { Request, Response } from "express";

export const getProfessorAssignments = (req: Request, res: Response) => {
  // TODO: Fetch assignments for the professor from the database
  res.json([
    { title: "Assignment 1", course: "Math", due: "2025-07-10", status: "Open", grade: null },
    { title: "Assignment 2", course: "Physics", due: "2025-07-15", status: "Closed", grade: "A" },
  ]);
};
