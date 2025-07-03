import { useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  limit, 
  onSnapshot, 
  doc, 
  getDoc, 
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  DocumentData,
  QuerySnapshot,
  FirestoreError
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

export const useFirestore = <T = DocumentData>(
  collectionName: string, 
  queryConstraints?: any[]
) => {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const collectionRef = collection(db, collectionName);
    const q = queryConstraints 
      ? query(collectionRef, ...queryConstraints)
      : collectionRef;

    const unsubscribe = onSnapshot(
      q,
      (snapshot: QuerySnapshot) => {
        const documents = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as T[];
        setData(documents);
        setLoading(false);
      },
      (error: FirestoreError) => {
        setError(error.message);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [collectionName, queryConstraints]);

  return { data, loading, error };
};

export const useDocument = <T = DocumentData>(
  collectionName: string, 
  documentId: string
) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!documentId) {
      setLoading(false);
      return;
    }

    const docRef = doc(db, collectionName, documentId);
    const unsubscribe = onSnapshot(
      docRef,
      (snapshot) => {
        if (snapshot.exists()) {
          setData({ id: snapshot.id, ...snapshot.data() } as T);
        } else {
          setData(null);
        }
        setLoading(false);
      },
      (error: FirestoreError) => {
        setError(error.message);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [collectionName, documentId]);

  return { data, loading, error };
};

export const useFirestoreActions = (collectionName: string) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const add = async (data: any) => {
    setLoading(true);
    setError(null);
    try {
      const docRef = await addDoc(collection(db, collectionName), data);
      setLoading(false);
      return docRef.id;
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  };

  const update = async (id: string, data: any) => {
    setLoading(true);
    setError(null);
    try {
      await updateDoc(doc(db, collectionName, id), data);
      setLoading(false);
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  };

  const remove = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await deleteDoc(doc(db, collectionName, id));
      setLoading(false);
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  };

  return { add, update, remove, loading, error };
};
