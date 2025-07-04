import React, { useEffect, useState } from "react";
import { useAuth } from '@/contexts/AuthContext';
import { BookOpen, PlusCircle, Edit, Trash2, XCircle } from "lucide-react";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useLanguage } from '@/contexts/LanguageContext';

interface Course {
  id?: number | string;
  title: string;
  professor: string;
  progress: number;
}

const getProgressColor = (progress: number) => {
  if (progress >= 80) return "bg-green-100 text-green-700";
  if (progress >= 50) return "bg-amber-100 text-amber-700";
  return "bg-red-100 text-red-700";
};

const ProfessorMyCourses: React.FC = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
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
    if (!user?.id) return;
    setLoading(true);
    fetch(`/api/professor/courses?professorId=${user.id}`)
      .then((res) => res.json())
      .then((data) => setCourses(data))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchCourses(); }, [user?.id]);

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
    doc.text(t('professor.coursesPdfTitle'), 14, 18);
    autoTable(doc, {
      startY: 28,
      head: [[t('professor.coursesTable.title'), t('professor.coursesTable.professor'), t('professor.coursesTable.progress')]],
      body: filteredCourses.map(c => [c.title, c.professor, `${c.progress}%`]),
      theme: 'striped',
      headStyles: { fillColor: [59, 130, 246] },
      styles: { fontSize: 12 },
    });
    doc.save(t('professor.coursesPdfFile'));
  };

  return (
    <div className="p-6 w-full h-full flex flex-col">
      <h1 className="text-3xl font-extrabold tracking-tight mb-6">{t('professor.myCourses')}</h1>
      <div className="overflow-x-auto rounded-lg shadow bg-white dark:bg-gray-800">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th className="p-3 text-left font-semibold">{t('professor.coursesTable.title')}</th>
              <th className="p-3 text-left font-semibold">{t('professor.coursesTable.professor')}</th>
              <th className="p-3 text-left font-semibold">{t('professor.coursesTable.progress')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {loading ? (
              <tr>
                <td colSpan={3} className="p-4 text-center">
                  {t('common.loading')}
                </td>
              </tr>
            ) : courses.length === 0 ? (
              <tr>
                <td colSpan={3} className="p-4 text-center">
                  {t('professor.noCoursesFound')}
                </td>
              </tr>
            ) : (
              courses.map((c, i) => (
                <tr
                  key={i}
                  className="hover:bg-gray-50 dark:hover:bg-gray-900 transition"
                >
                  <td className="p-3 font-medium">{c.title}</td>
                  <td className="p-3">{c.professor}</td>
                  <td className="p-3">
                    <div className="w-full bg-gray-200 rounded-full h-3 dark:bg-gray-700">
                      <div
                        className="bg-blue-500 h-3 rounded-full"
                        style={{ width: `${c.progress}%` }}
                      ></div>
                    </div>
                    <span className="text-xs ml-2">{c.progress}%</span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProfessorMyCourses;
