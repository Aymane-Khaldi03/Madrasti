import { Request, Response } from "express";
import { storage } from "../../storage";

export const getProfessorNotifications = async (req: Request, res: Response) => {
  try {
    const professorId = req.query.professorId as string;
    if (!professorId) return res.status(400).json({ error: 'professorId is required' });
    const notifications = await storage.getAllNotifications();
    const filtered = notifications.filter(n => n.userId === Number(professorId));
    res.json(filtered);
  } catch (err) {
    res.status(500).json({ error: 'Erreur Firestore', details: err });
  }
};
