import { Request, Response } from "express";

export const getProfessorCourses = (req: Request, res: Response) => {
  // TODO: Fetch courses for the professor from the database
  res.json([
    { title: "Math", professor: "Dr. Smith", progress: 80 },
    { title: "Physics", professor: "Dr. Smith", progress: 60 },
  ]);
};
