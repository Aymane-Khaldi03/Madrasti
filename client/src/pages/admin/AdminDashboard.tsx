import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Badge } from '../../components/ui/badge';
import { Progress } from '../../components/ui/progress';
import { 
  Users, 
  GraduationCap, 
  BookOpen, 
  TrendingUp, 
  Calendar,
  FileText,
  AlertCircle,
  DollarSign,
  Award,
  UserPlus,
  Download,
  Upload,
  Settings,
  BarChart3,
  PieChart,
  Flag
} from 'lucide-react';
import { MoroccanStudentForm } from '../../components/admin/MoroccanStudentForm';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const AdminDashboard: React.FC = () => {
  const { t } = useLanguage();
  const [showStudentForm, setShowStudentForm] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  // KPIs dynamiques
  const [kpis, setKpis] = useState({
    bacPassRate: 0,
    redoublementRate: 0,
    scholarshipSpending: 0,
    totalStudents: 0,
    activeCourses: 0,
    pendingFees: 0,
    conductAverage: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchKPIs = async () => {
      setLoading(true);
      setError(null);
      try {
        // Total students
        const usersSnap = await getDocs(collection(db, 'users'));
        const users = usersSnap.docs.map(doc => doc.data());
        const totalStudents = users.filter((u: any) => u.role === 'student').length;
        // Bac pass rate (exemple : % des étudiants avec passed=true)
        const passed = users.filter((u: any) => u.role === 'student' && u.passed === true).length;
        const bacPassRate = totalStudents ? Math.round((passed / totalStudents) * 1000) / 10 : 0;
        // Redoublement rate (exemple : % des étudiants avec redoublement=true)
        const redoublants = users.filter((u: any) => u.role === 'student' && u.redoublement === true).length;
        const redoublementRate = totalStudents ? Math.round((redoublants / totalStudents) * 1000) / 10 : 0;
        // Scholarship spending (somme des bourses)
        const scholarshipSpending = users.filter((u: any) => u.scholarshipAmount).reduce((acc, u: any) => acc + (u.scholarshipAmount || 0), 0);
        // Conduct average (moyenne des notes de conduite)
        const conductNotes = users.filter((u: any) => typeof u.conduct === 'number').map((u: any) => u.conduct);
        const conductAverage = conductNotes.length ? Math.round((conductNotes.reduce((a, b) => a + b, 0) / conductNotes.length) * 10) / 10 : 0;
        // Active courses
        const coursesSnap = await getDocs(collection(db, 'courses'));
        const courses = coursesSnap.docs.map(doc => doc.data());
        const activeCourses = courses.length;
        // Pending fees (somme des fees non payés)
        const pendingFees = users.filter((u: any) => u.feesPending).reduce((acc, u: any) => acc + (u.feesPending || 0), 0);
        setKpis({
          bacPassRate,
          redoublementRate,
          scholarshipSpending,
          totalStudents,
          activeCourses,
          pendingFees,
          conductAverage
        });
      } catch (err) {
        setError('Erreur lors du chargement des statistiques');
      } finally {
        setLoading(false);
      }
    };
    fetchKPIs();
  }, []);

  const handleStudentSubmit = (studentData: any) => {
    console.log('Student data submitted:', studentData);
    // Here you would typically send to your API
    setShowStudentForm(false);
    setSelectedStudent(null);
  };

  const handleStudentCancel = () => {
    setShowStudentForm(false);
    setSelectedStudent(null);
  };

  if (showStudentForm) {
    return (
      <div className="p-6">
        <MoroccanStudentForm
          studentData={selectedStudent}
          onSubmit={handleStudentSubmit}
          onCancel={handleStudentCancel}
          isEditing={!!selectedStudent}
        />
      </div>
    );
  }

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center text-xl text-gray-500 animate-pulse">Chargement du tableau de bord...</div>;
  }
  if (error) {
    return <div className="flex min-h-screen items-center justify-center text-xl text-red-500">{error}</div>;
  }

  return (
    <div className="min-h-screen w-full h-full bg-gradient-to-br from-blue-50 via-white to-purple-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 transition-colors duration-500 flex flex-col">
      <div className="p-6 space-y-6 w-full flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-4xl font-extrabold mb-1 text-gray-800 dark:text-white tracking-tight flex items-center gap-2">
              <svg width='32' height='32' fill='none' viewBox='0 0 24 24' stroke='currentColor' className='text-blue-500'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M12 4v16m8-8H4'/></svg>
              {t('admin.dashboard')}
            </h1>
            <p className="text-muted-foreground text-base">لوحة قيادة النظام المدرسي المغربي - Moroccan School Management System</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="flex items-center gap-1 px-3 py-2 rounded-full text-base font-semibold bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 border-0">
              <Flag className="h-4 w-4" />
              <span className="text-lg">🇲🇦 Morocco</span>
            </Badge>
          </div>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-6 rounded-2xl bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 mb-6">
            <TabsTrigger value="overview" className="rounded-xl">📊 Overview</TabsTrigger>
            <TabsTrigger value="students" className="rounded-xl">👨‍🎓 Students</TabsTrigger>
            <TabsTrigger value="grades" className="rounded-xl">📝 Grades</TabsTrigger>
            <TabsTrigger value="attendance" className="rounded-xl">📅 Attendance</TabsTrigger>
            <TabsTrigger value="exports" className="rounded-xl">📤 Exports</TabsTrigger>
            <TabsTrigger value="settings" className="rounded-xl">⚙️ Settings</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-8">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* KPI Card Example */}
              <Card className="rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border-0 bg-gradient-to-br from-green-50 to-white dark:from-green-900 dark:to-gray-900">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Bac Pass Rate</CardTitle>
                  <TrendingUp className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-extrabold text-green-600">{kpis.bacPassRate}%</div>
                  <Progress value={kpis.bacPassRate} className="mt-2" />
                  <p className="text-xs text-muted-foreground mt-1">معدل نجاح البكالوريا</p>
                </CardContent>
              </Card>
              <Card className="rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border-0 bg-gradient-to-br from-orange-50 to-white dark:from-orange-900 dark:to-gray-900">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Redoublement Rate</CardTitle>
                  <AlertCircle className="h-4 w-4 text-orange-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-extrabold text-orange-600">{kpis.redoublementRate}%</div>
                  <Progress value={kpis.redoublementRate} className="mt-2" />
                  <p className="text-xs text-muted-foreground mt-1">معدل الإعادة</p>
                </CardContent>
              </Card>
              <Card className="rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border-0 bg-gradient-to-br from-blue-50 to-white dark:from-blue-900 dark:to-gray-900">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Scholarship Spending</CardTitle>
                  <DollarSign className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-extrabold text-blue-600">
                    {kpis.scholarshipSpending.toLocaleString()} MAD
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">إنفاق المنح الدراسية</p>
                </CardContent>
              </Card>
              <Card className="rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border-0 bg-gradient-to-br from-purple-50 to-white dark:from-purple-900 dark:to-gray-900">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Conduct Average</CardTitle>
                  <Award className="h-4 w-4 text-purple-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-extrabold text-purple-600">{kpis.conductAverage}/20</div>
                  <Progress value={(kpis.conductAverage / 20) * 100} className="mt-2" />
                  <p className="text-xs text-muted-foreground mt-1">متوسط درجة السلوك</p>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    {t('admin.userManagement')}
                  </CardTitle>
                  <CardDescription>إدارة الطلاب والأساتذة - Student & Teacher Management</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    onClick={() => setShowStudentForm(true)}
                    className="w-full mb-2 rounded-full flex items-center gap-2 shadow hover:scale-105 transition-transform"
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add New Student
                  </Button>
                  <div className="text-sm text-muted-foreground">
                    Total Students: {kpis.totalStudents.toLocaleString()}
                  </div>
                </CardContent>
              </Card>
              <Card className="rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    Course Management
                  </CardTitle>
                  <CardDescription>إدارة المناهج والمقررات - Curriculum & Courses</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full mb-2 rounded-full flex items-center gap-2 shadow hover:scale-105 transition-transform">
                    <Calendar className="h-4 w-4 mr-2" />
                    Moroccan Schedule
                  </Button>
                  <div className="text-sm text-muted-foreground">
                    Active Courses: {kpis.activeCourses}
                  </div>
                </CardContent>
              </Card>
              <Card className="rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Reports & Exports
                  </CardTitle>
                  <CardDescription>تقارير وزارية - Ministry Reports</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full mb-2 rounded-full flex items-center gap-2 shadow hover:scale-105 transition-transform">
                    <Download className="h-4 w-4 mr-2" />
                    Ministry Export
                  </Button>
                  <div className="text-sm text-muted-foreground">
                    Latest export: Today
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Students Management Tab */}
          <TabsContent value="students" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Moroccan Student Management</h2>
              <Button onClick={() => setShowStudentForm(true)}>
                <UserPlus className="h-4 w-4 mr-2" />
                Add New Student
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Students by Cycle</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Primary (الابتدائي)</span>
                      <Badge>456</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Collège (الإعدادي)</span>
                      <Badge>389</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Lycée (الثانوي)</span>
                      <Badge>402</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Scholarship Recipients</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-600">278</div>
                  <div className="text-sm text-muted-foreground">حاصلون على منحة دراسية</div>
                  <Progress value={22.3} className="mt-2" />
                  <div className="text-xs text-muted-foreground mt-1">22.3% of total students</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Fees Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-green-600">Paid</span>
                      <Badge variant="secondary">1,089</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-orange-600">Pending</span>
                      <Badge variant="outline">134</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-red-600">Overdue</span>
                      <Badge variant="destructive">24</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Grades Management Tab */}
          <TabsContent value="grades" className="space-y-6">
            <h2 className="text-2xl font-bold">Moroccan Grading System (0-20)</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Subject Coefficients</CardTitle>
                  <CardDescription>معاملات المواد حسب المستوى</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span>Mathematics (الرياضيات)</span>
                      <Badge>×7</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Arabic (العربية)</span>
                      <Badge>×4</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>French (الفرنسية)</span>
                      <Badge>×3</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Physics (الفيزياء)</span>
                      <Badge>×6</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Term Averages</CardTitle>
                  <CardDescription>متوسطات الفصول الدراسية</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span>Semestre 1</span>
                      <div className="text-right">
                        <div className="font-bold">14.2/20</div>
                        <div className="text-xs text-muted-foreground">Class average</div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Semestre 2</span>
                      <div className="text-right">
                        <div className="font-bold">13.8/20</div>
                        <div className="text-xs text-muted-foreground">Class average</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Attendance & Conduct Tab */}
          <TabsContent value="attendance" className="space-y-6">
            <h2 className="text-2xl font-bold">Attendance & Conduct Management</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Absences Today</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-red-600">23</div>
                  <div className="text-sm text-muted-foreground">غيابات اليوم</div>
                  <div className="mt-2 space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Justified</span>
                      <span>15</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Unjustified</span>
                      <span className="text-red-600">8</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Late Arrivals</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-orange-600">12</div>
                  <div className="text-sm text-muted-foreground">تأخيرات هذا الأسبوع</div>
                  <div className="mt-2">
                    <Progress value={12} className="h-2" />
                    <div className="text-xs text-muted-foreground mt-1">
                      3+ arrivals trigger parent notification
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Disciplinary Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-purple-600">7</div>
                  <div className="text-sm text-muted-foreground">إجراءات تأديبية هذا الشهر</div>
                  <Button variant="outline" size="sm" className="mt-2 w-full">
                    Generate Convocations
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Ministry Exports Tab */}
          <TabsContent value="exports" className="space-y-6">
            <h2 className="text-2xl font-bold">Ministry & External Exports</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Ministry Formats</CardTitle>
                  <CardDescription>تصدير للوزارة - XML/CSV Compatible</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <Download className="h-4 w-4 mr-2" />
                    Student Records (XML)
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Download className="h-4 w-4 mr-2" />
                    Grade Reports (CSV)
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Download className="h-4 w-4 mr-2" />
                    Attendance Statistics
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>University Orientation</CardTitle>
                  <CardDescription>توجيه جامعي - ParcoursUP & ONOUSC</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <Upload className="h-4 w-4 mr-2" />
                    Export to ParcoursUP
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Upload className="h-4 w-4 mr-2" />
                    ONOUSC Format
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <FileText className="h-4 w-4 mr-2" />
                    Orientation Forms
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Moroccan Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <h2 className="text-2xl font-bold">Moroccan Education Settings</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Academic Calendar</CardTitle>
                  <CardDescription>السنة الدراسية المغربية</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span>Academic Year</span>
                    <Badge>2024-2025</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Year Start</span>
                    <span>1 Sep 2024</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Year End</span>
                    <span>30 Jun 2025</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Weekend</span>
                    <span>Sat & Sun</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Communication Settings</CardTitle>
                  <CardDescription>إعدادات التواصل</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span>SMS Gateway</span>
                    <Badge variant="outline">Inwi</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Currency</span>
                    <Badge>MAD (د.م)</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Grade Scale</span>
                    <Badge>0-20 (Locked)</Badge>
                  </div>
                  <Button variant="outline" size="sm">
                    <Settings className="h-4 w-4 mr-2" />
                    Configure
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;