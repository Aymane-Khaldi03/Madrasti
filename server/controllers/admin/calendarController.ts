import { Request, Response } from 'express';

export const getEvents = async (req: Request, res: Response) => {
  // TODO: Récupérer la liste des événements
  res.json([]);
};

export const createEvent = async (req: Request, res: Response) => {
  // TODO: Créer un nouvel événement
  res.status(201).json({ message: 'Événement créé' });
};

export const deleteEvent = async (req: Request, res: Response) => {
  // TODO: Supprimer un événement
  res.json({ message: 'Événement supprimé' });
}; 