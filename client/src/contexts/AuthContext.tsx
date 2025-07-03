import React, { createContext, useContext, useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

console.log('[DEBUG] Firestore db:', db);

interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: 'student' | 'professor' | 'admin';
  // Ajoute d'autres champs si besoin
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(false);

  // Hydrate user depuis localStorage au démarrage
  useEffect(() => {
    const storedUser = localStorage.getItem('authUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      // Test Firestore connection
      try {
        const test = await getDocs(collection(db, 'users'));
        console.log('[DEBUG] Firestore test, user count:', test.size);
      } catch (err) {
        console.error('[DEBUG] Firestore test error:', err);
      }

      // Log tous les utilisateurs pour debug
      const allUsers = await getDocs(collection(db, 'users'));
      allUsers.forEach(doc => {
        console.log('[DEBUG] User in DB:', doc.id, doc.data());
      });

      // Teste la requête uniquement sur l'email
      const qEmail = query(
        collection(db, 'users'),
        where('email', '==', email)
      );
      const emailSnapshot = await getDocs(qEmail);
      console.log('[DEBUG] Query by email only, empty:', emailSnapshot.empty);
      if (!emailSnapshot.empty) {
        emailSnapshot.forEach(doc => {
          console.log('[DEBUG] User found by email:', doc.id, doc.data());
        });
      }

      // Requête email + password
      console.log('[DEBUG] Attempting login with:', { email, password });
      const q = query(
        collection(db, 'users'),
        where('email', '==', email),
        where('password', '==', password)
      );
      const querySnapshot = await getDocs(q);
      console.log('[DEBUG] Firestore querySnapshot.empty:', querySnapshot.empty);
      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        console.log('[DEBUG] User found:', userDoc.data());
        const authUser = { id: userDoc.id, ...userDoc.data() } as AuthUser;
        setUser(authUser);
        localStorage.setItem('authUser', JSON.stringify(authUser)); // persiste l'utilisateur
      } else {
        console.log('[DEBUG] No user found for these credentials');
        throw new Error('Invalid credentials');
      }
    } finally {
      setLoading(false);
    }
  };

  const signOut = () => {
    setUser(null);
    localStorage.removeItem('authUser'); // supprime du localStorage
  };

  const value = {
    user,
    loading,
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
