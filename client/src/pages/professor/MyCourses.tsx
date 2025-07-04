import React, { useEffect, useState } from "react";
import { BookOpen, PlusCircle, Edit, Trash2, XCircle } from "lucide-react";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface Course {
  id?: number | string;
  title: string;
  professor: string;
  progress: number;
}

const PROFESSOR_ID = 1; // À remplacer par l'ID dynamique du professeur connecté

const getProgressColor = (progress: number) => {
  if (progress >= 80) return "bg-green-100 text-green-700";
  if (progress >= 50) return "bg-amber-100 text-amber-700";
  return "bg-red-100 text-red-700";
};

const ProfessorMyCourses: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'add' | 'edit'>("add");
  const [form, setForm] = useState<Course>({ title: '', professor: '', progress: 0 });
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const [editId, setEditId] = useState<number | string | undefined>(undefined);
  const [deleteLoading, setDeleteLoading] = useState<string | number | null>(null);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [search, setSearch] = useState("");
  const [progressFilter, setProgressFilter] = useState<'all' | 'high' | 'mid' | 'low'>('all');

  const fetchCourses = () => {
    setLoading(true);
    fetch(`/api/professor/courses?professorId=${PROFESSOR_ID}`)
      .then((res) => res.json())
      .then((data) => setCourses(data))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchCourses(); }, []);

  // Toast auto-hide
  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(t);
    }
  }, [toast]);

  // Filtrage et recherche
  const filteredCourses = courses.filter(c => {
    const matchSearch = c.title.toLowerCase().includes(search.toLowerCase());
    let matchProgress = true;
    if (progressFilter === 'high') matchProgress = c.progress >= 80;
    else if (progressFilter === 'mid') matchProgress = c.progress >= 50 && c.progress < 80;
    else if (progressFilter === 'low') matchProgress = c.progress < 50;
    return matchSearch && matchProgress;
  });

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    if (!form.title.trim() || !form.professor.trim() || isNaN(form.progress)) {
      setFormError('Titre, professeur et progression requis.');
      return;
    }
    setFormLoading(true);
    try {
      const res = await fetch(`/api/professor/courses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      if (!res.ok) throw new Error('Erreur API');
      setToast({ type: 'success', message: 'Cours ajouté !' });
      setShowModal(false);
      setForm({ title: '', professor: '', progress: 0 });
      fetchCourses();
    } catch {
      setFormError('Erreur lors de l\'ajout.');
      setToast({ type: 'error', message: 'Erreur lors de l\'ajout.' });
    } finally {
      setFormLoading(false);
    }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    if (!form.title.trim() || !form.professor.trim() || isNaN(form.progress)) {
      setFormError('Titre, professeur et progression requis.');
      return;
    }
    setFormLoading(true);
    try {
      const res = await fetch(`/api/professor/courses/${editId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      if (!res.ok) throw new Error('Erreur API');
      setToast({ type: 'success', message: 'Cours modifié !' });
      setShowModal(false);
      setForm({ title: '', professor: '', progress: 0 });
      setEditId(undefined);
      fetchCourses();
    } catch {
      setFormError('Erreur lors de la modification.');
      setToast({ type: 'error', message: 'Erreur lors de la modification.' });
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id: number | string | undefined) => {
    if (!id) return;
    setDeleteLoading(id);
    try {
      const res = await fetch(`/api/professor/courses/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Erreur API');
      setToast({ type: 'success', message: 'Cours supprimé !' });
      fetchCourses();
    } catch {
      setToast({ type: 'error', message: 'Erreur lors de la suppression.' });
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Liste des cours', 14, 18);
    autoTable(doc, {
      startY: 28,
      head: [['Titre', 'Professeur', 'Progression']],
      body: filteredCourses.map(c => [c.title, c.professor, `${c.progress}%`]),
      theme: 'striped',
      headStyles: { fillColor: [59, 130, 246] },
      styles: { fontSize: 12 },
    });
    doc.save('cours.pdf');
  };

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <div className="flex items-center gap-3 mb-8">
        <BookOpen className="w-10 h-10 text-blue-400 dark:text-blue-200" aria-label="Icône cours" />
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">Gestion des cours</h1>
        <button
          className="ml-auto flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 font-semibold shadow hover:bg-blue-200 dark:hover:bg-blue-800 transition focus:outline-none focus:ring-2 focus:ring-blue-400"
          aria-label="Exporter en PDF"
          onClick={handleExportPDF}
          type="button"
        >
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5 text-blue-500"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/></svg>
          <span>Exporter en PDF</span>
        </button>
        <button
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 font-semibold shadow hover:bg-blue-200 dark:hover:bg-blue-800 transition focus:outline-none focus:ring-2 focus:ring-blue-400"
          aria-label="Ajouter un cours"
          onClick={() => { setShowModal(true); setModalType('add'); setForm({ title: '', professor: '', progress: 0 }); }}
        >
          <PlusCircle className="w-5 h-5" />
          <span>Ajouter un cours</span>
        </button>
      </div>
      {/* Barre de recherche et filtres */}
      <div className="flex flex-wrap gap-2 mb-6 items-center">
        <input
          type="text"
          placeholder="Rechercher un cours..."
          className="input input-bordered rounded-full px-4 py-2 w-full sm:w-64 focus:ring-2 focus:ring-blue-400"
          value={search}
          onChange={e => setSearch(e.target.value)}
          aria-label="Rechercher un cours"
        />
        <span className="ml-2 font-semibold text-xs text-gray-500">Filtrer :</span>
        <button onClick={() => setProgressFilter('all')} className={`px-3 py-1 rounded-full font-semibold text-xs ${progressFilter==='all' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-200'} transition`}>Tous</button>
        <button onClick={() => setProgressFilter('high')} className={`px-3 py-1 rounded-full font-semibold text-xs ${progressFilter==='high' ? 'bg-green-500 text-white' : 'bg-green-100 text-green-700 dark:bg-gray-800 dark:text-green-300'} transition`}>≥ 80%</button>
        <button onClick={() => setProgressFilter('mid')} className={`px-3 py-1 rounded-full font-semibold text-xs ${progressFilter==='mid' ? 'bg-amber-500 text-white' : 'bg-amber-100 text-amber-700 dark:bg-gray-800 dark:text-amber-300'} transition`}>50-79%</button>
        <button onClick={() => setProgressFilter('low')} className={`px-3 py-1 rounded-full font-semibold text-xs ${progressFilter==='low' ? 'bg-red-500 text-white' : 'bg-red-100 text-red-700 dark:bg-gray-800 dark:text-red-300'} transition`}>&lt; 50%</button>
        <span className="ml-4 text-xs text-gray-400">{filteredCourses.length} résultat(s)</span>
      </div>
      {loading ? (
        <div className="text-center text-lg text-gray-500">Chargement...</div>
      ) : courses.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <BookOpen className="w-16 h-16 text-blue-200 mb-4" />
          <p className="text-lg text-gray-500">Aucun cours trouvé.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {filteredCourses.map((c, i) => (
            <div
              key={c.id || i}
              className="bg-white/95 dark:bg-gray-900/90 rounded-2xl shadow-lg p-6 flex flex-col gap-4 hover:shadow-2xl transition group border-0 min-h-[120px] animate-fadeIn"
              tabIndex={0}
              aria-label={`Cours : ${c.title}`}
            >
              <div className="flex items-center gap-4 mb-2">
                <div className="rounded-full shadow flex items-center justify-center bg-blue-100 text-blue-600 w-14 h-14 group-hover:scale-110 transition-transform">
                  <BookOpen className="w-8 h-8" aria-label="Icône cours" />
                </div>
                <div className="flex-1">
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors">{c.title}</h2>
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mt-1">
                    <span className="font-semibold">Professeur :</span> {c.professor}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                <span className="flex items-center gap-1">
                  <span className="font-semibold">Progression :</span>
                  <span className={`ml-2 px-2 py-1 rounded-full text-xs font-bold ${getProgressColor(c.progress)}`}>{c.progress}%</span>
                </span>
              </div>
              <div className="flex gap-2 justify-end mt-2">
                <button
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-200 font-semibold shadow hover:bg-amber-200 dark:hover:bg-amber-800 transition focus:outline-none focus:ring-2 focus:ring-amber-400"
                  aria-label={`Modifier le cours ${c.title}`}
                  onClick={() => { setShowModal(true); setModalType('edit'); setForm({ title: c.title, professor: c.professor, progress: c.progress, id: c.id }); setEditId(c.id); }}
                >
                  <Edit className="w-4 h-4" /> Modifier
                </button>
                <button
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 font-semibold shadow hover:bg-red-200 dark:hover:bg-red-800 transition focus:outline-none focus:ring-2 focus:ring-red-400"
                  aria-label={`Supprimer le cours ${c.title}`}
                  onClick={() => handleDelete(c.id)}
                  disabled={deleteLoading === c.id}
                >
                  <Trash2 className="w-4 h-4" /> {deleteLoading === c.id ? 'Suppression...' : 'Supprimer'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      {/* Modal ajout/modif */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" role="dialog" aria-modal="true">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8 max-w-md w-full relative animate-fadeIn">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-red-500 focus:outline-none"
              onClick={() => { setShowModal(false); setForm({ title: '', professor: '', progress: 0 }); setEditId(undefined); }}
              aria-label="Fermer le formulaire"
            >
              <XCircle className="w-7 h-7" />
            </button>
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <PlusCircle className="w-6 h-6 text-blue-400" /> {modalType === 'add' ? 'Ajouter un cours' : 'Modifier le cours'}
            </h3>
            <form className="flex flex-col gap-4" onSubmit={modalType === 'add' ? handleAdd : handleEdit}>
              <input
                type="text"
                className="input input-bordered rounded-lg px-4 py-2"
                placeholder="Titre du cours"
                value={form.title}
                onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                required
              />
              <input
                type="text"
                className="input input-bordered rounded-lg px-4 py-2"
                placeholder="Professeur"
                value={form.professor}
                onChange={e => setForm(f => ({ ...f, professor: e.target.value }))}
                required
              />
              <input
                type="number"
                className="input input-bordered rounded-lg px-4 py-2"
                placeholder="Progression (%)"
                min={0}
                max={100}
                value={form.progress}
                onChange={e => setForm(f => ({ ...f, progress: Number(e.target.value) }))}
                required
              />
              {formError && <div className="text-red-500 text-sm">{formError}</div>}
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 font-semibold shadow hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                  onClick={() => { setShowModal(false); setForm({ title: '', professor: '', progress: 0 }); setEditId(undefined); }}
                  disabled={formLoading}
                >Annuler</button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 font-semibold shadow hover:bg-blue-200 dark:hover:bg-blue-800 transition"
                  disabled={formLoading}
                >{formLoading ? (modalType === 'add' ? 'Ajout...' : 'Modification...') : (modalType === 'add' ? 'Ajouter' : 'Modifier')}</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Toast */}
      {toast && (
        <div className={`fixed top-6 right-6 z-50 px-4 py-2 rounded-xl shadow-lg text-white font-semibold ${toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>{toast.message}</div>
      )}
    </div>
  );
};

export default ProfessorMyCourses;
