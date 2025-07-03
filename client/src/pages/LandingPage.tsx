import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { useLocation } from 'wouter';
import LoginModal from '../components/Auth/LoginModal';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { 
  BookOpen, 
  Users, 
  Shield, 
  Monitor,
  Sun,
  Moon,
  Globe,
  GraduationCap,
  ChartBar,
  Calendar,
  FileText,
  Award,
  Menu,
  X
} from 'lucide-react';

export default function LandingPage() {
  const { t, language, setLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();
  const [location, navigate] = useLocation();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'student' | 'professor' | 'admin' | undefined>();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleRoleSelect = (role: 'student' | 'professor' | 'admin') => {
    setSelectedRole(role);
    setIsLoginOpen(true);
  };

  const handleLoginSuccess = () => {
    setIsLoginOpen(false);
    if (user) {
      navigate(`/dashboard/${user.role}`);
    }
  };

  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-background" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                  <GraduationCap className="h-6 w-6 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold font-poppins text-foreground">EduSphere</h1>
                  <p className="text-sm text-muted-foreground -mt-1">{t('common.tagline')}</p>
                </div>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              <Button
                variant="ghost"
                onClick={() => scrollToSection('features')}
                className="text-foreground hover:text-primary"
              >
                {t('navigation.features')}
              </Button>
              <Button
                variant="ghost"
                onClick={() => scrollToSection('roles')}
                className="text-foreground hover:text-primary"
              >
                {t('navigation.roles')}
              </Button>
            </nav>

            {/* Controls */}
            <div className="flex items-center space-x-3">
              {/* Language Selector */}
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger className="w-[100px] border-0 bg-transparent">
                  <div className="flex items-center space-x-2">
                    <Globe className="h-4 w-4" />
                    <SelectValue />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="ar">العربية</SelectItem>
                  <SelectItem value="fr">Français</SelectItem>
                </SelectContent>
              </Select>

              {/* Theme Toggle */}
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="rounded-full border-0 hover:bg-muted"
              >
                {theme === 'light' ? (
                  <Moon className="h-5 w-5" />
                ) : (
                  <Sun className="h-5 w-5" />
                )}
              </Button>

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4 border-t">
              <div className="flex flex-col space-y-2 pt-4">
                <Button
                  variant="ghost"
                  onClick={() => {
                    scrollToSection('features');
                    setMobileMenuOpen(false);
                  }}
                  className="justify-start"
                >
                  {t('navigation.features')}
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => {
                    scrollToSection('roles');
                    setMobileMenuOpen(false);
                  }}
                  className="justify-start"
                >
                  {t('navigation.roles')}
                </Button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 px-6 overflow-hidden">
        <div className="absolute inset-0 hero-gradient opacity-5"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center fade-in">
            <h2 className="text-5xl md:text-6xl font-bold mb-6 text-foreground font-poppins leading-tight">
              {t('common.welcome')} <span className="text-primary">EduSphere</span>
            </h2>
            <p className="text-xl md:text-2xl mb-8 text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              {t('hero.description')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                size="lg"
                onClick={() => scrollToSection('roles')}
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                {t('hero.getStarted')}
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => scrollToSection('features')}
                className="px-8 py-4 text-lg font-semibold rounded-xl border-2 hover:bg-muted/50 transition-all duration-300"
              >
                {t('hero.learnMore')}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 slide-up">
            <h3 className="text-4xl font-bold mb-4 text-foreground font-poppins">
              {t('features.title')}
            </h3>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {t('features.description')}
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Monitor,
                title: t('features.modernInterface'),
                description: t('features.modernInterfaceDesc'),
                delay: 'delay-100'
              },
              {
                icon: Users,
                title: t('features.roleBasedAccess'),
                description: t('features.roleBasedAccessDesc'),
                delay: 'delay-200'
              },
              {
                icon: BookOpen,
                title: t('features.courseManagement'),
                description: t('features.courseManagementDesc'),
                delay: 'delay-300'
              },
              {
                icon: ChartBar,
                title: t('features.analytics'),
                description: t('features.analyticsDesc'),
                delay: 'delay-400'
              },
              {
                icon: Calendar,
                title: t('features.scheduling'),
                description: t('features.schedulingDesc'),
                delay: 'delay-500'
              },
              {
                icon: Award,
                title: t('features.assessment'),
                description: t('features.assessmentDesc'),
                delay: 'delay-600'
              }
            ].map((feature, index) => (
              <div key={index} className={`slide-up ${feature.delay}`}>
                <Card className="h-full hover:shadow-lg transition-all duration-300 hover:scale-105 bg-card/50 backdrop-blur-sm border-2 hover:border-primary/20">
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <feature.icon className="h-8 w-8 text-primary" />
                    </div>
                    <h4 className="text-xl font-semibold mb-3 font-poppins">{feature.title}</h4>
                    <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Role Selection */}
      <section id="roles" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 slide-up">
            <h3 className="text-4xl font-bold mb-4 text-foreground font-poppins">
              {t('roles.chooseRole')}
            </h3>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {t('roles.chooseRoleDescription')}
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                role: 'student' as const,
                icon: BookOpen,
                title: t('roles.student'),
                description: t('roles.studentDesc'),
                features: [t('roles.features.accessCourses'), t('roles.features.submitAssignments'), t('roles.features.trackProgress')],
                gradient: 'from-blue-500 to-purple-600',
                delay: 'delay-100'
              },
              {
                role: 'professor' as const,
                icon: Users,
                title: t('roles.professor'),
                description: t('roles.professorDesc'),
                features: [t('roles.features.manageCourses'), t('roles.features.gradeAssignments'), t('roles.features.trackStudents')],
                gradient: 'from-green-500 to-teal-600',
                delay: 'delay-200'
              },
              {
                role: 'admin' as const,
                icon: Shield,
                title: t('roles.admin'),
                description: t('roles.adminDesc'),
                features: [t('roles.features.manageUsers'), t('roles.features.systemOverview'), t('roles.features.generateReports')],
                gradient: 'from-red-500 to-pink-600',
                delay: 'delay-300'
              }
            ].map((roleCard, index) => (
              <div key={index} className={`slide-up ${roleCard.delay}`}>
                <Card className="h-full card-hover bg-card/50 backdrop-blur-sm border-2 hover:border-primary/20 overflow-hidden">
                  <div className={`h-2 bg-gradient-to-r ${roleCard.gradient}`}></div>
                  <CardHeader className="text-center pb-4">
                    <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-4">
                      <roleCard.icon className="h-10 w-10 text-primary" />
                    </div>
                    <CardTitle className="text-2xl font-poppins">{roleCard.title}</CardTitle>
                    <CardDescription className="text-lg">
                      {roleCard.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-3 mb-6">
                      {roleCard.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center text-sm text-muted-foreground">
                          <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                          {feature}
                        </div>
                      ))}
                    </div>
                    <Button 
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105" 
                      onClick={() => handleRoleSelect(roleCard.role)}
                    >
                      {t('roles.loginAs')} {roleCard.title}
                    </Button>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-6 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { number: '10K+', label: t('stats.students'), icon: Users },
              { number: '500+', label: t('stats.courses'), icon: BookOpen },
              { number: '100+', label: t('stats.professors'), icon: GraduationCap },
              { number: '98%', label: t('stats.satisfaction'), icon: Award }
            ].map((stat, index) => (
              <div key={index} className="text-center slide-up" style={{ animationDelay: `${index * 100}ms` }}>
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="h-8 w-8 text-primary" />
                </div>
                <div className="text-3xl font-bold text-foreground font-poppins mb-2">{stat.number}</div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card/50 backdrop-blur-sm border-t py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                <GraduationCap className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="text-2xl font-bold font-poppins">EduSphere</span>
            </div>
            <p className="text-muted-foreground mb-4">
              {t('footer.description')}
            </p>
            <p className="text-sm text-muted-foreground">
              © 2024 EduSphere - {t('footer.copyright')}
            </p>
          </div>
        </div>
      </footer>

      {/* Login Modal */}
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        selectedRole={selectedRole}
      />
    </div>
  );
}