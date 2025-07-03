import { createContext, useContext } from 'react';

export interface Translations {
  [key: string]: string | Translations;
}

export const translations: Record<string, Translations> = {
  en: {
    common: {
      welcome: "Welcome to EduSphere",
      tagline: "Modern School Management",
      login: "Login",
      logout: "Logout",
      loading: "Loading...",
      error: "Error",
      success: "Success",
      save: "Save",
      cancel: "Cancel",
      edit: "Edit",
      delete: "Delete",
      add: "Add",
      view: "View",
      upload: "Upload",
      download: "Download",
      dashboard: "Dashboard",
      profile: "Profile",
      settings: "Settings",
      notifications: "Notifications",
      calendar: "Calendar",
      search: "Search"
    },
    navigation: {
      home: "Home",
      dashboard: "Dashboard",
      courses: "Courses",
      assignments: "Assignments",
      grades: "Grades",
      calendar: "Calendar",
      reports: "Reports",
      users: "Users",
      settings: "Settings",
      features: "Features",
      roles: "Roles"
    },
    hero: {
      description: "A comprehensive school data management platform designed to streamline education administration, enhance learning experiences, and foster academic excellence.",
      getStarted: "Get Started",
      learnMore: "Learn More"
    },
    features: {
      title: "Platform Features",
      description: "Discover powerful tools designed to enhance your educational experience",
      modernInterface: "Modern Interface",
      modernInterfaceDesc: "Clean, responsive design that works seamlessly on all devices",
      roleBasedAccess: "Role-Based Access",
      roleBasedAccessDesc: "Tailored experiences for students, professors, and administrators",
      courseManagement: "Course Management",
      courseManagementDesc: "Complete solution for academic course administration",
      analytics: "Advanced Analytics",
      analyticsDesc: "Real-time insights and comprehensive reporting tools",
      scheduling: "Smart Scheduling",
      schedulingDesc: "Intelligent scheduling system for classes and resources",
      assessment: "Assessment Tools",
      assessmentDesc: "Comprehensive assessment and grading capabilities"
    },
    roles: {
      student: "Student",
      professor: "Professor",
      admin: "Administrator",
      chooseRole: "Choose Your Role",
      chooseRoleDescription: "Select your role to access your personalized dashboard and features",
      loginAs: "Login as",
      roleDescription: "Select your role to access your personalized dashboard",
      studentDesc: "Access courses, assignments, and track your academic progress",
      professorDesc: "Manage courses, assess students, and share educational resources",
      adminDesc: "Oversee platform operations, manage users, and generate reports",
      features: {
        accessCourses: "Access enrolled courses",
        submitAssignments: "Submit assignments online",
        trackProgress: "Track academic progress",
        manageCourses: "Manage course content",
        gradeAssignments: "Grade and assess students",
        trackStudents: "Monitor student progress",
        manageUsers: "Manage platform users",
        systemOverview: "System-wide analytics",
        generateReports: "Generate detailed reports"
      }
    },
    stats: {
      students: "Active Students",
      courses: "Available Courses",
      professors: "Expert Professors",
      satisfaction: "User Satisfaction"
    },
    footer: {
      description: "Empowering education through innovative technology and seamless management solutions.",
      copyright: "All rights reserved. Modern School Management Platform"
    },
    auth: {
      signIn: "Sign In",
      signOut: "Sign Out",
      email: "Email Address",
      password: "Password",
      rememberMe: "Remember me",
      forgotPassword: "Forgot password?",
      loginFailed: "Login failed. Please check your credentials.",
      login: "Login",
      register: "Register"
    },
    student: {
      dashboard: "Student Dashboard",
      myCourses: "My Courses",
      assignments: "Assignments",
      grades: "Grades",
      schedule: "Schedule",
      resources: "Resources",
      announcements: "Announcements"
    },
    professor: {
      dashboard: "Professor Dashboard",
      myCourses: "My Courses",
      students: "Students",
      assignments: "Assignments",
      gradebook: "Gradebook",
      attendance: "Attendance",
      schedule: "Teaching Schedule",
      resources: "Course Resources",
      announcements: "Announcements",
      courseManagement: "Course Management"
    },
    admin: {
      dashboard: "Administrator Dashboard",
      userManagement: "User Management",
      courseManagement: "Course Management",
      systemReports: "System Reports",
      analytics: "Analytics",
      settings: "System Settings",
      backup: "Backup",
      maintenance: "Maintenance",
      audit: "Audit Logs",
      statistics: "Statistics"
    }
  },
  ar: {
    common: {
      welcome: "مرحباً بكم في إيدوسفير",
      tagline: "إدارة مدرسية حديثة",
      login: "تسجيل الدخول",
      logout: "تسجيل الخروج",
      loading: "جارٍ التحميل...",
      error: "خطأ",
      success: "نجح",
      save: "حفظ",
      cancel: "إلغاء",
      edit: "تعديل",
      delete: "حذف",
      add: "إضافة",
      view: "عرض",
      upload: "رفع",
      download: "تحميل",
      dashboard: "لوحة القيادة",
      profile: "الملف الشخصي",
      settings: "الإعدادات",
      notifications: "الإشعارات",
      calendar: "التقويم",
      search: "بحث"
    },
    navigation: {
      home: "الرئيسية",
      dashboard: "لوحة القيادة",
      courses: "المقررات",
      assignments: "المهام",
      grades: "الدرجات",
      calendar: "التقويم",
      reports: "التقارير",
      users: "المستخدمون",
      settings: "الإعدادات",
      features: "الميزات",
      roles: "الأدوار"
    },
    hero: {
      description: "منصة إدارة بيانات مدرسية شاملة مصممة لتبسيط الإدارة التعليمية وتعزيز تجارب التعلم وتشجيع التميز الأكاديمي.",
      getStarted: "ابدأ الآن",
      learnMore: "تعرف على المزيد"
    },
    features: {
      title: "ميزات المنصة",
      description: "اكتشف أدوات قوية مصممة لتعزيز تجربتك التعليمية",
      modernInterface: "واجهة حديثة",
      modernInterfaceDesc: "تصميم نظيف ومتجاوب يعمل بسلاسة على جميع الأجهزة",
      roleBasedAccess: "وصول قائم على الأدوار",
      roleBasedAccessDesc: "تجارب مخصصة للطلاب والأساتذة والإداريين",
      courseManagement: "إدارة المقررات",
      courseManagementDesc: "حل شامل لإدارة المقررات الأكاديمية",
      analytics: "تحليلات متقدمة",
      analyticsDesc: "رؤى فورية وأدوات تقارير شاملة",
      scheduling: "جدولة ذكية",
      schedulingDesc: "نظام جدولة ذكي للفصول والموارد",
      assessment: "أدوات التقييم",
      assessmentDesc: "قدرات تقييم ودرجات شاملة"
    },
    roles: {
      student: "طالب",
      professor: "أستاذ",
      admin: "مدير",
      chooseRole: "اختر دورك",
      chooseRoleDescription: "اختر دورك للوصول إلى لوحة القيادة والميزات المخصصة لك",
      loginAs: "تسجيل الدخول كـ",
      roleDescription: "اختر دورك للوصول إلى لوحة القيادة المخصصة لك",
      studentDesc: "الوصول إلى المقررات والمهام وتتبع التقدم الأكاديمي",
      professorDesc: "إدارة المقررات وتقييم الطلاب ومشاركة الموارد التعليمية",
      adminDesc: "الإشراف على عمليات المنصة وإدارة المستخدمين وإنشاء التقارير",
      features: {
        accessCourses: "الوصول إلى المقررات المسجلة",
        submitAssignments: "تقديم المهام عبر الإنترنت",
        trackProgress: "تتبع التقدم الأكاديمي",
        manageCourses: "إدارة محتوى المقرر",
        gradeAssignments: "تقييم ودرجات الطلاب",
        trackStudents: "مراقبة تقدم الطلاب",
        manageUsers: "إدارة مستخدمي المنصة",
        systemOverview: "تحليلات على مستوى النظام",
        generateReports: "إنشاء تقارير مفصلة"
      }
    },
    stats: {
      students: "الطلاب النشطون",
      courses: "المقررات المتاحة",
      professors: "الأساتذة الخبراء",
      satisfaction: "رضا المستخدمين"
    },
    footer: {
      description: "تمكين التعليم من خلال التكنولوجيا المبتكرة وحلول الإدارة السلسة.",
      copyright: "جميع الحقوق محفوظة. منصة إدارة مدرسية حديثة"
    },
    auth: {
      signIn: "تسجيل الدخول",
      signOut: "تسجيل الخروج",
      email: "عنوان البريد الإلكتروني",
      password: "كلمة المرور",
      rememberMe: "تذكرني",
      forgotPassword: "نسيت كلمة المرور؟",
      loginFailed: "فشل تسجيل الدخول. يرجى التحقق من بياناتك.",
      login: "تسجيل الدخول",
      register: "التسجيل"
    },
    student: {
      dashboard: "لوحة قيادة الطالب",
      myCourses: "مقرراتي",
      assignments: "المهام",
      grades: "الدرجات",
      schedule: "الجدول",
      resources: "الموارد",
      announcements: "الإعلانات"
    },
    professor: {
      dashboard: "لوحة قيادة الأستاذ",
      myCourses: "مقرراتي",
      students: "الطلاب",
      assignments: "المهام",
      gradebook: "دفتر الدرجات",
      attendance: "الحضور",
      schedule: "جدول التدريس",
      resources: "موارد المقرر",
      announcements: "الإعلانات",
      courseManagement: "إدارة المقررات"
    },
    admin: {
      dashboard: "لوحة قيادة المدير",
      userManagement: "إدارة المستخدمين",
      courseManagement: "إدارة المقررات",
      systemReports: "تقارير النظام",
      analytics: "التحليلات",
      settings: "إعدادات النظام",
      backup: "النسخ الاحتياطي",
      maintenance: "الصيانة",
      audit: "سجلات التدقيق",
      statistics: "الإحصائيات"
    }
  },
  fr: {
    common: {
      welcome: "Bienvenue sur EduSphere",
      tagline: "Gestion Scolaire Moderne",
      login: "Connexion",
      logout: "Déconnexion",
      loading: "Chargement...",
      error: "Erreur",
      success: "Succès",
      save: "Enregistrer",
      cancel: "Annuler",
      edit: "Modifier",
      delete: "Supprimer",
      add: "Ajouter",
      view: "Voir",
      upload: "Télécharger",
      download: "Télécharger",
      dashboard: "Tableau de bord",
      profile: "Profil",
      settings: "Paramètres",
      notifications: "Notifications",
      calendar: "Calendrier",
      search: "Rechercher"
    },
    navigation: {
      home: "Accueil",
      dashboard: "Tableau de bord",
      courses: "Cours",
      assignments: "Devoirs",
      grades: "Notes",
      calendar: "Calendrier",
      reports: "Rapports",
      users: "Utilisateurs",
      settings: "Paramètres",
      features: "Fonctionnalités",
      roles: "Rôles"
    },
    hero: {
      description: "Une plateforme complète de gestion des données scolaires conçue pour rationaliser l'administration éducative, améliorer les expériences d'apprentissage et favoriser l'excellence académique.",
      getStarted: "Commencer",
      learnMore: "En savoir plus"
    },
    features: {
      title: "Fonctionnalités de la Plateforme",
      description: "Découvrez des outils puissants conçus pour améliorer votre expérience éducative",
      modernInterface: "Interface Moderne",
      modernInterfaceDesc: "Design propre et responsive qui fonctionne parfaitement sur tous les appareils",
      roleBasedAccess: "Accès Basé sur les Rôles",
      roleBasedAccessDesc: "Expériences personnalisées pour les étudiants, professeurs et administrateurs",
      courseManagement: "Gestion des Cours",
      courseManagementDesc: "Solution complète pour l'administration des cours académiques",
      analytics: "Analyses Avancées",
      analyticsDesc: "Insights en temps réel et outils de reporting complets",
      scheduling: "Planification Intelligente",
      schedulingDesc: "Système de planification intelligent pour les cours et ressources",
      assessment: "Outils d'Évaluation",
      assessmentDesc: "Capacités d'évaluation et de notation complètes"
    },
    roles: {
      student: "Étudiant",
      professor: "Professeur",
      admin: "Administrateur",
      chooseRole: "Choisissez votre rôle",
      chooseRoleDescription: "Sélectionnez votre rôle pour accéder à votre tableau de bord et fonctionnalités personnalisés",
      loginAs: "Se connecter en tant que",
      roleDescription: "Sélectionnez votre rôle pour accéder à votre tableau de bord personnalisé",
      studentDesc: "Accéder aux cours, devoirs et suivre vos progrès académiques",
      professorDesc: "Gérer les cours, évaluer les étudiants et partager les ressources éducatives",
      adminDesc: "Superviser les opérations de la plateforme, gérer les utilisateurs et générer des rapports",
      features: {
        accessCourses: "Accéder aux cours inscrits",
        submitAssignments: "Soumettre les devoirs en ligne",
        trackProgress: "Suivre les progrès académiques",
        manageCourses: "Gérer le contenu des cours",
        gradeAssignments: "Noter et évaluer les étudiants",
        trackStudents: "Surveiller les progrès des étudiants",
        manageUsers: "Gérer les utilisateurs de la plateforme",
        systemOverview: "Analyses à l'échelle du système",
        generateReports: "Générer des rapports détaillés"
      }
    },
    stats: {
      students: "Étudiants Actifs",
      courses: "Cours Disponibles",
      professors: "Professeurs Experts",
      satisfaction: "Satisfaction Utilisateur"
    },
    footer: {
      description: "Autonomiser l'éducation grâce à la technologie innovante et aux solutions de gestion transparentes.",
      copyright: "Tous droits réservés. Plateforme de Gestion Scolaire Moderne"
    },
    auth: {
      signIn: "Se connecter",
      signOut: "Se déconnecter",
      email: "Adresse email",
      password: "Mot de passe",
      rememberMe: "Se souvenir de moi",
      forgotPassword: "Mot de passe oublié?",
      loginFailed: "Échec de la connexion. Veuillez vérifier vos identifiants.",
      login: "Connexion",
      register: "S'inscrire"
    },
    student: {
      dashboard: "Tableau de bord Étudiant",
      myCourses: "Mes Cours",
      assignments: "Devoirs",
      grades: "Notes",
      schedule: "Horaire",
      resources: "Ressources",
      announcements: "Annonces"
    },
    professor: {
      dashboard: "Tableau de bord Professeur",
      myCourses: "Mes Cours",
      students: "Étudiants",
      assignments: "Devoirs",
      gradebook: "Carnet de Notes",
      attendance: "Présence",
      schedule: "Horaire d'Enseignement",
      resources: "Ressources de Cours",
      announcements: "Annonces",
      courseManagement: "Gestion des Cours"
    },
    admin: {
      dashboard: "Tableau de bord Administrateur",
      userManagement: "Gestion des Utilisateurs",
      courseManagement: "Gestion des Cours",
      systemReports: "Rapports Système",
      analytics: "Analyses",
      settings: "Paramètres Système",
      backup: "Sauvegarde",
      maintenance: "Maintenance",
      audit: "Journaux d'Audit",
      statistics: "Statistiques"
    }
  }
};

export const LanguageContext = createContext<{
  language: string;
  setLanguage: (lang: string) => void;
  t: (key: string) => string;
} | null>(null);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};