import { Request, Response } from "express";

export const getProfessorCalendar = (req: Request, res: Response) => {
  // TODO: Fetch calendar events for the professor from the database
  res.json([
    { title: "Lecture: Math", date: "2025-07-08", time: "10:00" },
    { title: "Exam: Physics", date: "2025-07-12", time: "14:00" },
  ]);
};
