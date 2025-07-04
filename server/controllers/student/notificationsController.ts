import { Request, Response } from "express";
import { storage } from "../../storage";

export const getStudentNotifications = async (req: Request, res: Response) => {
  try {
    const studentId = req.query.studentId as string;
    if (!studentId) return res.status(400).json({ error: 'studentId is required' });
    const notifications = await storage.getAllNotifications();
    const filtered = notifications.filter(n => n.userId === Number(studentId));
    res.json(filtered);
  } catch (err) {
    res.status(500).json({ error: 'Erreur Firestore', details: err });
  }
};