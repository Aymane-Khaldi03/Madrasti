import React, { useEffect, useState, useRef } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';

interface Course {
  id: string;
  title: string;
  professor: string; // id du prof
  class: string;
  schedule: string | { day?: string; start?: string; end?: string; room?: string };
}

const emptyCourse: Omit<Course, 'id'> = { title: '', professor: '', class: '', schedule: '' };
const PAGE_SIZE = 10;

const CoursesPage = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [currentCourse, setCurrentCourse] = useState<Course | null>(null);
  const [form, setForm] = useState<Omit<Course, 'id'>>(emptyCourse);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const { toast } = useToast();
  const inputRef = useRef<HTMLInputElement>(null);
  const [professors, setProfessors] = useState<{ id: string; name: string }[]>([]);
  const { t } = useLanguage();

  // Fetch courses
  const fetchCourses = async () => {
    setLoading(true);
    setError(null);
    try {
      const querySnapshot = await getDocs(collection(db, 'courses'));
      const coursesData: Course[] = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Course));
      setCourses(coursesData);
    } catch (err) {
      setError('Erreur lors du chargement des cours');
    } finally {
      setLoading(false);
    }
  };

  // Fetch professors
  const fetchProfessors = async () => {
    const q = query(collection(db, 'users'), where('role', '==', 'professor'));
    const snap = await getDocs(q);
    setProfessors(snap.docs.map(doc => ({ id: doc.id, name: doc.data().name })));
  };

  useEffect(() => {
    fetchCourses();
    fetchProfessors();
  }, []);

  // Pagination + recherche
  const filteredCourses = courses.filter(c =>
    (c.title || '').toLowerCase().includes(search.toLowerCase()) ||
    (c.class || '').toLowerCase().includes(search.toLowerCase()) ||
    (typeof c.schedule === 'string'
      ? c.schedule.toLowerCase()
      : `${c.schedule?.day || ''} ${c.schedule?.start || ''}-${c.schedule?.end || ''} ${c.schedule?.room || ''}`.toLowerCase()
    ).includes(search.toLowerCase()) ||
    (professors.find(p => p.id === c.professor)?.name?.toLowerCase().includes(search.toLowerCase()) ?? false)
  );
  const pageCount = Math.ceil(filteredCourses.length / PAGE_SIZE);
  const paginatedCourses = filteredCourses.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Ouvre la modale pour ajouter
  const openAddModal = () => {
    setModalMode('add');
    setForm(emptyCourse);
    setCurrentCourse(null);
    setFormError(null);
    setModalOpen(true);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  // Ouvre la modale pour modifier
  const openEditModal = (course: Course) => {
    setModalMode('edit');
    setForm({ title: course.title, professor: course.professor, class: course.class, schedule: course.schedule });
    setCurrentCourse(course);
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
      if (modalMode === 'add') {
        await addDoc(collection(db, 'courses'), form);
        toast({ title: t('courses.success'), description: t('courses.added') });
      } else if (modalMode === 'edit' && currentCourse) {
        await updateDoc(doc(db, 'courses', currentCourse.id), form);
        toast({ title: t('courses.success'), description: t('courses.updated') });
      }
      closeModal();
      fetchCourses();
    } catch (err) {
      setFormError(t('courses.saveError'));
      toast({ title: t('courses.error'), description: t('courses.saveError') });
    } finally {
      setFormLoading(false);
    }
  };

  // Suppression
  const handleDelete = async (course: Course) => {
    if (!window.confirm(t('courses.confirmDelete') + ' ' + course.title)) return;
    try {
      await deleteDoc(doc(db, 'courses', course.id));
      toast({ title: t('courses.success'), description: t('courses.deleted') });
      fetchCourses();
    } catch (err) {
      setError(t('courses.deleteError'));
      toast({ title: t('courses.error'), description: t('courses.deleteError') });
    }
  };

  // Pagination controls
  const handlePrev = () => setPage(p => Math.max(1, p - 1));
  const handleNext = () => setPage(p => Math.min(pageCount, p + 1));

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 transition-colors duration-500">
      <main className="flex-1 p-4 md:p-8">
        <h1 className="text-3xl font-extrabold mb-6 text-gray-800 dark:text-white tracking-tight flex items-center gap-2">
          <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-blue-500"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2a4 4 0 014-4h3m-7 4v2a4 4 0 004 4h3m-7-4H5a2 2 0 01-2-2V7a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3"/></svg>
          {t('courses.title')}
        </h1>
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-4 mb-8 transition-all duration-300">
          <div className="flex justify-between items-center mb-4 flex-col md:flex-row gap-2">
            <input
              type="text"
              placeholder={t('courses.searchPlaceholder')}
              className="input input-bordered w-full md:w-1/3 rounded-full px-4 py-2 focus:ring-2 focus:ring-blue-400"
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              aria-label={t('courses.searchAria')}
            />
            <button className="flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 text-white font-bold shadow-lg backdrop-blur-md hover:from-blue-600 hover:to-indigo-600 hover:shadow-xl transition-all focus:ring-2 focus:ring-blue-300 outline-none" onClick={openAddModal} aria-label={t('courses.addCourseAria')}>
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/></svg>
              {t('common.add')}
            </button>
          </div>
          {loading ? (
            <div className="text-center py-8 text-gray-500 animate-pulse">{t('common.loading')}</div>
          ) : error ? (
            <div className="text-center py-8 text-red-500">{t('courses.errorLoading')}</div>
          ) : (
            <div className="overflow-x-auto rounded-xl">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800 text-sm">
                <thead>
                  <tr className="bg-blue-50 dark:bg-gray-800">
                    <th className="px-6 py-2 text-left font-semibold">{t('courses.table.title')}</th>
                    <th className="px-6 py-2 text-left font-semibold">{t('courses.table.professor')}</th>
                    <th className="px-6 py-2 text-left font-semibold">{t('courses.table.class')}</th>
                    <th className="px-6 py-2 text-left font-semibold">{t('courses.table.schedule')}</th>
                    <th className="px-6 py-2 text-left font-semibold">{t('courses.table.actions')}</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedCourses.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center py-4 text-gray-400">{t('courses.noCourses')}</td>
                    </tr>
                  ) : (
                    paginatedCourses.map((course, idx) => (
                      <tr key={course.id} className={`transition-colors ${idx % 2 === 0 ? 'bg-gray-50 dark:bg-gray-800' : 'bg-white dark:bg-gray-900'} hover:bg-blue-100 dark:hover:bg-blue-950`}>
                        <td className="px-6 py-2 font-semibold text-gray-800 dark:text-white">{course.title}</td>
                        <td className="px-6 py-2">
                          <span className="px-2 py-1 rounded-full text-xs font-bold bg-blue-500 text-white">
                            {professors.find(p => p.id === course.professor)?.name || '—'}
                          </span>
                        </td>
                        <td className="px-6 py-2 text-gray-600 dark:text-gray-300">{course.class}</td>
                        <td className="px-6 py-2 text-gray-600 dark:text-gray-300">{
                          typeof course.schedule === 'string'
                            ? course.schedule
                            : course.schedule
                              ? `${course.schedule.day || ''} ${course.schedule.start || ''}-${course.schedule.end || ''} ${course.schedule.room || ''}`.trim()
                              : ''
                        }</td>
                        <td className="px-6 py-2 flex gap-2">
                          <button className="flex items-center gap-1 px-2.5 py-1 rounded-full text-sm bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 font-medium shadow-sm hover:bg-blue-200 dark:hover:bg-blue-800 transition-all focus:ring-2 focus:ring-blue-300 outline-none" onClick={() => openEditModal(course)} aria-label={t('courses.editAria')}>
                            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a2 2 0 01-2.828 0L9 13zm0 0V17h4"/></svg>
                            {t('common.edit')}
                          </button>
                          <button className="flex items-center gap-1 px-2.5 py-1 rounded-full text-sm bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 font-medium shadow-sm hover:bg-red-200 dark:hover:bg-red-800 transition-all focus:ring-2 focus:ring-red-300 outline-none" onClick={() => handleDelete(course)} aria-label={t('courses.deleteAria')}>
                            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
                            {t('common.delete')}
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
                  <button className="btn btn-sm rounded-full" onClick={handlePrev} disabled={page === 1} aria-label={t('courses.prevPageAria')}>{t('courses.prev')}</button>
                  <span className="font-semibold">{t('courses.page')} {page} / {pageCount}</span>
                  <button className="btn btn-sm rounded-full" onClick={handleNext} disabled={page === pageCount} aria-label={t('courses.nextPageAria')}>{t('courses.next')}</button>
                </div>
              )}
            </div>
          )}
        </div>
        {/* Modale d'ajout/édition */}
        {modalOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="absolute inset-0 bg-black bg-opacity-40 backdrop-blur-sm transition-opacity duration-300" onClick={closeModal} aria-label={t('courses.closeModalAria')} />
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8 w-full max-w-md relative z-10 animate-fade-in">
              <button className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 dark:hover:text-white text-2xl font-bold focus:outline-none" onClick={closeModal} aria-label={t('courses.closeModalAria')}>
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
              <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">{modalMode === 'add' ? t('courses.addTitle') : t('courses.editTitle')}</h2>
              <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-200">{t('courses.table.title')}</label>
                <input
                  ref={inputRef}
                  type="text"
                  name="title"
                  placeholder={t('courses.titlePlaceholder')}
                  className="input input-bordered rounded-lg px-4 py-2"
                  value={form.title}
                  onChange={handleFormChange}
                  required
                />
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-200">{t('courses.table.professor')}</label>
                <select
                  name="professor"
                  className="select select-bordered rounded-lg px-4 py-2"
                  value={form.professor}
                  onChange={handleFormChange}
                  required
                >
                  <option value="">{t('courses.selectProfessor')}</option>
                  {professors.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-200">{t('courses.table.class')}</label>
                <input
                  type="text"
                  name="class"
                  placeholder={t('courses.classPlaceholder')}
                  className="input input-bordered rounded-lg px-4 py-2"
                  value={form.class}
                  onChange={handleFormChange}
                  required
                />
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-200">{t('courses.table.schedule')}</label>
                <input
                  type="text"
                  name="schedule"
                  placeholder={t('courses.schedulePlaceholder')}
                  className="input input-bordered rounded-lg px-4 py-2"
                  value={typeof form.schedule === 'string' ? form.schedule : ''}
                  onChange={handleFormChange}
                  required
                />
                {formError && <div className="text-red-500 text-sm">{formError}</div>}
                <button className="w-full flex justify-center items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 text-white font-bold shadow-lg backdrop-blur-md hover:from-blue-600 hover:to-indigo-600 hover:shadow-xl transition-all focus:ring-2 focus:ring-blue-300 outline-none mt-2" type="submit" disabled={formLoading}>
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>
                  {formLoading ? t('courses.saving') : modalMode === 'add' ? t('common.add') : t('common.save')}
                </button>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default CoursesPage;