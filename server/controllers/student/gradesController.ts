import { Request, Response } from "express";

export const getStudentGrades = async (req: Request, res: Response) => {
  const mockGrades = {
    average: 15.7,
    subjects: [
      { subject: "Analyse I", grade: 16 },
      { subject: "Physique II", grade: 15.5 },
    ],
  };
  res.json(mockGrades);
};