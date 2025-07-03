import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Users, BookOpen, GraduationCap, TrendingUp, Plus, Edit, Download, University, Presentation, Clock } from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const { t } = useLanguage();

  const stats = [
    {
      title: t('admin.totalUsers'),
      value: '1,247',
      icon: <Users className="h-5 w-5" />,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-900',
    },
    {
      title: t('admin.activeCourses'),
      value: '84',
      icon: <BookOpen className="h-5 w-5" />,
      color: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900',
    },
    {
      title: t('admin.graduationRate'),
      value: '92.3%',
      icon: <GraduationCap className="h-5 w-5" />,
      color: 'text-amber-600',
      bgColor: 'bg-amber-100 dark:bg-amber-900',
    },
    {
      title: t('admin.platformUsage'),
      value: '95.7%',
      icon: <TrendingUp className="h-5 w-5" />,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100 dark:bg-purple-900',
    },
  ];

  const recentUsers = [
    {
      name: 'Jane Smith',
      email: 'jane.smith@email.com',
      role: 'student',
      initials: 'JS',
      roleColor: 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200',
    },
    {
      name: 'Dr. Michael Johnson',
      email: 'm.johnson@email.com',
      role: 'professor',
      initials: 'MJ',
      roleColor: 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200',
    },
  ];

  const systemAnalytics = [
    {
      title: 'Student Enrollment',
      subtitle: 'This month',
      value: '+12%',
      change: '↑ 156 new students',
      icon: <University className="h-5 w-5" />,
      changeColor: 'text-green-600 dark:text-green-400',
    },
    {
      title: 'Assignment Completion',
      subtitle: 'Overall rate',
      value: '89.3%',
      change: '↑ +2.1% from last month',
      icon: <Presentation className="h-5 w-5" />,
      changeColor: 'text-green-600 dark:text-green-400',
    },
    {
      title: 'System Uptime',
      subtitle: 'Last 30 days',
      value: '99.9%',
      change: 'Excellent performance',
      icon: <Clock className="h-5 w-5" />,
      changeColor: 'text-green-600 dark:text-green-400',
    },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {t('admin.dashboard')}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage users, courses, and monitor platform performance.
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
      
      {/* User Management & Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Users */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>{t('admin.recentUsers')}</CardTitle>
            <Button className="bg-accent hover:bg-amber-600">
              <Plus className="h-4 w-4 mr-2" />
              {t('admin.addUser')}
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentUsers.map((user, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-blue-100 dark:bg-blue-900 text-primary">
                        {user.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">{user.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={user.roleColor}>
                      {t(`roles.${user.role}`)}
                    </Badge>
                    <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-800">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        {/* System Analytics */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>{t('admin.systemAnalytics')}</CardTitle>
            <Button className="bg-primary hover:bg-blue-600">
              <Download className="h-4 w-4 mr-2" />
              {t('admin.exportReport')}
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {systemAnalytics.map((analytic, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                      <div className="text-primary">{analytic.icon}</div>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">{analytic.title}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{analytic.subtitle}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-semibold text-gray-900 dark:text-white">{analytic.value}</span>
                    <p className={`text-sm ${analytic.changeColor}`}>{analytic.change}</p>
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

export default AdminDashboard;
