import React, { useEffect, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BookOpen, Users, Clock, TrendingUp, Calculator, Atom, Plus, Edit, Trash2, FileText, CheckCircle, XCircle, PlusCircle } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const PROFESSOR_ID = 1; // À remplacer par l'ID dynamique du professeur connecté

// Types explicites pour chaque entité
interface Course {
  id?: number | string;
  title?: string;
  name?: string;
  professor?: string;
  professorId?: number | string;
  students?: string;
  progress?: number;
}
interface Student {
  id?: number | string;
  name?: string;
  email?: string;
  enrolledCourses?: string[];
}
interface Assignment {
  id?: number | string;
  title?: string;
  course?: string;
  courseId?: number | string;
  dueDate?: string;
  status?: string;
  grade?: string | number;
}
interface Grade {
  subject?: string;
  grade?: number;
}
interface GradesResponse {
  average: number | null;
  subjects: Grade[];
}
interface Submission {
  assignment?: string;
  student?: string;
  status?: string;
  submittedAt?: string;
  grade?: string | number;
  gradedAt?: string;
}

const ProfessorDashboard: React.FC = () => {
  const { t } = useLanguage();

  const [courses, setCourses] = useState<Course[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [grades, setGrades] = useState<GradesResponse>({ average: null, subjects: [] });
  const [recentSubmissions, setRecentSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'add' | 'edit'>('add');
  const [form, setForm] = useState<Course>({ title: '', professor: '', progress: 0 });
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const [editId, setEditId] = useState<number | string | undefined>(undefined);
  const [deleteLoading, setDeleteLoading] = useState<string | number | null>(null);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [search, setSearch] = useState("");
  const [progressFilter, setProgressFilter] = useState<'all' | 'high' | 'mid' | 'low'>('all');

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const [coursesRes, studentsRes, assignmentsRes, gradesRes] = await Promise.all([
        fetch(`/api/professor/courses?professorId=${PROFESSOR_ID}`),
        fetch(`/api/professor/students?professorId=${PROFESSOR_ID}`),
        fetch(`/api/professor/assignments?professorId=${PROFESSOR_ID}`),
        fetch(`/api/professor/grades?professorId=${PROFESSOR_ID}`),
      ]);
      setCourses(await coursesRes.json());
      setStudents(await studentsRes.json());
      setAssignments(await assignmentsRes.json());
      setGrades(await gradesRes.json());
      // Pour les soumissions récentes, on peut utiliser assignments ou une future route /api/professor/submissions
      setRecentSubmissions([]); // À implémenter si tu as la donnée
      setLoading(false);
    }
    fetchData();
  }, []);

  // Toast auto-hide
  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(t);
    }
  }, [toast]);

  // Filtrage et recherche
  const filteredCourses = courses.filter(c => {
    const matchSearch = (c.title || c.name || '').toLowerCase().includes(search.toLowerCase());
    let matchProgress = true;
    if (progressFilter === 'high') matchProgress = (c.progress ?? 0) >= 80;
    else if (progressFilter === 'mid') matchProgress = (c.progress ?? 0) >= 50 && (c.progress ?? 0) < 80;
    else if (progressFilter === 'low') matchProgress = (c.progress ?? 0) < 50;
    return matchSearch && matchProgress;
  });

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    if (!form.title?.trim() || !form.professor?.trim() || isNaN(form.progress ?? 0)) {
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
    if (!form.title?.trim() || !form.professor?.trim() || isNaN(form.progress ?? 0)) {
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
      body: filteredCourses.map(c => [
        (c.title || c.name || ''),
        (c.professor || ''),
        `${c.progress ?? 0}%`
      ]),
      theme: 'striped',
      headStyles: { fillColor: [59, 130, 246] },
      styles: { fontSize: 12 },
    });
    doc.save('cours.pdf');
  };

  const fetchCourses = () => {
    fetch(`/api/professor/courses?professorId=${PROFESSOR_ID}`)
      .then((res) => res.json())
      .then((data) => setCourses(data));
  };

  // Statistiques dynamiques
  const stats = [
    {
      title: t('professor.activeCourses'),
      value: courses.length,
      icon: <BookOpen className="h-5 w-5" />,
      color: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900',
    },
    {
      title: t('professor.totalStudents'),
      value: students.length,
      icon: <Users className="h-5 w-5" />,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-900',
    },
    {
      title: t('professor.pendingReviews'),
      value: assignments.filter(a => a.status === 'pending' || a.status === 'En attente').length,
      icon: <Clock className="h-5 w-5" />,
      color: 'text-amber-600',
      bgColor: 'bg-amber-100 dark:bg-amber-900',
    },
    {
      title: t('professor.classAverage'),
      value: grades.average !== null ? `${grades.average.toFixed(2)}/20` : '--',
      icon: <TrendingUp className="h-5 w-5" />,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100 dark:bg-purple-900',
    },
  ];

  if (loading) return <div className="p-10 text-center">Chargement...</div>;

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {t('professor.dashboard')}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage your courses, assignments, and student progress.
        </p>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                  <div className={stat.color}>{stat.icon}</div>
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Course Management & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Gestion des cours modernisée */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Gestion des cours</CardTitle>
            <div className="flex gap-2">
              <Button className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 font-semibold shadow hover:bg-blue-200 dark:hover:bg-blue-800 transition focus:outline-none focus:ring-2 focus:ring-blue-400" onClick={handleExportPDF} type="button">
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5 text-blue-500"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/></svg>
                Exporter en PDF
              </Button>
              <Button className="bg-secondary hover:bg-green-600" onClick={() => { setShowModal(true); setModalType('add'); setForm({ title: '', professor: '', progress: 0 }); }}>
                <Plus className="h-4 w-4 mr-2" /> Ajouter un cours
              </Button>
            </div>
          </CardHeader>
          <CardContent>
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
            <div className="space-y-4">
              {filteredCourses.map((course, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg animate-fadeIn">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                      <div className="text-primary"><BookOpen className="h-5 w-5" /></div>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">{course.title || course.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{course.professor}</p>
                      <span className={`ml-2 px-2 py-1 rounded-full text-xs font-bold ${course.progress !== undefined ? (course.progress >= 80 ? 'bg-green-100 text-green-700' : course.progress >= 50 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700') : ''}`}>{course.progress ?? 0}%</span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-800" onClick={() => { setShowModal(true); setModalType('edit'); setForm({ title: course.title || course.name || '', professor: course.professor || '', progress: course.progress ?? 0, id: course.id }); setEditId(course.id); }}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-800" onClick={() => handleDelete(course.id)} disabled={deleteLoading === course.id}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        {/* Recent Submissions */}
        <Card>
          <CardHeader>
            <CardTitle>{t('professor.recentSubmissions')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentSubmissions.length === 0 ? (
                <div className="text-gray-500">Aucune soumission récente.</div>
              ) : recentSubmissions.map((submission, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                      <div className="text-primary"><FileText className="h-5 w-5" /></div>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">{submission.assignment}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{submission.student}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant={submission.status === 'pending' ? 'destructive' : 'default'}>
                      {submission.status === 'pending' ? 'Pending Review' : submission.grade}
                    </Badge>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {submission.submittedAt || submission.gradedAt}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
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

export default ProfessorDashboard;
