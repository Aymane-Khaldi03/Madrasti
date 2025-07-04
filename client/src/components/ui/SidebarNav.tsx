import { useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
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

export default function SidebarNav() {
  const [location] = useLocation();
  const { user } = useAuth();
  const { state } = useSidebar();

  const link = (to: string) => location === to;

  interface MenuItem {
    to: string;
    icon: React.ReactNode;
    label: string;
    role: "admin" | "professor" | "student";
  }

  // Combine all menu items with their roles
  const allMenu: MenuItem[] = [
    // Admin
    { to: "/admin", icon: <Home />, label: "Dashboard", role: "admin" },
    { to: "/admin/users", icon: <Users />, label: "Users", role: "admin" },
    { to: "/admin/courses", icon: <BookOpen />, label: "Courses", role: "admin" },
    { to: "/admin/analytics", icon: <BarChart2 />, label: "Analytics", role: "admin" },
    { to: "/admin/calendar", icon: <Calendar />, label: "Calendar", role: "admin" },
    { to: "/admin/announcements", icon: <ClipboardList />, label: "Announcements", role: "admin" },
    { to: "/admin/notifications", icon: <Bell />, label: "Notifications", role: "admin" },
    { to: "/admin/reports", icon: <ClipboardList />, label: "Reports", role: "admin" },
    // Professor
    { to: "/professor", icon: <Home />, label: "Dashboard", role: "professor" },
    { to: "/professor/courses", icon: <BookOpen />, label: "My Courses", role: "professor" },
    { to: "/professor/assignments", icon: <ClipboardList />, label: "Assignments", role: "professor" },
    { to: "/professor/grades", icon: <BarChart2 />, label: "Grades", role: "professor" },
    { to: "/professor/calendar", icon: <Calendar />, label: "Calendar", role: "professor" },
    { to: "/professor/notifications", icon: <Bell />, label: "Notifications", role: "professor" },
    { to: "/professor/students", icon: <User />, label: "Students", role: "professor" },
    // Student
    { to: "/student", icon: <Home />, label: "Dashboard", role: "student" },
    { to: "/student/courses", icon: <BookOpen />, label: "My Courses", role: "student" },
    { to: "/student/assignments", icon: <ClipboardList />, label: "Assignments", role: "student" },
    { to: "/student/grades", icon: <BarChart2 />, label: "Grades", role: "student" },
    { to: "/student/calendar", icon: <Calendar />, label: "Calendar", role: "student" },
    { to: "/student/notifications", icon: <Bell />, label: "Notifications", role: "student" },
  ];

  let menu: MenuItem[] = [];
  if (user?.role) {
    menu = allMenu.filter((item) => item.role === user.role);
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
