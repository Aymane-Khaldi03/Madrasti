import { Request, Response } from 'express';

export const getReportByUser = async (req: Request, res: Response) => {
  // TODO: Générer un rapport par utilisateur
  res.json({});
};

export const getReportByClass = async (req: Request, res: Response) => {
  // TODO: Générer un rapport par classe
  res.json({});
};

export const exportReports = async (req: Request, res: Response) => {
  // TODO: Exporter les rapports en PDF/CSV
  res.json({ message: 'Export effectué' });
}; 