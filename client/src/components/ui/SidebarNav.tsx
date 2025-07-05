import { useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarSeparator,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Home,
  Users,
  BookOpen,
  BarChart2,
  Calendar,
  Bell,
  ClipboardList,
  User,
  GraduationCap,
} from "lucide-react";

export function getAllMenu(t: (key: string) => string) {
  return [
    // Admin
    { to: "/admin", icon: <Home />, label: t("navigation.dashboard"), role: "admin" },
    { to: "/admin/users", icon: <Users />, label: t("navigation.users"), role: "admin" },
    { to: "/admin/courses", icon: <BookOpen />, label: t("navigation.courses"), role: "admin" },
    { to: "/admin/analytics", icon: <BarChart2 />, label: t("navigation.analytics"), role: "admin" },
    { to: "/admin/calendar", icon: <Calendar />, label: t("navigation.calendar"), role: "admin" },
    { to: "/admin/announcements", icon: <ClipboardList />, label: t("admin.announcements"), role: "admin" },
    { to: "/admin/notifications", icon: <Bell />, label: t("navigation.notifications"), role: "admin" },
    { to: "/admin/reports", icon: <ClipboardList />, label: t("navigation.reports"), role: "admin" },
    // Professor
    { to: "/professor", icon: <Home />, label: t("navigation.dashboard"), role: "professor" },
    { to: "/professor/courses", icon: <BookOpen />, label: t("professor.myCourses"), role: "professor" },
    { to: "/professor/assignments", icon: <ClipboardList />, label: t("professor.assignments"), role: "professor" },
    { to: "/professor/grades", icon: <BarChart2 />, label: t("professor.gradebook"), role: "professor" },
    { to: "/professor/calendar", icon: <Calendar />, label: t("navigation.calendar"), role: "professor" },
    { to: "/professor/notifications", icon: <Bell />, label: t("navigation.notifications"), role: "professor" },
    { to: "/professor/students", icon: <User />, label: t("professor.students"), role: "professor" },
    // Student
    { to: "/student", icon: <Home />, label: t("navigation.dashboard"), role: "student" },
    { to: "/student/courses", icon: <BookOpen />, label: t("student.myCourses"), role: "student" },
    { to: "/student/assignments", icon: <ClipboardList />, label: t("student.assignments"), role: "student" },
    { to: "/student/grades", icon: <BarChart2 />, label: t("student.grades"), role: "student" },
    { to: "/student/calendar", icon: <Calendar />, label: t("navigation.calendar"), role: "student" },
    { to: "/student/notifications", icon: <Bell />, label: t("navigation.notifications"), role: "student" },
  ];
}

export default function SidebarNav() {
  const [location] = useLocation();
  const { user } = useAuth();
  const { state } = useSidebar();
  const { t, language } = useLanguage();

  const link = (to: string) => location === to;

  interface MenuItem {
    to: string;
    icon: React.ReactNode;
    label: string;
    role: string;
  }

  let menu: MenuItem[] = [];
  if (user?.role) {
    menu = getAllMenu(t).filter((item) => item.role === user.role);
  }

  return (
    <>
      <SidebarContent>
        <SidebarMenu>
          {menu.map((item) => (
            <SidebarMenuItem key={item.to}>
              <SidebarMenuButton
                asChild
                isActive={link(item.to)}
                className={`transition-all duration-300 ease-in-out flex items-center gap-3 rounded-xl px-4 py-2 my-1 shadow-sm
                  ${state === "collapsed"
                    ? "justify-center scale-110 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-950/95 dark:to-indigo-900/90 shadow-2xl px-0 py-2 border border-blue-200 dark:border-blue-900/40 hover:bg-blue-200 dark:hover:bg-blue-900/80 min-w-[112px]"
                    : "hover:scale-105 hover:bg-blue-100 dark:hover:bg-blue-900/10 hover:text-blue-900 dark:hover:text-blue-100"}
                `}
              >
                <a
                  href={item.to}
                  onClick={(e) => {
                    e.preventDefault();
                    window.history.pushState({}, "", item.to);
                    window.dispatchEvent(new PopStateEvent("popstate"));
                  }}
                  className={`flex items-center gap-3 w-full ${state === "collapsed" ? "justify-center" : ""}`}
                >
                  <span className={`transition-all duration-300 ${state === "collapsed" ? "mx-0 flex items-center justify-center text-blue-700 dark:text-white w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 lg:w-10 lg:h-10" : "mx-1 text-xl text-blue-900 dark:text-blue-100"}`}>{item.icon}</span>
                  <span
                    className={`text-base font-semibold tracking-wide transition-all duration-300 ${
                      state === "collapsed" ? "hidden" : "text-blue-900 dark:text-blue-50"
                    }`}
                  >
                    {item.label}
                  </span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </>
  );
}
