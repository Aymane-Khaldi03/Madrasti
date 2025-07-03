import { Request, Response } from 'express';

export const getAnnouncements = async (req: Request, res: Response) => {
  // TODO: Récupérer la liste des annonces
  res.json([]);
};

export const createAnnouncement = async (req: Request, res: Response) => {
  // TODO: Créer une nouvelle annonce
  res.status(201).json({ message: 'Annonce créée' });
};

export const updateAnnouncement = async (req: Request, res: Response) => {
  // TODO: Mettre à jour une annonce
  res.json({ message: 'Annonce mise à jour' });
};

export const deleteAnnouncement = async (req: Request, res: Response) => {
  // TODO: Supprimer une annonce
  res.json({ message: 'Annonce supprimée' });
}; 