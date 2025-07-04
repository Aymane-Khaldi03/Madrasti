import { Request, Response } from "express";
import { storage } from "../../storage";

export const getStudentEvents = async (req: Request, res: Response) => {
  try {
    const studentId = req.query.studentId as string;
    if (!studentId) return res.status(400).json({ error: 'studentId is required' });
    const events = await storage.getAllEvents();
    // Si les events sont globaux, renvoyer tout. Sinon, filtrer selon studentId si la structure le permet.
    // Exemple : const filtered = events.filter(e => e.studentId === Number(studentId));
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: 'Erreur Firestore', details: err });
  }
};