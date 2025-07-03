import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { BookOpen, CheckCircle, Clock, Star, FileText, Calculator, Atom, Download } from 'lucide-react';

const StudentDashboard: React.FC = () => {
  const { t } = useLanguage();

  const stats = [
    {
      title: t('student.enrolledCourses'),
      value: '6',
      icon: <BookOpen className="h-5 w-5" />,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-900',
    },
    {
      title: t('student.completedAssignments'),
      value: '12',
      icon: <CheckCircle className="h-5 w-5" />,
      color: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900',
    },
    {
      title: t('student.pendingAssignments'),
      value: '3',
      icon: <Clock className="h-5 w-5" />,
      color: 'text-amber-600',
      bgColor: 'bg-amber-100 dark:bg-amber-900',
    },
    {
      title: t('student.averageGrade'),
      value: '87.5%',
      icon: <Star className="h-5 w-5" />,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100 dark:bg-purple-900',
    },
  ];

  const recentAssignments = [
    {
      title: 'Math Quiz #3',
      course: 'Calculus I',
      dueDate: 'Due Tomorrow',
      status: 'pending',
      icon: <FileText className="h-5 w-5" />,
    },
    {
      title: 'Physics Lab Report',
      course: 'Physics II',
      grade: 'Grade: 92%',
      status: 'completed',
      icon: <CheckCircle className="h-5 w-5" />,
    },
  ];

  const enrolledCourses = [
    {
      name: 'Calculus I',
      professor: 'Prof. Johnson',
      progress: 85,
      icon: <Calculator className="h-5 w-5" />,
    },
    {
      name: 'Physics II',
      professor: 'Prof. Williams',
      progress: 92,
      icon: <Atom className="h-5 w-5" />,
    },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {t('student.dashboard')}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Welcome back, Jane! Here's your academic overview.
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
      
      {/* Recent Activity & Courses */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Assignments */}
        <Card>
          <CardHeader>
            <CardTitle>{t('student.recentAssignments')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentAssignments.map((assignment, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                      <div className="text-primary">{assignment.icon}</div>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">{assignment.title}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{assignment.course}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant={assignment.status === 'pending' ? 'destructive' : 'default'}>
                      {assignment.dueDate || assignment.grade}
                    </Badge>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {assignment.status === 'pending' ? 'Pending' : 'Completed'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        {/* Enrolled Courses */}
        <Card>
          <CardHeader>
            <CardTitle>{t('student.enrolledCourses')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {enrolledCourses.map((course, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                      <div className="text-secondary">{course.icon}</div>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">{course.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{course.professor}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                      {course.progress}%
                    </span>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Progress</p>
                    <Progress value={course.progress} className="w-20 mt-2" />
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

export default StudentDashboard;
