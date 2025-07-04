import { Request, Response } from "express";
import { storage } from "../../storage";

export const getProfessorCalendar = async (req: Request, res: Response) => {
  try {
    const professorId = req.query.professorId as string;
    if (!professorId) return res.status(400).json({ error: 'professorId is required' });
    const events = await storage.getAllEvents();
    // Si les events sont globaux, renvoyer tout. Sinon, filtrer selon professorId si la structure le permet.
    // Exemple : const filtered = events.filter(e => e.professorId === Number(professorId));
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: 'Erreur Firestore', details: err });
  }
};
