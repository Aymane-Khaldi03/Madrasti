import { Request, Response } from 'express';

export const getNotifications = async (req: Request, res: Response) => {
  // TODO: Récupérer la liste des notifications
  res.json([]);
};

export const createNotification = async (req: Request, res: Response) => {
  // TODO: Envoyer une nouvelle notification
  res.status(201).json({ message: 'Notification envoyée' });
}; 