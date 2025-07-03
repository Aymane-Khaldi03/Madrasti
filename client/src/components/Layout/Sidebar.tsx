import React from 'react';
import { Link, useLocation } from 'wouter';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  BookOpen, 
  ClipboardList, 
  Users, 
  BarChart3, 
  Calendar,
  Bell,
  UserPlus,
  Settings,
  Megaphone,
  FileText
} from 'lucide-react';

interface SidebarItem {
  href: string;
  icon: React.ReactNode;
  label: string;
  roles?: ('student' | 'professor' | 'admin')[];
}

const Sidebar: React.FC = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [location] = useLocation();

  if (!user) return null;

  const sidebarItems: SidebarItem[] = [
    {
      href: `/${user.role}`,
      icon: <LayoutDashboard className="h-4 w-4" />,
      label: t('common.dashboard'),
    },
    {
      href: `/${user.role}/courses`,
      icon: <BookOpen className="h-4 w-4" />,
      label: user.role === 'student' ? t('student.myCourses') : t('professor.myCourses'),
      roles: ['student', 'professor'],
    },
    {
      href: `/${user.role}/assignments`,
      icon: <ClipboardList className="h-4 w-4" />,
      label: t('student.assignments'),
      roles: ['student', 'professor'],
    },
    {
      href: `/${user.role}/grades`,
      icon: <BarChart3 className="h-4 w-4" />,
      label: t('student.grades'),
      roles: ['student', 'professor'],
    },
    {
      href: `/${user.role}/students`,
      icon: <Users className="h-4 w-4" />,
      label: t('professor.students'),
      roles: ['professor'],
    },
    {
      href: `/${user.role}/users`,
      icon: <Users className="h-4 w-4" />,
      label: t('admin.userManagement'),
      roles: ['admin'],
    },
    {
      href: `/${user.role}/course-management`,
      icon: <BookOpen className="h-4 w-4" />,
      label: t('admin.courseManagement'),
      roles: ['admin'],
    },
    {
      href: `/${user.role}/analytics`,
      icon: <BarChart3 className="h-4 w-4" />,
      label: t('admin.analytics'),
      roles: ['admin'],
    },
    {
      href: `/${user.role}/reports`,
      icon: <FileText className="h-4 w-4" />,
      label: t('admin.reports'),
      roles: ['admin'],
    },
    {
      href: `/${user.role}/announcements`,
      icon: <Megaphone className="h-4 w-4" />,
      label: t('admin.announcements'),
      roles: ['admin'],
    },
    {
      href: `/${user.role}/calendar`,
      icon: <Calendar className="h-4 w-4" />,
      label: t('common.calendar'),
    },
    {
      href: `/${user.role}/notifications`,
      icon: <Bell className="h-4 w-4" />,
      label: t('common.notifications'),
    },
  ];

  const filteredItems = sidebarItems.filter(item => 
    !item.roles || item.roles.includes(user.role)
  );

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'student':
        return 'bg-primary';
      case 'professor':
        return 'bg-secondary';
      case 'admin':
        return 'bg-accent';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="w-64 bg-white dark:bg-gray-800 shadow-lg">
      {/* User Profile */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          <Avatar className="h-10 w-10">
            <AvatarFallback className={cn("text-white", getRoleColor(user.role))}>
              {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">{user.name}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">{t(`roles.${user.role}`)}</p>
          </div>
        </div>
      </div>
      
      {/* Navigation */}
      <nav className="mt-6">
        {filteredItems.map((item) => {
          const isActive = location === item.href;
          return (
            <Link key={item.href} href={item.href}>
              <a
                className={cn(
                  "flex items-center px-6 py-3 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors",
                  isActive && "text-primary bg-blue-50 dark:bg-blue-900 border-r-2 border-primary"
                )}
              >
                {item.icon}
                <span className="ml-3">{item.label}</span>
              </a>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar;
