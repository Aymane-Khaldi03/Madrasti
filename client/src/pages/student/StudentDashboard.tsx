import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  BookOpen, CheckCircle, Clock, Star, FileText, Calculator, Atom, Download, Calendar, Mail, User, MapPin, Phone
} from 'lucide-react';

// Types explicites pour chaque entité
interface Assignment {
  id?: number | string;
  title?: string;
  course?: string;
  courseId?: number | string;
  dueDate?: string;
  status?: string;
  grade?: string | number;
}
interface Course {
  id?: number | string;
  title?: string;
  name?: string;
  professor?: string;
  professorId?: number | string;
  progress?: number;
}
interface Event {
  id?: number | string;
  title?: string;
  date?: string;
  time?: string;
}
interface Notification {
  id?: number | string;
  title?: string;
  message?: string;
  date?: string;
  read?: boolean;
}
interface Grade {
  subject?: string;
  grade?: number;
}
interface GradesResponse {
  average: number | null;
  subjects: Grade[];
}

const CONTACT = {
  email: 'conseiller@ecole.com',
  phone: '+212612345678',
  address: "123 Avenue de l'Administration, Casablanca",
  maps: "https://www.google.com/maps?q=123+Avenue+de+l%27Administration,+Casablanca",
};

const StudentDashboard: React.FC = () => {
  const { t } = useLanguage();
  const { user } = useAuth();

  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [grades, setGrades] = useState<GradesResponse>({ average: null, subjects: [] });
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [showContact, setShowContact] = useState(false);

  useEffect(() => {
    if (!user?.id) return;
    
    async function fetchData() {
      setLoading(true);
      try {
        const [assignmentsRes, coursesRes, eventsRes, gradesRes, notificationsRes] = await Promise.all([
          fetch(`/api/student/assignments?studentId=${user?.id}`),
          fetch(`/api/student/courses?studentId=${user?.id}`),
          fetch(`/api/student/calendar?studentId=${user?.id}`),
          fetch(`/api/student/grades?studentId=${user?.id}`),
          fetch(`/api/student/notifications?studentId=${user?.id}`),
        ]);
        setAssignments(await assignmentsRes.json());
        setCourses(await coursesRes.json());
        setEvents(await eventsRes.json());
        setGrades(await gradesRes.json());
        setNotifications(await notificationsRes.json());
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [user?.id]);

  // Statistiques dynamiques
  const stats = [
    {
      title: t('student.enrolledCourses'),
      value: courses.length,
      icon: <BookOpen className="h-5 w-5" aria-label="Courses" />,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-900',
      tooltip: 'Modules inscrits au semestre en cours',
    },
    {
      title: t('student.completedAssignments'),
      value: assignments.filter(a => a.status === 'completed' || a.status === 'Terminé').length,
      icon: <CheckCircle className="h-5 w-5" aria-label="Completed Assignments" />,
      color: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900',
      tooltip: 'Devoirs et rapports soumis',
    },
    {
      title: t('student.pendingAssignments'),
      value: assignments.filter(a => a.status === 'pending' || a.status === 'En attente').length,
      icon: <Clock className="h-5 w-5" aria-label="Pending Assignments" />,
      color: 'text-amber-600',
      bgColor: 'bg-amber-100 dark:bg-amber-900',
      tooltip: 'Travaux à rendre prochainement',
    },
    {
      title: t('student.averageGrade'),
      value: grades.average !== null ? `${grades.average.toFixed(2)}/20` : '--',
      icon: <Star className="h-5 w-5" aria-label="Average Grade" />,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100 dark:bg-purple-900',
      tooltip: 'Moyenne générale semestrielle',
    },
  ];

  if (loading) return <div className="p-10 text-center">{t('common.loading')}</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 p-0">
      <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
              <User className="h-8 w-8 text-blue-500 dark:text-blue-300" aria-label="Avatar étudiant" />
              {t('student.dashboard')}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg mt-2">
              {t('student.welcome')}
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="default"
              className="flex items-center gap-2 shadow-md"
              aria-label={t('student.downloadTranscriptAria')}
              asChild
            >
              <a
                href={`/api/student/grades/report?studentId=${user?.id}`}
                target="_blank"
                rel="noopener noreferrer"
                download
              >
                <Download className="h-4 w-4" /> {t('student.downloadTranscript')}
              </a>
            </Button>
            <Button
              variant="secondary"
              className="flex items-center gap-2"
              aria-label={t('student.contactAdvisorAria')}
              onClick={() => setShowContact(true)}
            >
              <Mail className="h-4 w-4" /> {t('student.contact')}
            </Button>
          </div>
        </div>

        {/* Modal Contact */}
        {showContact && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8 w-full max-w-sm relative animate-fade-in">
              <button
                className="absolute top-3 right-3 text-gray-400 hover:text-red-500 text-2xl font-bold"
                aria-label={t('common.close')}
                onClick={() => setShowContact(false)}
              >
                ×
              </button>
              <h2 className="text-xl font-bold mb-4 text-blue-700 dark:text-blue-300 flex items-center gap-2">
                <Mail className="h-5 w-5" /> {t('student.advisor')}
              </h2>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-blue-500" />
                  <a href={`mailto:${CONTACT.email}`} className="text-blue-700 dark:text-blue-300 underline">{CONTACT.email}</a>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-green-600" />
                  <a href={`tel:${CONTACT.phone}`} className="text-green-700 dark:text-green-300 underline">{CONTACT.phone}</a>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-amber-600" />
                  <a href={CONTACT.maps} target="_blank" rel="noopener noreferrer" className="text-amber-700 dark:text-amber-300 underline">{CONTACT.address}</a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white/95 dark:bg-gray-900/90 rounded-2xl shadow-lg flex flex-col items-center justify-center py-7 px-4 group transition hover:shadow-2xl focus-within:shadow-2xl border-0 min-h-[170px]"
              tabIndex={0}
              aria-label={stat.title}
            >
              <div
                className={`flex items-center justify-center rounded-full shadow-lg mb-4 transition-transform group-hover:scale-110 group-focus:scale-110 ${stat.bgColor}`}
                style={{ width: 64, height: 64 }}
                aria-label={stat.title + ' icon'}
              >
                {/* Icône très grande */}
                <span className={stat.color} style={{ fontSize: 0 }}>
                  {React.cloneElement(stat.icon, { className: 'w-10 h-10', 'aria-hidden': true })}
                </span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-xs text-gray-500 dark:text-gray-400 mb-1 tracking-wide font-medium flex items-center gap-1">
                  {stat.title}
                  <span className="ml-1" title={stat.tooltip} aria-label={stat.tooltip}>ℹ️</span>
                </span>
                <span className="text-4xl font-extrabold text-gray-900 dark:text-white leading-tight select-text group-hover:text-blue-600 dark:group-hover:text-blue-300 transition-colors">
                  {stat.value}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Assignments */}
          <Card className="lg:col-span-1 bg-white/90 dark:bg-gray-900/80 border-0">
            <CardHeader>
              <CardTitle>{t('student.recentAssignments')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {assignments.slice(0, 3).map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 bg-blue-50/60 dark:bg-blue-950/40 rounded-lg shadow-sm hover:shadow-lg transition group">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                      <FileText className="h-5 w-5 text-blue-500 dark:text-blue-300" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors">{item.title}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{item.course || item.courseId}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant={item.status === 'pending' || item.status === 'En attente' ? 'destructive' : 'default'}>
                      {item.dueDate || item.grade || '--'}
                    </Badge>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {item.status === 'pending' || item.status === 'En attente' ? t('student.pending') : t('student.completed')}
                    </p>
                  </div>
                </div>
              ))}
              <Button variant="ghost" className="w-full mt-2" aria-label={t('student.viewAllAssignmentsAria')}>{t('student.viewAllAssignments')}</Button>
            </CardContent>
          </Card>

          {/* Courses */}
          <Card className="lg:col-span-1 bg-white/90 dark:bg-gray-900/80 border-0">
            <CardHeader>
              <CardTitle>{t('student.enrolledCourses')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {courses.map((course, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-green-50/60 dark:bg-green-950/40 rounded-lg shadow-sm hover:shadow-lg transition group">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                      <Calculator className="h-5 w-5 text-green-600 dark:text-green-300" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white group-hover:text-green-700 dark:group-hover:text-green-300 transition-colors">{course.title || course.name}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{course.professor || course.professorId}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">{course.progress || '--'}%</p>
                    <Progress value={course.progress || 0} className="w-24 mt-1" />
                  </div>
                </div>
              ))}
              <Button variant="ghost" className="w-full mt-2" aria-label={t('student.viewAllCoursesAria')}>{t('student.viewAllCourses')}</Button>
            </CardContent>
          </Card>

          {/* Events */}
          <Card className="lg:col-span-1 bg-white/90 dark:bg-gray-900/80 border-0">
            <CardHeader>
              <CardTitle>{t('student.upcomingEvents')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {events.slice(0, 3).map((event, idx) => (
                <div key={idx} className="flex items-center gap-3 p-4 bg-yellow-50/60 dark:bg-yellow-950/40 rounded-lg shadow-sm hover:shadow-lg transition group">
                  <Calendar className="h-5 w-5 text-blue-500 dark:text-blue-300" />
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white group-hover:text-yellow-700 dark:group-hover:text-yellow-300 transition-colors">{event.title}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{event.date} {event.time}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
