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
import { db } from "./firebase-admin.js";

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

  // Grade methods
  getAllGrades(): Promise<any[]>;

  // Event methods
  getAllEvents(): Promise<any[]>;
}

export class FirebaseStorage implements IStorage {
  private usersCollection;
  private coursesCollection;
  private enrollmentsCollection;
  private assignmentsCollection;
  private submissionsCollection;
  private notificationsCollection;
  constructor() {
    this.usersCollection = db.collection('users');
    this.coursesCollection = db.collection('courses');
    this.enrollmentsCollection = db.collection('enrollments');
    this.assignmentsCollection = db.collection('assignments');
    this.submissionsCollection = db.collection('submissions');
    this.notificationsCollection = db.collection('notifications');
  }

  // --- User methods ---
  async getUser(id: number): Promise<User | undefined> {
    const doc = await this.usersCollection.doc(id.toString()).get();
    if (!doc.exists) return undefined;
    const data = doc.data();
    return this.mapUser(doc.id, data);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const snapshot = await this.usersCollection.where('email', '==', email).get();
    if (snapshot.empty) return undefined;
    const doc = snapshot.docs[0];
    return this.mapUser(doc.id, doc.data());
  }

  async getAllUsers(): Promise<User[]> {
    const snapshot = await this.usersCollection.get();
    return snapshot.docs.map((doc: any) => this.mapUser(doc.id, doc.data()));
  }

  async createUser(user: InsertUser): Promise<User> {
    // Generate a new numeric id (Firestore does not auto-increment, so use timestamp or a counter if needed)
    const docRef = await this.usersCollection.add(user);
    const doc = await docRef.get();
    return this.mapUser(doc.id, doc.data());
  }

  async updateUser(id: number, updates: Partial<InsertUser>): Promise<User | undefined> {
    const docRef = this.usersCollection.doc(id.toString());
    await docRef.update(updates);
    const doc = await docRef.get();
    if (!doc.exists) return undefined;
    return this.mapUser(doc.id, doc.data());
  }

  async deleteUser(id: number): Promise<boolean> {
    await this.usersCollection.doc(id.toString()).delete();
    return true;
  }

  // --- Course methods ---
  async getCourse(id: number): Promise<Course | undefined> {
    const doc = await this.coursesCollection.doc(id.toString()).get();
    if (!doc.exists) return undefined;
    return { id: Number(doc.id), ...doc.data() } as Course;
  }

  async getAllCourses(): Promise<Course[]> {
    const snapshot = await this.coursesCollection.get();
    return snapshot.docs.map((doc: any) => ({ id: Number(doc.id), ...doc.data() } as Course));
  }

  async createCourse(course: InsertCourse): Promise<Course> {
    const docRef = await this.coursesCollection.add(course);
    const doc = await docRef.get();
    return { id: Number(doc.id), ...doc.data() } as Course;
  }

  async updateCourse(id: number, updates: Partial<InsertCourse>): Promise<Course | undefined> {
    const docRef = this.coursesCollection.doc(id.toString());
    await docRef.update(updates);
    const doc = await docRef.get();
    if (!doc.exists) return undefined;
    return { id: Number(doc.id), ...doc.data() } as Course;
  }

  async deleteCourse(id: number): Promise<boolean> {
    await this.coursesCollection.doc(id.toString()).delete();
    return true;
  }

  // --- Enrollment methods ---
  async getEnrollment(id: number): Promise<Enrollment | undefined> {
    const doc = await this.enrollmentsCollection.doc(id.toString()).get();
    if (!doc.exists) return undefined;
    return { id: Number(doc.id), ...doc.data() } as Enrollment;
  }

  async getAllEnrollments(): Promise<Enrollment[]> {
    const snapshot = await this.enrollmentsCollection.get();
    return snapshot.docs.map((doc: any) => ({ id: Number(doc.id), ...doc.data() } as Enrollment));
  }

  async createEnrollment(enrollment: InsertEnrollment): Promise<Enrollment> {
    const docRef = await this.enrollmentsCollection.add(enrollment);
    const doc = await docRef.get();
    return { id: Number(doc.id), ...doc.data() } as Enrollment;
  }

  async deleteEnrollment(id: number): Promise<boolean> {
    await this.enrollmentsCollection.doc(id.toString()).delete();
    return true;
  }

  // --- Assignment methods ---
  async getAssignment(id: number): Promise<Assignment | undefined> {
    const doc = await this.assignmentsCollection.doc(id.toString()).get();
    if (!doc.exists) return undefined;
    return { id: Number(doc.id), ...doc.data() } as Assignment;
  }

  async getAllAssignments(): Promise<Assignment[]> {
    const snapshot = await this.assignmentsCollection.get();
    return snapshot.docs.map((doc: any) => ({ id: Number(doc.id), ...doc.data() } as Assignment));
  }

  async createAssignment(assignment: InsertAssignment): Promise<Assignment> {
    const docRef = await this.assignmentsCollection.add(assignment);
    const doc = await docRef.get();
    return { id: Number(doc.id), ...doc.data() } as Assignment;
  }

  async updateAssignment(id: number, updates: Partial<InsertAssignment>): Promise<Assignment | undefined> {
    const docRef = this.assignmentsCollection.doc(id.toString());
    await docRef.update(updates);
    const doc = await docRef.get();
    if (!doc.exists) return undefined;
    return { id: Number(doc.id), ...doc.data() } as Assignment;
  }

  async deleteAssignment(id: number): Promise<boolean> {
    await this.assignmentsCollection.doc(id.toString()).delete();
    return true;
  }

  // --- Submission methods ---
  async getSubmission(id: number): Promise<Submission | undefined> {
    const doc = await this.submissionsCollection.doc(id.toString()).get();
    if (!doc.exists) return undefined;
    return { id: Number(doc.id), ...doc.data() } as Submission;
  }

  async getAllSubmissions(): Promise<Submission[]> {
    const snapshot = await this.submissionsCollection.get();
    return snapshot.docs.map((doc: any) => ({ id: Number(doc.id), ...doc.data() } as Submission));
  }

  async createSubmission(submission: InsertSubmission): Promise<Submission> {
    const docRef = await this.submissionsCollection.add(submission);
    const doc = await docRef.get();
    return { id: Number(doc.id), ...doc.data() } as Submission;
  }

  async updateSubmission(id: number, updates: Partial<InsertSubmission>): Promise<Submission | undefined> {
    const docRef = this.submissionsCollection.doc(id.toString());
    await docRef.update(updates);
    const doc = await docRef.get();
    if (!doc.exists) return undefined;
    return { id: Number(doc.id), ...doc.data() } as Submission;
  }

  async deleteSubmission(id: number): Promise<boolean> {
    await this.submissionsCollection.doc(id.toString()).delete();
    return true;
  }

  // --- Notification methods ---
  async getNotification(id: number): Promise<Notification | undefined> {
    const doc = await this.notificationsCollection.doc(id.toString()).get();
    if (!doc.exists) return undefined;
    return { id: Number(doc.id), ...doc.data() } as Notification;
  }

  async getAllNotifications(): Promise<Notification[]> {
    const snapshot = await this.notificationsCollection.get();
    return snapshot.docs.map((doc: any) => ({ id: Number(doc.id), ...doc.data() } as Notification));
  }

  async createNotification(notification: InsertNotification): Promise<Notification> {
    const docRef = await this.notificationsCollection.add(notification);
    const doc = await docRef.get();
    return { id: Number(doc.id), ...doc.data() } as Notification;
  }

  async updateNotification(id: number, updates: Partial<InsertNotification>): Promise<Notification | undefined> {
    const docRef = this.notificationsCollection.doc(id.toString());
    await docRef.update(updates);
    const doc = await docRef.get();
    if (!doc.exists) return undefined;
    return { id: Number(doc.id), ...doc.data() } as Notification;
  }

  async deleteNotification(id: number): Promise<boolean> {
    await this.notificationsCollection.doc(id.toString()).delete();
    return true;
  }

  // --- Grade methods ---
  async getAllGrades(): Promise<any[]> {
    const snapshot = await db.collection('grades').get();
    return snapshot.docs.map((doc: any) => ({ id: Number(doc.id), ...doc.data() }));
  }

  // --- Event methods ---
  async getAllEvents(): Promise<any[]> {
    const snapshot = await db.collection('events').get();
    return snapshot.docs.map((doc: any) => ({ id: Number(doc.id), ...doc.data() }));
  }

  // --- Helper for User mapping ---
  private mapUser(id: string, data: any): User {
    return {
      id: typeof id === 'string' ? parseInt(id, 10) : (typeof id === 'number' ? id : 0),
      firebaseUid: data.firebaseUid ?? null,
      email: data.email ?? null,
      name: data.name ?? null,
      role: data.role ?? null,
      createdAt: data.createdAt ?? null,
      updatedAt: data.updatedAt ?? null,
      massarId: data.massarId ?? null,
      cne: data.cne ?? null,
      apogee: data.apogee ?? null,
      arabicName: data.arabicName ?? null,
      latinName: data.latinName ?? null,
      cin: data.cin ?? null,
      cinIssuePlace: data.cinIssuePlace ?? null,
      cinIssueDate: data.cinIssueDate ?? null,
      wilaya: data.wilaya ?? null,
      province: data.province ?? null,
      communeOfBirth: data.communeOfBirth ?? null,
      academicCycle: data.academicCycle ?? null,
      track: data.track ?? null,
      boursier: data.boursier ?? null,
      scholarshipAmount: data.scholarshipAmount ?? null,
      redoublement: data.redoublement ?? null,
      repeatCount: data.repeatCount ?? null,
      guardianNameArabic: data.guardianNameArabic ?? null,
      guardianRelationship: data.guardianRelationship ?? null,
      guardianPhone: data.guardianPhone ?? null,
      noteConduite: data.noteConduite ?? null,
      feesInsurance: data.feesInsurance ?? null,
      feesCooperative: data.feesCooperative ?? null,
      feesCanteen: data.feesCanteen ?? null,
      feesStatus: data.feesStatus ?? null,
      feesLastPaid: data.feesLastPaid ?? null
    };
  }
}

export const storage = new FirebaseStorage();
