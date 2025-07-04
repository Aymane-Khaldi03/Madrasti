import React, { useEffect, useState } from "react";
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/lib/i18n';
import { FileText, BookOpen, CalendarDays, Award, Eye } from "lucide-react";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface Assignment {
  id?: number | string;
  title: string;
  course?: string;
  courseId?: number | string;
  due?: string;
  status: string;
  grade?: string | number;
}

const STATUS_COLORS: Record<string, string> = {
  'Open': 'bg-green-100 text-green-700',
  'Closed': 'bg-gray-200 text-gray-700',
  'En attente': 'bg-amber-100 text-amber-700',
  'Terminé': 'bg-blue-100 text-blue-700',
};

const ProfessorAssignments: React.FC = () => {
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'add' | 'edit'>('add');
  const [form, setForm] = useState<Assignment>({ title: '', course: '', due: '', status: 'open' });
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const [editId, setEditId] = useState<number | string | undefined>(undefined);
  const [deleteLoading, setDeleteLoading] = useState<string | number | null>(null);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<'all' | 'open' | 'closed' | 'graded'>('all');

  const fetchAssignments = () => {
    if (!user?.id) return;
    setLoading(true);
    fetch(`/api/professor/assignments?professorId=${user.id}`)
      .then((res) => res.json())
      .then((data) => setAssignments(data))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchAssignments(); }, [user?.id]);

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950" dir={language === 'ar' ? 'rtl' : 'ltr'} lang={language}>
      <div className="flex items-center gap-3 mb-8">
        <FileText className="w-10 h-10 text-blue-400 dark:text-blue-200" aria-label={t('professor.assignmentsIconAria')} />
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">{t('professor.assignmentsTitle')}</h1>
      </div>
      {loading ? (
        <div className="text-center text-lg text-gray-500">{t('common.loading')}</div>
      ) : assignments.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <FileText className="w-16 h-16 text-blue-200 mb-4" />
          <p className="text-lg text-gray-500">{t('professor.noAssignments')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {assignments.map((a, i) => (
            <div
              key={i}
              className="bg-white/95 dark:bg-gray-900/90 rounded-2xl shadow-lg p-6 flex flex-col gap-4 hover:shadow-2xl transition group border-0 min-h-[180px] animate-fadeIn"
              tabIndex={0}
              aria-label={`${t('professor.assignmentAria')}: ${a.title}`}
            >
              <div className="flex items-center gap-4 mb-2">
                <div className="rounded-full shadow-lg flex items-center justify-center bg-blue-100 text-blue-600 w-14 h-14 group-hover:scale-110 transition-transform">
                  <FileText className="w-8 h-8" aria-label={t('professor.assignmentIconAria')} />
                </div>
                <div className="flex-1">
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors">{a.title}</h2>
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mt-1">
                    <BookOpen className="w-4 h-4" aria-label={t('professor.courseAria')} />
                    {a.course || a.courseId}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                <span className="flex items-center gap-1">
                  <CalendarDays className="w-4 h-4" />
                  <span className="font-semibold">{t('professor.due')}:</span> {a.due || '-'}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${t(`professor.assignmentStatusColors.${a.status}`) || 'bg-gray-100 text-gray-700'}`}>{t(`professor.assignmentStatus.${a.status}`)}</span>
                {a.grade && (
                  <span className="ml-auto px-2 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-semibold flex items-center gap-1"><Award className="w-4 h-4 text-yellow-400" /> {t('professor.grade')}: {a.grade}</span>
                )}
              </div>
              <div className="mt-4 flex justify-end">
                <a
                  href={`/professor/assignments/${a.id}`}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 font-semibold shadow hover:bg-blue-200 dark:hover:bg-blue-800 transition focus:outline-none focus:ring-2 focus:ring-blue-400"
                  aria-label={`${t('professor.viewCopiesAria')} ${a.title}`}
                >
                  <Eye className="w-5 h-5" />
                  <span>{t('professor.viewCopies')}</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProfessorAssignments;
