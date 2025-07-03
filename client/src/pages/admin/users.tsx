import React, { useEffect, useState, useRef } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

const emptyUser: Omit<User, 'id'> = { name: '', email: '', role: 'student' };
const PAGE_SIZE = 10;

const UsersPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [form, setForm] = useState<Omit<User, 'id'>>(emptyUser);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const { toast } = useToast();
  const inputRef = useRef<HTMLInputElement>(null);

  // Fetch users
  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const querySnapshot = await getDocs(collection(db, 'users'));
      const usersData: User[] = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User));
      setUsers(usersData);
    } catch (err) {
      setError('Erreur lors du chargement des utilisateurs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Pagination + recherche
  const filteredUsers = users.filter(u =>
    (u.name || '').toLowerCase().includes(search.toLowerCase()) ||
    (u.email || '').toLowerCase().includes(search.toLowerCase()) ||
    (u.role || '').toLowerCase().includes(search.toLowerCase())
  );
  const pageCount = Math.ceil(filteredUsers.length / PAGE_SIZE);
  const paginatedUsers = filteredUsers.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Ouvre la modale pour ajouter
  const openAddModal = () => {
    setModalMode('add');
    setForm(emptyUser);
    setCurrentUser(null);
    setFormError(null);
    setModalOpen(true);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  // Ouvre la modale pour modifier
  const openEditModal = (user: User) => {
    setModalMode('edit');
    setForm({ name: user.name, email: user.email, role: user.role });
    setCurrentUser(user);
    setFormError(null);
    setModalOpen(true);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  // Ferme la modale
  const closeModal = () => {
    setModalOpen(false);
    setFormError(null);
  };

  // Accessibilité : fermeture par Échap
  useEffect(() => {
    if (!modalOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeModal();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [modalOpen]);

  // Gère le formulaire (ajout/modif)
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Soumission du formulaire
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError(null);
    try {
      // Validation unicité email à l'ajout
      if (modalMode === 'add') {
        const q = query(collection(db, 'users'), where('email', '==', form.email));
        const snap = await getDocs(q);
        if (!snap.empty) {
          setFormError('Cet email existe déjà.');
          setFormLoading(false);
          return;
        }
        await addDoc(collection(db, 'users'), form);
        toast({ title: 'Succès', description: 'Utilisateur ajouté avec succès', });
      } else if (modalMode === 'edit' && currentUser) {
        await updateDoc(doc(db, 'users', currentUser.id), form);
        toast({ title: 'Succès', description: 'Utilisateur modifié avec succès', });
      }
      closeModal();
      fetchUsers();
    } catch (err) {
      setFormError('Erreur lors de la sauvegarde');
      toast({ title: 'Erreur', description: 'Erreur lors de la sauvegarde', });
    } finally {
      setFormLoading(false);
    }
  };

  // Suppression
  const handleDelete = async (user: User) => {
    if (!window.confirm(`Supprimer l'utilisateur ${user.name} ?`)) return;
    try {
      await deleteDoc(doc(db, 'users', user.id));
      toast({ title: 'Succès', description: 'Utilisateur supprimé' });
      fetchUsers();
    } catch (err) {
      setError('Erreur lors de la suppression');
      toast({ title: 'Erreur', description: 'Erreur lors de la suppression' });
    }
  };

  // Pagination controls
  const handlePrev = () => setPage(p => Math.max(1, p - 1));
  const handleNext = () => setPage(p => Math.min(pageCount, p + 1));

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 transition-colors duration-500">
      <main className="flex-1 p-4 md:p-8">
        <h1 className="text-3xl font-extrabold mb-6 text-gray-800 dark:text-white tracking-tight flex items-center gap-2">
          <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-blue-500"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.121 17.804A13.937 13.937 0 0112 15c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
          Gestion des utilisateurs
        </h1>
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-4 mb-8 transition-all duration-300">
          <div className="flex justify-between items-center mb-4 flex-col md:flex-row gap-2">
            <input
              type="text"
              placeholder="Rechercher..."
              className="input input-bordered w-full md:w-1/3 rounded-full px-4 py-2 focus:ring-2 focus:ring-blue-400"
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              aria-label="Rechercher un utilisateur"
            />
            <button className="btn btn-primary rounded-full flex items-center gap-2 shadow hover:scale-105 transition-transform" onClick={openAddModal} aria-label="Ajouter un utilisateur">
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/></svg>
              Ajouter
            </button>
          </div>
          {loading ? (
            <div className="text-center py-8 text-gray-500 animate-pulse">Chargement...</div>
          ) : error ? (
            <div className="text-center py-8 text-red-500">{error}</div>
          ) : (
            <div className="overflow-x-auto rounded-xl">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800 text-sm">
                <thead>
                  <tr className="bg-blue-50 dark:bg-gray-800">
                    <th className="px-4 py-2 text-left font-semibold">Nom</th>
                    <th className="px-4 py-2 text-left font-semibold">Rôle</th>
                    <th className="px-4 py-2 text-left font-semibold">Email</th>
                    <th className="px-4 py-2 text-left font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedUsers.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="text-center py-4 text-gray-400">Aucun utilisateur trouvé</td>
                    </tr>
                  ) : (
                    paginatedUsers.map((user, idx) => (
                      <tr key={user.id} className={`transition-colors ${idx % 2 === 0 ? 'bg-gray-50 dark:bg-gray-800' : 'bg-white dark:bg-gray-900'} hover:bg-blue-100 dark:hover:bg-blue-950`}>
                        <td className="px-4 py-2 font-semibold text-gray-800 dark:text-white">{user.name}</td>
                        <td className="px-4 py-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-bold ${user.role === 'admin' ? 'bg-red-500 text-white' : user.role === 'professor' ? 'bg-blue-500 text-white' : 'bg-green-500 text-white'}`}>
                            {user.role === 'student' ? 'Élève' : user.role === 'professor' ? 'Professeur' : 'Administrateur'}
                          </span>
                        </td>
                        <td className="px-4 py-2 text-gray-600 dark:text-gray-300">{user.email}</td>
                        <td className="px-4 py-2 flex gap-2">
                          <button className="btn btn-xs btn-warning rounded-full flex items-center gap-1 shadow hover:scale-105 transition-transform" onClick={() => openEditModal(user)} aria-label="Modifier">
                            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a2 2 0 01-2.828 0L9 13zm0 0V17h4"/></svg>
                            Modifier
                          </button>
                          <button className="btn btn-xs btn-error rounded-full flex items-center gap-1 shadow hover:scale-105 transition-transform" onClick={() => handleDelete(user)} aria-label="Supprimer">
                            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
                            Supprimer
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
              {/* Pagination */}
              {pageCount > 1 && (
                <div className="flex justify-center items-center gap-4 mt-4">
                  <button className="btn btn-sm rounded-full" onClick={handlePrev} disabled={page === 1} aria-label="Page précédente">Précédent</button>
                  <span className="font-semibold">Page {page} / {pageCount}</span>
                  <button className="btn btn-sm rounded-full" onClick={handleNext} disabled={page === pageCount} aria-label="Page suivante">Suivant</button>
                </div>
              )}
            </div>
          )}
        </div>
        {/* Modale d'ajout/édition */}
        {modalOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="absolute inset-0 bg-black bg-opacity-40 backdrop-blur-sm transition-opacity duration-300" onClick={closeModal} aria-label="Fermer la modale" />
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8 w-full max-w-md relative z-10 animate-fade-in">
              <button className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 dark:hover:text-white text-2xl font-bold focus:outline-none" onClick={closeModal} aria-label="Fermer">
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
              <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">{modalMode === 'add' ? 'Ajouter' : 'Modifier'} un utilisateur</h2>
              <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-200">Nom</label>
                <input
                  ref={inputRef}
                  type="text"
                  name="name"
                  placeholder="Nom de l'utilisateur"
                  className="input input-bordered rounded-lg px-4 py-2"
                  value={form.name}
                  onChange={handleFormChange}
                  required
                />
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-200">Email</label>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  className="input input-bordered rounded-lg px-4 py-2"
                  value={form.email}
                  onChange={handleFormChange}
                  required
                />
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-200">Rôle</label>
                <select
                  name="role"
                  className="select select-bordered rounded-lg px-4 py-2"
                  value={form.role}
                  onChange={handleFormChange}
                  required
                >
                  <option value="student">Élève</option>
                  <option value="professor">Professeur</option>
                  <option value="admin">Administrateur</option>
                </select>
                {formError && <div className="text-red-500 text-sm">{formError}</div>}
                <button className="btn btn-primary mt-2 rounded-full flex items-center gap-2 shadow hover:scale-105 transition-transform" type="submit" disabled={formLoading}>
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>
                  {formLoading ? 'Enregistrement...' : modalMode === 'add' ? 'Ajouter' : 'Enregistrer'}
                </button>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default UsersPage; 