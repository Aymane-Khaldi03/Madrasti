import { Request, Response } from "express";

export const getStudentAssignments = async (req: Request, res: Response) => {
  const mockAssignments = [
    {
      title: "Contrôle de Mathématiques",
      course: "Analyse I",
      due: "2025-07-05",
      status: "En attente",
    },
    {
      title: "Rapport de TP Physique",
      course: "Physique II",
      status: "Terminé",
      grade: "17/20",
    },
  ];
  res.json(mockAssignments);
};