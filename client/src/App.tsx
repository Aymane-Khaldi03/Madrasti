import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import Header from "@/components/Layout/Header";
import Sidebar from "@/components/Layout/Sidebar";
import ProtectedRoute from "@/components/Auth/ProtectedRoute";
import LandingPage from "@/pages/LandingPage";
import StudentDashboard from "@/pages/student/StudentDashboard";
import Assignments from "@/pages/student/Assignments";
import Grades from "@/pages/student/Grades";
import MyCourses from "@/pages/student/MyCourses";
import Calendar from "@/pages/student/Calendar";
import Notifications from "@/pages/student/Notifications";
import ProfessorDashboard from "@/pages/ProfessorDashboard";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import NotFound from "@/pages/not-found";
import { useAuth } from "@/contexts/AuthContext";
import UsersPage from "@/pages/admin/users";
import CoursesPage from "@/pages/admin/courses";
import AnalyticsPage from "@/pages/admin/analytics";
import ReportsPage from "@/pages/admin/reports";
import AnnouncementsPage from "@/pages/admin/announcements";
import CalendarPage from "@/pages/admin/calendar";
import NotificationsPage from "@/pages/admin/notifications";

function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <div className="flex">
        {user && <Sidebar />}
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={LandingPage} />
      {/* Student dashboard */}
      <Route path="/student">
        <ProtectedRoute requiredRole="student">
          <DashboardLayout>
            <StudentDashboard />
          </DashboardLayout>
        </ProtectedRoute>
      </Route>
      {/* Student pages */}
      <Route path="/student/assignments">
        <ProtectedRoute requiredRole="student">
          <DashboardLayout>
            <Assignments />
          </DashboardLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/student/grades">
        <ProtectedRoute requiredRole="student">
          <DashboardLayout>
            <Grades />
          </DashboardLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/student/courses">
        <ProtectedRoute requiredRole="student">
          <DashboardLayout>
            <MyCourses />
          </DashboardLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/student/calendar">
        <ProtectedRoute requiredRole="student">
          <DashboardLayout>
            <Calendar />
          </DashboardLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/student/notifications">
        <ProtectedRoute requiredRole="student">
          <DashboardLayout>
            <Notifications />
          </DashboardLayout>
        </ProtectedRoute>
      </Route>
      {/* Professor dashboard */}
      <Route path="/professor">
        <ProtectedRoute requiredRole="professor">
          <DashboardLayout>
            <ProfessorDashboard />
          </DashboardLayout>
        </ProtectedRoute>
      </Route>
      {/* Admin dashboard and pages */}
      <Route path="/admin">
        <ProtectedRoute requiredRole="admin">
          <DashboardLayout>
            <AdminDashboard />
          </DashboardLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/admin/users">
        <ProtectedRoute requiredRole="admin">
          <DashboardLayout>
            <UsersPage />
          </DashboardLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/admin/courses">
        <ProtectedRoute requiredRole="admin">
          <DashboardLayout>
            <CoursesPage />
          </DashboardLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/admin/analytics">
        <ProtectedRoute requiredRole="admin">
          <DashboardLayout>
            <AnalyticsPage />
          </DashboardLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/admin/reports">
        <ProtectedRoute requiredRole="admin">
          <DashboardLayout>
            <ReportsPage />
          </DashboardLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/admin/announcements">
        <ProtectedRoute requiredRole="admin">
          <DashboardLayout>
            <AnnouncementsPage />
          </DashboardLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/admin/calendar">
        <ProtectedRoute requiredRole="admin">
          <DashboardLayout>
            <CalendarPage />
          </DashboardLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/admin/notifications">
        <ProtectedRoute requiredRole="admin">
          <DashboardLayout>
            <NotificationsPage />
          </DashboardLayout>
        </ProtectedRoute>
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <LanguageProvider>
          <AuthProvider>
            <TooltipProvider>
              <Toaster />
              <Router />
            </TooltipProvider>
          </AuthProvider>
        </LanguageProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
