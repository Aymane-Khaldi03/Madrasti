import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  GraduationCap,
  Sun,
  Moon,
  Globe,
  ChevronDown,
  LogOut,
} from "lucide-react";
import {
  SidebarTrigger,
  useSidebar,          //  ⬅️  pulls sidebar state / actions
} from "@/components/ui/sidebar";

const Header: React.FC = () => {
  const { state, isMobile } = useSidebar();  // expanded | collapsed
  const { toggleSidebar } = useSidebar();
  const { user, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false);

  const languages = [
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "ar", name: "العربية", flag: "🇸🇦" },
    { code: "fr", name: "Français", flag: "🇫🇷" },
  ];

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (err) {
      console.error("Sign-out error:", err);
    }
  };

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* hamburger */}
          <SidebarTrigger
            aria-label={state === "expanded" ? "Close menu" : "Open menu"}
          />
          {/* Logo */}
          <div className="flex items-center">
            <GraduationCap className="text-primary text-2xl mr-3" />
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              EduSphere
            </span>
          </div>

          {/* Right-hand controls */}
          <div className="flex items-center space-x-4">
            {/* Language picker */}
            <DropdownMenu open={languageDropdownOpen} onOpenChange={setLanguageDropdownOpen}>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2">
                  <Globe className="h-4 w-4" />
                  <span>
                    {languages.find((l) => l.code === language)?.name}
                  </span>
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
                  >
                    <span>{lang.flag}</span>
                    <span>{lang.name}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Theme toggle */}
            <Button variant="ghost" size="icon" onClick={toggleTheme}>
              {theme === "light" ? (
                <Moon className="h-4 w-4" />
              ) : (
                <Sun className="h-4 w-4" />
              )}
            </Button>

            {/* User dropdown */}
            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary text-white">
                        {user.name
                          ?.split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span>{user.name}</span>
                    <ChevronDown className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="h-4 w-4 mr-2" />
                    {t("auth.signOut")}
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
