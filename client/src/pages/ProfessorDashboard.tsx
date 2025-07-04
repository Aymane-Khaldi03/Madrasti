import React, { useEffect, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BookOpen, Users, Clock, TrendingUp, Calculator, Atom, Plus, Edit, Trash2, FileText, CheckCircle } from 'lucide-react';

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
        {/* Course Management */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>{t('professor.courseManagement')}</CardTitle>
            <Button className="bg-secondary hover:bg-green-600">
              <Plus className="h-4 w-4 mr-2" />
              {t('professor.addCourse')}
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {courses.map((course, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                      <div className="text-primary"><Calculator className="h-5 w-5" /></div>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">{course.title || course.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{course.students || ''}</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-800">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-800">
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
    </div>
  );
};

export default ProfessorDashboard;
