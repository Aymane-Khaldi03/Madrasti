import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  BookOpen, CheckCircle, Clock, Star, FileText, Calculator, Atom, Download, Calendar, Mail, User
} from 'lucide-react';

const StudentDashboard: React.FC = () => {
  const { t } = useLanguage();

  const studentName = "Youssef";

  const stats = [
    {
      title: t('student.enrolledCourses'),
      value: '6',
      icon: <BookOpen className="h-5 w-5" aria-label="Courses" />,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-900',
      tooltip: 'Modules inscrits au semestre en cours',
    },
    {
      title: t('student.completedAssignments'),
      value: '14',
      icon: <CheckCircle className="h-5 w-5" aria-label="Completed Assignments" />,
      color: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900',
      tooltip: 'Devoirs et rapports soumis',
    },
    {
      title: t('student.pendingAssignments'),
      value: '2',
      icon: <Clock className="h-5 w-5" aria-label="Pending Assignments" />,
      color: 'text-amber-600',
      bgColor: 'bg-amber-100 dark:bg-amber-900',
      tooltip: 'Travaux à rendre prochainement',
    },
    {
      title: t('student.averageGrade'),
      value: '15.7/20',
      icon: <Star className="h-5 w-5" aria-label="Average Grade" />,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100 dark:bg-purple-900',
      tooltip: 'Moyenne générale semestrielle',
    },
  ];

  const recentAssignments = [
    {
      title: 'Contrôle de Mathématiques',
      course: 'Analyse I',
      dueDate: 'Demain',
      status: 'pending',
      icon: <FileText className="h-5 w-5" />,
    },
    {
      title: 'Rapport de TP Physique',
      course: 'Physique II',
      grade: 'Note : 17/20',
      status: 'completed',
      icon: <CheckCircle className="h-5 w-5" />,
    },
  ];

  const enrolledCourses = [
    {
      name: 'Analyse I',
      professor: 'Pr. El Amrani',
      progress: 78,
      icon: <Calculator className="h-5 w-5" />,
    },
    {
      name: 'Physique II',
      professor: 'Pr. Benyahia',
      progress: 84,
      icon: <Atom className="h-5 w-5" />,
    },
  ];

  const upcomingEvents = [
    {
      title: 'Séance de tutorat',
      date: '08 Juillet 2025',
      time: '16:00',
      icon: <Calendar className="h-5 w-5" />,
    },
    {
      title: 'Rendez-vous avec le conseiller pédagogique',
      date: '10 Juillet 2025',
      time: '14:00',
      icon: <User className="h-5 w-5" />,
    },
  ];

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            {t('student.dashboard')}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            {`Bon retour, ${studentName} ! Voici votre espace étudiant.`}
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="default" className="flex items-center gap-2 shadow-md">
            <Download className="h-4 w-4" /> Relevé de notes
          </Button>
          <Button variant="secondary" className="flex items-center gap-2">
            <Mail className="h-4 w-4" /> Contacter le conseiller
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
            <CardContent className="p-6 flex items-center">
              <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                <div className={stat.color}>{stat.icon}</div>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">{stat.title}</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Assignments */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>{t('student.recentAssignments')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentAssignments.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">{item.title}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{item.course}</p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant={item.status === 'pending' ? 'destructive' : 'default'}>
                    {item.dueDate || item.grade}
                  </Badge>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {item.status === 'pending' ? 'En attente' : 'Terminé'}
                  </p>
                </div>
              </div>
            ))}
            <Button variant="ghost" className="w-full mt-2">Voir tous les devoirs</Button>
          </CardContent>
        </Card>

        {/* Courses */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>{t('student.enrolledCourses')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {enrolledCourses.map((course, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                    {course.icon}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">{course.name}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{course.professor}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">{course.progress}%</p>
                  <Progress value={course.progress} className="w-24 mt-1" />
                </div>
              </div>
            ))}
            <Button variant="ghost" className="w-full mt-2">Voir tous les modules</Button>
          </CardContent>
        </Card>

        {/* Events */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Événements à venir</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingEvents.map((event, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex items-center justify-center">
                    {event.icon}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">{event.title}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{event.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500 dark:text-gray-400">{event.time}</p>
                </div>
              </div>
            ))}
            <Button variant="ghost" className="w-full mt-2">Voir le calendrier</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StudentDashboard;
