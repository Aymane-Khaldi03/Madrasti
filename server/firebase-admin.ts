// firebaseAdmin.ts
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import * as dotenv from 'dotenv';
import { Request, Response, NextFunction } from 'express';

dotenv.config(); // loads .env

/** Reconstruct service-account object from env vars */
const serviceAccount = {
  type: process.env.FIREBASE_TYPE,
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  // Stored in .env with \n escapes → convert back to real new-lines:
  private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
  auth_uri: process.env.FIREBASE_AUTH_URI,
  token_uri: process.env.FIREBASE_TOKEN_URI,
  auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
  client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
  universe_domain: process.env.FIREBASE_UNIVERSE_DOMAIN,
} as const;

/** Initialise Firebase Admin once */
if (!getApps().length) {
  initializeApp({ credential: cert(serviceAccount) });
}

/** Export Firestore instance */
export const db = getFirestore();

export function checkAdminAuth(req: Request, res: Response, next: NextFunction) {
  // Exemple : on suppose que req.user est déjà peuplé par un middleware d'auth
  // et contient un champ 'role'. À adapter selon ton système d'authentification !
  const user = (req as any).user;
  if (!user || user.role !== 'admin') {
    return res.status(403).json({ message: 'Accès réservé aux administrateurs.' });
  }
  next();
}
