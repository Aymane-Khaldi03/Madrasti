import { 
  users, 
  courses, 
  enrollments, 
  assignments, 
  submissions, 
  notifications,
  type User, 
  type InsertUser,
  type Course,
  type InsertCourse,
  type Enrollment,
  type InsertEnrollment,
  type Assignment,
  type InsertAssignment,
  type Submission,
  type InsertSubmission,
  type Notification,
  type InsertNotification
} from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getAllUsers(): Promise<User[]>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: Partial<InsertUser>): Promise<User | undefined>;
  deleteUser(id: number): Promise<boolean>;

  // Course methods
  getCourse(id: number): Promise<Course | undefined>;
  getAllCourses(): Promise<Course[]>;
  createCourse(course: InsertCourse): Promise<Course>;
  updateCourse(id: number, updates: Partial<InsertCourse>): Promise<Course | undefined>;
  deleteCourse(id: number): Promise<boolean>;

  // Enrollment methods
  getEnrollment(id: number): Promise<Enrollment | undefined>;
  getAllEnrollments(): Promise<Enrollment[]>;
  createEnrollment(enrollment: InsertEnrollment): Promise<Enrollment>;
  deleteEnrollment(id: number): Promise<boolean>;

  // Assignment methods
  getAssignment(id: number): Promise<Assignment | undefined>;
  getAllAssignments(): Promise<Assignment[]>;
  createAssignment(assignment: InsertAssignment): Promise<Assignment>;
  updateAssignment(id: number, updates: Partial<InsertAssignment>): Promise<Assignment | undefined>;
  deleteAssignment(id: number): Promise<boolean>;

  // Submission methods
  getSubmission(id: number): Promise<Submission | undefined>;
  getAllSubmissions(): Promise<Submission[]>;
  createSubmission(submission: InsertSubmission): Promise<Submission>;
  updateSubmission(id: number, updates: Partial<InsertSubmission>): Promise<Submission | undefined>;
  deleteSubmission(id: number): Promise<boolean>;

  // Notification methods
  getNotification(id: number): Promise<Notification | undefined>;
  getAllNotifications(): Promise<Notification[]>;
  createNotification(notification: InsertNotification): Promise<Notification>;
  updateNotification(id: number, updates: Partial<InsertNotification>): Promise<Notification | undefined>;
  deleteNotification(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User> = new Map();
  private courses: Map<number, Course> = new Map();
  private enrollments: Map<number, Enrollment> = new Map();
  private assignments: Map<number, Assignment> = new Map();
  private submissions: Map<number, Submission> = new Map();
  private notifications: Map<number, Notification> = new Map();
  private currentUserId: number = 1;
  private currentCourseId: number = 1;
  private currentEnrollmentId: number = 1;
  private currentAssignmentId: number = 1;
  private currentSubmissionId: number = 1;
  private currentNotificationId: number = 1;

  constructor() {
    // Initialize with some sample data
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Sample Moroccan student with comprehensive data
    const student: User = {
      id: this.currentUserId++,
      firebaseUid: "student-1",
      email: "student@example.com",
      name: "Fatima Zahra Benali",
      role: "student",
      createdAt: new Date(),
      updatedAt: new Date(),
      // Moroccan student fields
      massarId: "ST20241001",
      cne: "R148523697",
      apogee: "21001234",
      arabicName: "فاطمة الزهراء بنعلي",
      latinName: "Fatima Zahra Benali",
      cin: "AB123456",
      cinIssuePlace: "Casablanca",
      cinIssueDate: "2006-01-15",
      wilaya: "Casablanca-Settat",
      province: "Casablanca",
      communeOfBirth: "Casablanca",
      academicCycle: "Lycée",
      track: "Sciences Mathématiques",
      boursier: true,
      scholarshipAmount: "2500.00",
      redoublement: false,
      repeatCount: 0,
      guardianNameArabic: "أحمد بنعلي",
      guardianRelationship: "أب",
      guardianPhone: "+212661234567",
      noteConduite: "18.5",
      feesInsurance: "200.00",
      feesCooperative: "150.00",
      feesCanteen: "800.00",
      feesStatus: "paid",
      feesLastPaid: "2024-09-01"
    };

    const professor: User = {
      id: this.currentUserId++,
      firebaseUid: "professor-1",
      email: "professor@example.com",
      name: "Dr. Youssef Alami",
      role: "professor",
      createdAt: new Date(),
      updatedAt: new Date(),
      // Non-student users have null values for student-specific fields
      massarId: null,
      cne: null,
      apogee: null,
      arabicName: "د. يوسف العلمي",
      latinName: "Dr. Youssef Alami",
      cin: null,
      cinIssuePlace: null,
      cinIssueDate: null,
      wilaya: null,
      province: null,
      communeOfBirth: null,
      academicCycle: null,
      track: null,
      boursier: null,
      scholarshipAmount: null,
      redoublement: null,
      repeatCount: null,
      guardianNameArabic: null,
      guardianRelationship: null,
      guardianPhone: null,
      noteConduite: null,
      feesInsurance: null,
      feesCooperative: null,
      feesCanteen: null,
      feesStatus: null,
      feesLastPaid: null
    };

    const admin: User = {
      id: this.currentUserId++,
      firebaseUid: "admin-1",
      email: "admin@example.com",
      name: "Amina Hassani",
      role: "admin",
      createdAt: new Date(),
      updatedAt: new Date(),
      // Admin user with null values for student-specific fields
      massarId: null,
      cne: null,
      apogee: null,
      arabicName: "آمينة حساني",
      latinName: "Amina Hassani",
      cin: null,
      cinIssuePlace: null,
      cinIssueDate: null,
      wilaya: null,
      province: null,
      communeOfBirth: null,
      academicCycle: null,
      track: null,
      boursier: null,
      scholarshipAmount: null,
      redoublement: null,
      repeatCount: null,
      guardianNameArabic: null,
      guardianRelationship: null,
      guardianPhone: null,
      noteConduite: null,
      feesInsurance: null,
      feesCooperative: null,
      feesCanteen: null,
      feesStatus: null,
      feesLastPaid: null
    };

    // For demo purposes, add password field
    (student as any).password = "student123";
    (professor as any).password = "professor123";
    (admin as any).password = "admin123";

    this.users.set(student.id, student);
    this.users.set(professor.id, professor);
    this.users.set(admin.id, admin);

    // Sample courses
    const calculus: Course = {
      id: this.currentCourseId++,
      title: "Calculus I",
      description: "Introduction to differential and integral calculus",
      professorId: professor.id,
      code: "MATH101",
      credits: 3,
      schedule: { days: ["Monday", "Wednesday", "Friday"], time: "10:00 AM" },
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const physics: Course = {
      id: this.currentCourseId++,
      title: "Physics II",
      description: "Electricity and magnetism",
      professorId: professor.id,
      code: "PHYS201",
      credits: 4,
      schedule: { days: ["Tuesday", "Thursday"], time: "2:00 PM" },
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.courses.set(calculus.id, calculus);
    this.courses.set(physics.id, physics);

    // Sample enrollment
    const enrollment: Enrollment = {
      id: this.currentEnrollmentId++,
      studentId: student.id,
      courseId: calculus.id,
      enrolledAt: new Date(),
      status: "active",
    };

    this.enrollments.set(enrollment.id, enrollment);
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = {
      ...insertUser,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: number, updates: Partial<InsertUser>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;

    const updatedUser: User = {
      ...user,
      ...updates,
      updatedAt: new Date(),
    };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async deleteUser(id: number): Promise<boolean> {
    return this.users.delete(id);
  }

  // Course methods
  async getCourse(id: number): Promise<Course | undefined> {
    return this.courses.get(id);
  }

  async getAllCourses(): Promise<Course[]> {
    return Array.from(this.courses.values());
  }

  async createCourse(insertCourse: InsertCourse): Promise<Course> {
    const id = this.currentCourseId++;
    const course: Course = {
      ...insertCourse,
      id,
      description: insertCourse.description || null,
      professorId: insertCourse.professorId || null,
      credits: insertCourse.credits || null,
      schedule: insertCourse.schedule || null,
      isActive: insertCourse.isActive !== undefined ? insertCourse.isActive : null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.courses.set(id, course);
    return course;
  }

  async updateCourse(id: number, updates: Partial<InsertCourse>): Promise<Course | undefined> {
    const course = this.courses.get(id);
    if (!course) return undefined;

    const updatedCourse: Course = {
      ...course,
      ...updates,
      updatedAt: new Date(),
    };
    this.courses.set(id, updatedCourse);
    return updatedCourse;
  }

  async deleteCourse(id: number): Promise<boolean> {
    return this.courses.delete(id);
  }

  // Enrollment methods
  async getEnrollment(id: number): Promise<Enrollment | undefined> {
    return this.enrollments.get(id);
  }

  async getAllEnrollments(): Promise<Enrollment[]> {
    return Array.from(this.enrollments.values());
  }

  async createEnrollment(insertEnrollment: InsertEnrollment): Promise<Enrollment> {
    const id = this.currentEnrollmentId++;
    const enrollment: Enrollment = {
      id,
      studentId: insertEnrollment.studentId || null,
      courseId: insertEnrollment.courseId || null,
      status: insertEnrollment.status || null,
      enrolledAt: new Date(),
    };
    this.enrollments.set(id, enrollment);
    return enrollment;
  }

  async deleteEnrollment(id: number): Promise<boolean> {
    return this.enrollments.delete(id);
  }

  // Assignment methods
  async getAssignment(id: number): Promise<Assignment | undefined> {
    return this.assignments.get(id);
  }

  async getAllAssignments(): Promise<Assignment[]> {
    return Array.from(this.assignments.values());
  }

  async createAssignment(insertAssignment: InsertAssignment): Promise<Assignment> {
    const id = this.currentAssignmentId++;
    const assignment: Assignment = {
      id,
      title: insertAssignment.title,
      description: insertAssignment.description || null,
      courseId: insertAssignment.courseId || null,
      dueDate: insertAssignment.dueDate,
      maxPoints: insertAssignment.maxPoints || null,
      fileUrl: insertAssignment.fileUrl || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.assignments.set(id, assignment);
    return assignment;
  }

  async updateAssignment(id: number, updates: Partial<InsertAssignment>): Promise<Assignment | undefined> {
    const assignment = this.assignments.get(id);
    if (!assignment) return undefined;

    const updatedAssignment: Assignment = {
      ...assignment,
      ...updates,
      updatedAt: new Date(),
    };
    this.assignments.set(id, updatedAssignment);
    return updatedAssignment;
  }

  async deleteAssignment(id: number): Promise<boolean> {
    return this.assignments.delete(id);
  }

  // Submission methods
  async getSubmission(id: number): Promise<Submission | undefined> {
    return this.submissions.get(id);
  }

  async getAllSubmissions(): Promise<Submission[]> {
    return Array.from(this.submissions.values());
  }

  async createSubmission(insertSubmission: InsertSubmission): Promise<Submission> {
    const id = this.currentSubmissionId++;
    const submission: Submission = {
      id,
      assignmentId: insertSubmission.assignmentId || null,
      studentId: insertSubmission.studentId || null,
      fileUrl: insertSubmission.fileUrl || null,
      content: insertSubmission.content || null,
      status: insertSubmission.status || null,
      grade: insertSubmission.grade || null,
      feedback: insertSubmission.feedback || null,
      submittedAt: new Date(),
      gradedAt: null,
    };
    this.submissions.set(id, submission);
    return submission;
  }

  async updateSubmission(id: number, updates: Partial<InsertSubmission>): Promise<Submission | undefined> {
    const submission = this.submissions.get(id);
    if (!submission) return undefined;

    const updatedSubmission: Submission = {
      ...submission,
      ...updates,
      gradedAt: updates.grade ? new Date() : submission.gradedAt,
    };
    this.submissions.set(id, updatedSubmission);
    return updatedSubmission;
  }

  async deleteSubmission(id: number): Promise<boolean> {
    return this.submissions.delete(id);
  }

  // Notification methods
  async getNotification(id: number): Promise<Notification | undefined> {
    return this.notifications.get(id);
  }

  async getAllNotifications(): Promise<Notification[]> {
    return Array.from(this.notifications.values());
  }

  async createNotification(insertNotification: InsertNotification): Promise<Notification> {
    const id = this.currentNotificationId++;
    const notification: Notification = {
      id,
      userId: insertNotification.userId || null,
      title: insertNotification.title,
      message: insertNotification.message,
      type: insertNotification.type,
      isRead: insertNotification.isRead || null,
      createdAt: new Date(),
    };
    this.notifications.set(id, notification);
    return notification;
  }

  async updateNotification(id: number, updates: Partial<InsertNotification>): Promise<Notification | undefined> {
    const notification = this.notifications.get(id);
    if (!notification) return undefined;

    const updatedNotification: Notification = {
      ...notification,
      ...updates,
    };
    this.notifications.set(id, updatedNotification);
    return updatedNotification;
  }

  async deleteNotification(id: number): Promise<boolean> {
    return this.notifications.delete(id);
  }
}

export const storage = new MemStorage();
