import { Request, Response } from "express";

export const getProfessorGrades = (req: Request, res: Response) => {
  // TODO: Fetch grades for the professor's students from the database
  res.json({
    average: 15.5,
    subjects: [
      { subject: "Math", grade: 16 },
      { subject: "Physics", grade: 15 },
    ],
  });
};
