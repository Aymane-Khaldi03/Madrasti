import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { GraduationCap, Sun, Moon, Globe, ChevronDown, LogOut, Menu, X } from 'lucide-react';

const Header: React.FC = () => {
  const { user, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
  ];

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Hamburger menu - mobile only */}
          <button
            className="md:hidden mr-2 flex items-center justify-center rounded-full p-2 transition-all duration-300 ease-in-out focus:ring-2 focus:ring-blue-400 outline-none"
            aria-label={sidebarOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <span className="relative w-6 h-6 block">
              <span
                className={`absolute inset-0 flex items-center justify-center transition-transform duration-300 ease-in-out ${sidebarOpen ? 'rotate-45 opacity-0' : 'opacity-100'}`}
              >
                <Menu className="w-6 h-6" />
              </span>
              <span
                className={`absolute inset-0 flex items-center justify-center transition-transform duration-300 ease-in-out ${sidebarOpen ? 'opacity-100 rotate-0' : 'opacity-0 -rotate-45'}`}
              >
                <X className="w-6 h-6" />
              </span>
            </span>
          </button>
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <GraduationCap className="text-primary text-2xl mr-3" />
              <span className="text-xl font-bold text-gray-900 dark:text-white">EduSphere</span>
            </div>
          </div>
          
          {/* Right side controls */}
          <div className="flex items-center space-x-4">
            {/* Language Switcher */}
            <DropdownMenu open={languageDropdownOpen} onOpenChange={setLanguageDropdownOpen}>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2">
                  <Globe className="h-4 w-4" />
                  <span>{languages.find(lang => lang.code === language)?.name}</span>
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {languages.map((lang) => (
                  <DropdownMenuItem
                    key={lang.code}
                    onClick={() => {
                      setLanguage(lang.code);
                      setLanguageDropdownOpen(false);
                    }}
                    className="flex items-center space-x-2"
                  >
                    <span>{lang.flag}</span>
                    <span>{lang.name}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            
            {/* Theme Toggle */}
            <Button variant="ghost" size="icon" onClick={toggleTheme}>
              {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            </Button>
            
            {/* User Menu */}
            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary text-white">
                        {user.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase() : ''}
                      </AvatarFallback>
                    </Avatar>
                    <span>{user.name}</span>
                    <ChevronDown className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleSignOut} className="flex items-center space-x-2">
                    <LogOut className="h-4 w-4" />
                    <span>{t('auth.signOut')}</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;
