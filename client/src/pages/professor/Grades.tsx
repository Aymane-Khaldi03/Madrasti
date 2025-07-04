import React, { useEffect, useState } from "react";
import { useAuth } from '@/contexts/AuthContext';
import { Award, BookOpen, PlusCircle, Edit, Trash2, XCircle } from "lucide-react";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useLanguage } from '@/contexts/LanguageContext';

interface SubjectGrade {
  id?: number | string;
  subject: string;
  grade: number;
}

interface GradesData {
  average: number;
  subjects: SubjectGrade[];
}

const getGradeColor = (grade: number) => {
  if (grade >= 15) return "bg-green-100 text-green-700";
  if (grade >= 10) return "bg-amber-100 text-amber-700";
  return "bg-red-100 text-red-700";
};

const ProfessorGrades = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [grades, setGrades] = useState<GradesData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'add' | 'edit'>("add");
  const [form, setForm] = useState<SubjectGrade>({ subject: '', grade: 0 });
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const [editId, setEditId] = useState<number | string | undefined>(undefined);
  const [deleteLoading, setDeleteLoading] = useState<string | number | null>(null);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [search, setSearch] = useState("");
  const [gradeFilter, setGradeFilter] = useState<'all' | 'high' | 'mid' | 'low'>('all');

  const fetchGrades = () => {
    if (!user?.id) return;
    setLoading(true);
    fetch(`/api/professor/grades?professorId=${user.id}`)
      .then((res) => res.json())
      .then((data) => setGrades(data))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchGrades(); }, [user?.id]);

  // Toast auto-hide
  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(t);
    }
  }, [toast]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    if (!form.subject.trim() || isNaN(form.grade)) {
      setFormError(t('professor.subjectAndGradeRequired'));
      return;
    }
    setFormLoading(true);
    try {
      const res = await fetch(`/api/professor/grades`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      if (!res.ok) throw new Error('Erreur API');
      setToast({ type: 'success', message: t('professor.gradeAdded') });
      setShowModal(false);
      setForm({ subject: '', grade: 0 });
      fetchGrades();
    } catch {
      setFormError(t('professor.addError'));
      setToast({ type: 'error', message: t('professor.addError') });
    } finally {
      setFormLoading(false);
    }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    if (!form.subject.trim() || isNaN(form.grade)) {
      setFormError(t('professor.subjectAndGradeRequired'));
      return;
    }
    setFormLoading(true);
    try {
      const res = await fetch(`/api/professor/grades/${editId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      if (!res.ok) throw new Error('Erreur API');
      setToast({ type: 'success', message: t('professor.gradeModified') });
      setShowModal(false);
      setForm({ subject: '', grade: 0 });
      setEditId(undefined);
      fetchGrades();
    } catch {
      setFormError(t('professor.editError'));
      setToast({ type: 'error', message: t('professor.editError') });
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id: number | string | undefined) => {
    if (!id) return;
    setDeleteLoading(id);
    try {
      const res = await fetch(`/api/professor/grades/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Erreur API');
      setToast({ type: 'success', message: t('professor.gradeDeleted') });
      fetchGrades();
    } catch {
      setToast({ type: 'error', message: t('professor.deleteError') });
    } finally {
      setDeleteLoading(null);
    }
  };

  // Filtrage et recherche
  const filteredSubjects = grades?.subjects.filter(s => {
    const matchSearch = s.subject.toLowerCase().includes(search.toLowerCase());
    let matchGrade = true;
    if (gradeFilter === 'high') matchGrade = s.grade >= 15;
    else if (gradeFilter === 'mid') matchGrade = s.grade >= 10 && s.grade < 15;
    else if (gradeFilter === 'low') matchGrade = s.grade < 10;
    return matchSearch && matchGrade;
  }) || [];

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text(t('professor.gradesPdfTitle'), 14, 18);
    doc.setFontSize(12);
    doc.text(`${t('professor.gradesAverage')}: ${grades?.average ?? '-'} / 20`, 14, 28);
    autoTable(doc, {
      startY: 36,
      head: [[t('professor.gradesTable.subject'), t('professor.gradesTable.grade')]],
      body: filteredSubjects.map(s => [s.subject, `${s.grade}/20`]),
      theme: 'striped',
      headStyles: { fillColor: [59, 130, 246] },
      styles: { fontSize: 12 },
    });
    doc.save(t('professor.gradesPdfFile'));
  };

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <div className="flex items-center gap-3 mb-8">
        <Award className="w-10 h-10 text-blue-400 dark:text-blue-200" aria-label={t('professor.gradesIconAria')} />
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">{t('professor.gradesTitle')}</h1>
        <button
          className="ml-auto flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 font-semibold shadow hover:bg-blue-200 dark:hover:bg-blue-800 transition focus:outline-none focus:ring-2 focus:ring-blue-400"
          aria-label={t('professor.exportPdfAria')}
          onClick={handleExportPDF}
          type="button"
        >
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5 text-blue-500"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/></svg>
          <span>{t('professor.exportPdf')}</span>
        </button>
        <button
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 font-semibold shadow hover:bg-blue-200 dark:hover:bg-blue-800 transition focus:outline-none focus:ring-2 focus:ring-blue-400"
          aria-label={t('professor.addGradeAria')}
          onClick={() => { setShowModal(true); setModalType('add'); setForm({ subject: '', grade: 0 }); }}
        >
          <PlusCircle className="w-5 h-5" />
          <span>{t('professor.addGrade')}</span>
        </button>
      </div>
      {/* Barre de recherche et filtres */}
      <div className="flex flex-wrap gap-2 mb-6 items-center">
        <input
          type="text"
          placeholder={t('professor.gradesSearchPlaceholder')}
          className="input input-bordered rounded-full px-4 py-2 w-full sm:w-64 focus:ring-2 focus:ring-blue-400"
          value={search}
          onChange={e => setSearch(e.target.value)}
          aria-label={t('professor.gradesSearchAria')}
        />
        <span className="ml-2 font-semibold text-xs text-gray-500">{t('professor.filter')}:</span>
        <button onClick={() => setGradeFilter('all')} className={`px-3 py-1 rounded-full font-semibold text-xs ${gradeFilter==='all' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-200'} transition`}>{t('professor.filterAll')}</button>
        <button onClick={() => setGradeFilter('high')} className={`px-3 py-1 rounded-full font-semibold text-xs ${gradeFilter==='high' ? 'bg-green-500 text-white' : 'bg-green-100 text-green-700 dark:bg-gray-800 dark:text-green-300'} transition`}>{t('professor.filterHigh')}</button>
        <button onClick={() => setGradeFilter('mid')} className={`px-3 py-1 rounded-full font-semibold text-xs ${gradeFilter==='mid' ? 'bg-amber-500 text-white' : 'bg-amber-100 text-amber-700 dark:bg-gray-800 dark:text-amber-300'} transition`}>{t('professor.filterMid')}</button>
        <button onClick={() => setGradeFilter('low')} className={`px-3 py-1 rounded-full font-semibold text-xs ${gradeFilter==='low' ? 'bg-red-500 text-white' : 'bg-red-100 text-red-700 dark:bg-gray-800 dark:text-red-300'} transition`}>{t('professor.filterLow')}</button>
        <span className="ml-4 text-xs text-gray-400">{filteredSubjects.length} {t('professor.results')}</span>
      </div>
      {loading ? (
        <div className="text-center text-lg text-gray-500">{t('common.loading')}</div>
      ) : grades ? (
        <>
          <div className="mb-8 flex items-center gap-4">
            <span className="font-semibold text-lg text-gray-700 dark:text-gray-200">{t('professor.gradesAverage')}:</span>
            <span
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xl font-bold shadow ${getGradeColor(grades.average)}`}
              aria-label={`${t('professor.gradesAverage')}: ${grades.average}/20`}
            >
              <Award className="w-5 h-5 text-yellow-400" aria-label={t('professor.starAria')} />
              {grades.average}/20
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {filteredSubjects.map((s, i) => (
              <div
                key={s.id || i}
                className="bg-white/95 dark:bg-gray-900/90 rounded-2xl shadow-lg p-6 flex flex-col gap-4 hover:shadow-2xl transition group border-0 min-h-[120px] animate-fadeIn"
                tabIndex={0}
                aria-label={`${t('professor.gradeOf')} ${s.subject}`}
              >
                <div className="flex items-center gap-4 mb-2">
                  <div className="rounded-full shadow flex items-center justify-center bg-blue-100 text-blue-600 w-14 h-14 group-hover:scale-110 transition-transform">
                    <BookOpen className="w-8 h-8" aria-label={t('professor.subjectIconAria')} />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors">{s.subject}</h2>
                  </div>
                  <span
                    className={`px-4 py-2 rounded-full text-lg font-bold flex items-center gap-1 ${getGradeColor(s.grade)}`}
                    aria-label={`${t('professor.grade')}: ${s.grade}/20`}
                  >
                    {s.grade}/20
                  </span>
                </div>
                <div className="flex gap-2 justify-end mt-2">
                  <button
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-200 font-semibold shadow hover:bg-amber-200 dark:hover:bg-amber-800 transition focus:outline-none focus:ring-2 focus:ring-amber-400"
                    aria-label={`${t('professor.editGradeAria')} ${s.subject}`}
                    onClick={() => { setShowModal(true); setModalType('edit'); setForm({ subject: s.subject, grade: s.grade, id: s.id }); setEditId(s.id); }}
                  >
                    <Edit className="w-4 h-4" /> {t('professor.edit')}
                  </button>
                  <button
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 font-semibold shadow hover:bg-red-200 dark:hover:bg-red-800 transition focus:outline-none focus:ring-2 focus:ring-red-400"
                    aria-label={`${t('professor.deleteGradeAria')} ${s.subject}`}
                    onClick={() => handleDelete(s.id)}
                    disabled={deleteLoading === s.id}
                  >
                    <Trash2 className="w-4 h-4" /> {deleteLoading === s.id ? t('professor.deleting') : t('professor.delete')}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-20">
          <Award className="w-16 h-16 text-blue-200 mb-4" />
          <p className="text-lg text-gray-500">{t('professor.noGrades')}</p>
        </div>
      )}
      {/* Modal ajout/modif */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" role="dialog" aria-modal="true">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8 max-w-md w-full relative animate-fadeIn">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-red-500 focus:outline-none"
              onClick={() => { setShowModal(false); setForm({ subject: '', grade: 0 }); setEditId(undefined); }}
              aria-label={t('professor.closeFormAria')}
            >
              <XCircle className="w-7 h-7" />
            </button>
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <PlusCircle className="w-6 h-6 text-blue-400" /> {modalType === 'add' ? t('professor.addGrade') : t('professor.editGrade')}
            </h3>
            <form className="flex flex-col gap-4" onSubmit={modalType === 'add' ? handleAdd : handleEdit}>
              <input
                type="text"
                className="input input-bordered rounded-lg px-4 py-2"
                placeholder={t('professor.subjectPlaceholder')}
                value={form.subject}
                onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
                required
              />
              <input
                type="number"
                className="input input-bordered rounded-lg px-4 py-2"
                placeholder={t('professor.gradePlaceholder')}
                min={0}
                max={20}
                value={form.grade}
                onChange={e => setForm(f => ({ ...f, grade: Number(e.target.value) }))}
                required
              />
              {formError && <div className="text-red-500 text-sm">{formError}</div>}
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 font-semibold shadow hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                  onClick={() => { setShowModal(false); setForm({ subject: '', grade: 0 }); setEditId(undefined); }}
                  disabled={formLoading}
                >{t('common.cancel')}</button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 font-semibold shadow hover:bg-blue-200 dark:hover:bg-blue-800 transition"
                  disabled={formLoading}
                >{formLoading ? (modalType === 'add' ? t('professor.adding') : t('professor.editing')) : (modalType === 'add' ? t('professor.addGrade') : t('professor.editGrade'))}</button>
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

export default ProfessorGrades;
