export interface User {
  id: string;
  uid: string;
  email: string;
  name: string;
  role: 'student' | 'professor' | 'admin';
  createdAt: Date;
  updatedAt?: Date;
}

export interface Course {
  id: string;
  title: string;
  description?: string;
  professorId: string;
  professorName: string;
  code: string;
  credits: number;
  schedule?: {
    days: string[];
    time: string;
    location?: string;
  };
  isActive: boolean;
  createdAt: Date;
  updatedAt?: Date;
}

export interface Enrollment {
  id: string;
  studentId: string;
  courseId: string;
  enrolledAt: Date;
  status: 'active' | 'completed' | 'dropped';
}

export interface Assignment {
  id: string;
  courseId: string;
  courseName: string;
  title: string;
  description?: string;
  dueDate: Date;
  maxPoints: number;
  fileUrl?: string;
  createdAt: Date;
  updatedAt?: Date;
}

export interface Submission {
  id: string;
  assignmentId: string;
  studentId: string;
  studentName: string;
  fileUrl?: string;
  content?: string;
  submittedAt: Date;
  grade?: number;
  feedback?: string;
  gradedAt?: Date;
  status: 'submitted' | 'graded' | 'returned';
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'assignment' | 'grade' | 'announcement' | 'general';
  isRead: boolean;
  createdAt: Date;
}

export interface DashboardStats {
  student: {
    enrolledCourses: number;
    completedAssignments: number;
    pendingAssignments: number;
    averageGrade: number;
  };
  professor: {
    activeCourses: number;
    totalStudents: number;
    pendingReviews: number;
    classAverage: number;
  };
  admin: {
    totalUsers: number;
    activeCourses: number;
    graduationRate: number;
    platformUsage: number;
  };
}
