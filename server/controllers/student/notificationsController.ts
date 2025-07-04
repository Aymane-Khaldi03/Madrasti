import { Request, Response } from "express";

export const getStudentNotifications = async (req: Request, res: Response) => {
  const notifications = [
    {
      title: "Nouvelle annonce",
      message: "Contrôle de Math ajouté",
      date: "2025-07-02",
      read: false,
    },
    {
      title: "Rappel",
      message: "Rendez-vous avec le conseiller demain",
      date: "2025-07-09",
      read: true,
    },
  ];
  res.json(notifications);
};