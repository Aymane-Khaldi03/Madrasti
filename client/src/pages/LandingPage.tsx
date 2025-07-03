import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import LoginModal from '@/components/Auth/LoginModal';
import { GraduationCap, University, Presentation, Shield, Check } from 'lucide-react';

const LandingPage: React.FC = () => {
  const { t } = useLanguage();
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'student' | 'professor' | 'admin' | undefined>();

  const handleRoleLogin = (role: 'student' | 'professor' | 'admin') => {
    setSelectedRole(role);
    setLoginModalOpen(true);
  };

  const roles = [
    {
      id: 'student',
      title: t('roles.student'),
      description: 'Access your courses, assignments, grades, and academic calendar',
      icon: <University className="h-8 w-8" />,
      color: 'bg-blue-100 dark:bg-blue-900',
      iconColor: 'text-primary',
      buttonColor: 'bg-primary hover:bg-blue-600',
      features: [
        'View enrolled courses',
        'Submit assignments',
        'Track grades',
        'Academic calendar',
      ],
    },
    {
      id: 'professor',
      title: t('roles.professor'),
      description: 'Manage courses, assignments, and student assessments',
      icon: <Presentation className="h-8 w-8" />,
      color: 'bg-green-100 dark:bg-green-900',
      iconColor: 'text-secondary',
      buttonColor: 'bg-secondary hover:bg-green-600',
      features: [
        'Manage courses',
        'Grade assignments',
        'Upload resources',
        'Course scheduling',
      ],
    },
    {
      id: 'admin',
      title: t('roles.admin'),
      description: 'Oversee platform operations and manage users',
      icon: <Shield className="h-8 w-8" />,
      color: 'bg-amber-100 dark:bg-amber-900',
      iconColor: 'text-accent',
      buttonColor: 'bg-accent hover:bg-amber-600',
      features: [
        'User management',
        'Platform analytics',
        'Course oversight',
        'Report generation',
      ],
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary to-blue-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-6">{t('common.welcome')}</h1>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              A comprehensive school data management platform designed to streamline education administration, 
              enhance learning experiences, and foster academic excellence.
            </p>
            <div className="flex justify-center space-x-4">
              <Button className="bg-white text-primary px-8 py-3 hover:bg-gray-100">
                Get Started
              </Button>
              <Button 
                variant="outline" 
                className="border-white text-white px-8 py-3 hover:bg-white hover:text-primary"
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Role Selection */}
      <div className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {t('roles.chooseRole')}
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Select your role to access your personalized dashboard
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {roles.map((role) => (
              <Card key={role.id} className="hover:shadow-xl transition-shadow cursor-pointer">
                <CardContent className="p-8">
                  <div className="text-center">
                    <div className={`w-16 h-16 ${role.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                      <div className={role.iconColor}>{role.icon}</div>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                      {role.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                      {role.description}
                    </p>
                    <ul className="text-left text-gray-600 dark:text-gray-400 space-y-2 mb-6">
                      {role.features.map((feature, index) => (
                        <li key={index} className="flex items-center">
                          <Check className="h-4 w-4 text-secondary mr-2" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Button 
                      className={`w-full ${role.buttonColor} text-white`}
                      onClick={() => handleRoleLogin(role.id as 'student' | 'professor' | 'admin')}
                    >
                      {t('roles.loginAs')} {role.title}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <LoginModal
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        selectedRole={selectedRole}
      />
    </div>
  );
};

export default LandingPage;
