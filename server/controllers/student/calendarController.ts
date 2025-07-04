import { Request, Response } from "express";

export const getStudentEvents = async (req: Request, res: Response) => {
  const events = [
    {
      title: "Séance de tutorat",
      date: "2025-07-08",
      time: "16:00",
    },
    {
      title: "Rendez-vous avec le conseiller pédagogique",
      date: "2025-07-10",
      time: "14:00",
    },
  ];
  res.json(events);
};