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
    <header className="sticky top-0 z-40 w-full bg-gradient-to-r from-blue-950/90 via-blue-800/80 to-indigo-900/80 dark:from-gray-950/90 dark:via-gray-900/80 dark:to-gray-950/80 backdrop-blur-md border-b border-blue-900/30 shadow-lg transition-all duration-500">
      <div className="flex items-center justify-between px-4 md:px-8 h-16 w-full">
        <div className="flex items-center gap-3 md:gap-6 ml-12 md:ml-16 transition-all duration-300">
          <SidebarTrigger className="mr-2" />
          {/* Always show EduSphere text in header, never overlayed by sidebar button */}
          <span className="text-2xl font-extrabold tracking-tight text-blue-900 dark:text-white drop-shadow-lg font-poppins">EduSphere</span>
        </div>
        <div className="flex items-center gap-4">
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
    </header>
  );
};

export default Header;
