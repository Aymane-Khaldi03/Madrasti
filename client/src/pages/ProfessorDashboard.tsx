import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BookOpen, Users, Clock, TrendingUp, Calculator, Atom, Plus, Edit, Trash2, FileText, CheckCircle } from 'lucide-react';

const ProfessorDashboard: React.FC = () => {
  const { t } = useLanguage();

  const stats = [
    {
      title: t('professor.activeCourses'),
      value: '4',
      icon: <BookOpen className="h-5 w-5" />,
      color: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900',
    },
    {
      title: t('professor.totalStudents'),
      value: '128',
      icon: <Users className="h-5 w-5" />,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-900',
    },
    {
      title: t('professor.pendingReviews'),
      value: '23',
      icon: <Clock className="h-5 w-5" />,
      color: 'text-amber-600',
      bgColor: 'bg-amber-100 dark:bg-amber-900',
    },
    {
      title: t('professor.classAverage'),
      value: '84.2%',
      icon: <TrendingUp className="h-5 w-5" />,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100 dark:bg-purple-900',
    },
  ];

  const courses = [
    {
      name: 'Calculus I',
      students: '32 students',
      icon: <Calculator className="h-5 w-5" />,
    },
    {
      name: 'Physics II',
      students: '28 students',
      icon: <Atom className="h-5 w-5" />,
    },
  ];

  const recentSubmissions = [
    {
      assignment: 'Math Quiz #3',
      student: 'Jane Smith',
      status: 'pending',
      submittedAt: '2 hours ago',
      icon: <FileText className="h-5 w-5" />,
    },
    {
      assignment: 'Physics Lab Report',
      student: 'John Doe',
      grade: 'Graded: 88%',
      status: 'graded',
      gradedAt: 'Yesterday',
      icon: <CheckCircle className="h-5 w-5" />,
    },
  ];

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
                      <div className="text-primary">{course.icon}</div>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">{course.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{course.students}</p>
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
              {recentSubmissions.map((submission, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                      <div className="text-primary">{submission.icon}</div>
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
