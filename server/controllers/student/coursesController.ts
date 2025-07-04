import { Request, Response } from "express";

export const getStudentCourses = async (req: Request, res: Response) => {
  const mockCourses = [
    { title: "Analyse I", professor: "Pr. El Amrani", progress: 78 },
    { title: "Physique II", professor: "Pr. Benyahia", progress: 84 },
  ];
  res.json(mockCourses);
};