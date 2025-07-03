import { pgTable, text, serial, integer, boolean, timestamp, json, decimal, date } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table with Moroccan student profile extensions
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  firebaseUid: text("firebase_uid").notNull().unique(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  role: text("role").notNull(), // 'student', 'professor', 'admin'
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  
  // 🇲🇦 Moroccan National Student Profile (Admin Only Access)
  massarId: text("massar_id").unique(), // 10-character unique identifier
  cne: text("cne"), // Code National Etudiant
  apogee: text("apogee"), // University registration number
  arabicName: text("arabic_name"), // Name in Arabic
  latinName: text("latin_name"), // Name in Latin characters
  cin: text("cin"), // National ID card
  cinIssuePlace: text("cin_issue_place"), // Where CIN was issued
  cinIssueDate: date("cin_issue_date"), // When CIN was issued
  wilaya: text("wilaya"), // Province/Wilaya
  province: text("province"), // Province
  communeOfBirth: text("commune_of_birth"), // Birth commune
  academicCycle: text("academic_cycle"), // Primary, Collège, Lycée
  track: text("track"), // Academic track (science, literary, technical)
  boursier: boolean("boursier").default(false), // Scholarship recipient
  scholarshipAmount: decimal("scholarship_amount", { precision: 10, scale: 2 }), // Amount in MAD
  redoublement: boolean("redoublement").default(false), // Has repeated a year
  repeatCount: integer("repeat_count").default(0), // Number of times repeated
  
  // 📞 Guardian Information
  guardianNameArabic: text("guardian_name_arabic"), // Guardian name in Arabic
  guardianRelationship: text("guardian_relationship"), // أب / أم / ولي أمر
  guardianPhone: text("guardian_phone"), // Guardian phone number
  
  // 📆 Conduct & Discipline
  noteConduite: decimal("note_conduite", { precision: 3, scale: 1 }), // Conduct grade (0-20)
  
  // 🏛 Fees Management
  feesInsurance: decimal("fees_insurance", { precision: 10, scale: 2 }), // Insurance fees
  feesCooperative: decimal("fees_cooperative", { precision: 10, scale: 2 }), // Cooperative fees
  feesCanteen: decimal("fees_canteen", { precision: 10, scale: 2 }), // Canteen fees
  feesStatus: text("fees_status").default("pending"), // paid, pending, overdue
  feesLastPaid: date("fees_last_paid"), // Last payment date
});

// Courses table
export const courses = pgTable("courses", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  professorId: integer("professor_id").references(() => users.id),
  code: text("code").notNull().unique(),
  credits: integer("credits").default(3),
  schedule: json("schedule"), // JSON object for schedule data
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Enrollments table
export const enrollments = pgTable("enrollments", {
  id: serial("id").primaryKey(),
  studentId: integer("student_id").references(() => users.id),
  courseId: integer("course_id").references(() => courses.id),
  enrolledAt: timestamp("enrolled_at").defaultNow(),
  status: text("status").default("active"), // 'active', 'completed', 'dropped'
});

// Assignments table
export const assignments = pgTable("assignments", {
  id: serial("id").primaryKey(),
  courseId: integer("course_id").references(() => courses.id),
  title: text("title").notNull(),
  description: text("description"),
  dueDate: timestamp("due_date").notNull(),
  maxPoints: integer("max_points").default(100),
  fileUrl: text("file_url"), // Firebase Storage URL
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Submissions table
export const submissions = pgTable("submissions", {
  id: serial("id").primaryKey(),
  assignmentId: integer("assignment_id").references(() => assignments.id),
  studentId: integer("student_id").references(() => users.id),
  fileUrl: text("file_url"), // Firebase Storage URL
  content: text("content"),
  submittedAt: timestamp("submitted_at").defaultNow(),
  grade: integer("grade"),
  feedback: text("feedback"),
  gradedAt: timestamp("graded_at"),
  status: text("status").default("submitted"), // 'submitted', 'graded', 'returned'
});

// Notifications table
export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  title: text("title").notNull(),
  message: text("message").notNull(),
  type: text("type").notNull(), // 'assignment', 'grade', 'announcement', 'general'
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// 🧮 Moroccan Subject Coefficients Table
export const subjectCoefficients = pgTable("subject_coefficients", {
  id: serial("id").primaryKey(),
  academicCycle: text("academic_cycle").notNull(), // Primary, Collège, Lycée
  subjectName: text("subject_name").notNull(), // Math, Arabic, French, etc.
  coefficient: decimal("coefficient", { precision: 3, scale: 1 }).notNull(), // e.g., 7.0 for Math
  isRequired: boolean("is_required").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// 🧮 Student Grades Table (0-20 Moroccan System)
export const grades = pgTable("grades", {
  id: serial("id").primaryKey(),
  studentId: integer("student_id").references(() => users.id),
  courseId: integer("course_id").references(() => courses.id),
  subjectName: text("subject_name").notNull(),
  grade: decimal("grade", { precision: 4, scale: 2 }).notNull(), // 0.00 to 20.00
  coefficient: decimal("coefficient", { precision: 3, scale: 1 }).notNull(),
  term: text("term").notNull(), // Semestre1, Semestre2, Trimestre1, Trimestre2, Trimestre3
  academicYear: text("academic_year").notNull(), // 2024-2025
  gradeType: text("grade_type").notNull(), // controle, exam, regional, national
  createdAt: timestamp("created_at").defaultNow(),
  gradedAt: timestamp("graded_at").defaultNow(),
});

// 🧮 Regional & National Exam Results
export const examResults = pgTable("exam_results", {
  id: serial("id").primaryKey(),
  studentId: integer("student_id").references(() => users.id),
  examType: text("exam_type").notNull(), // regional, national, bacFinal
  grade: decimal("grade", { precision: 4, scale: 2 }).notNull(), // 0.00 to 20.00
  session: text("session").notNull(), // June, Retake
  academicYear: text("academic_year").notNull(),
  passed: boolean("passed").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// 📆 Attendance & Absences Table
export const attendance = pgTable("attendance", {
  id: serial("id").primaryKey(),
  studentId: integer("student_id").references(() => users.id),
  courseId: integer("course_id").references(() => courses.id),
  date: date("date").notNull(),
  status: text("status").notNull(), // present, absent_justified, absent_unjustified, late
  reason: text("reason"), // Reason for absence/lateness
  justificationDocument: text("justification_document"), // URL to uploaded document
  timeArrived: text("time_arrived"), // For late arrivals
  recordedBy: integer("recorded_by").references(() => users.id), // Professor/Admin who recorded
  createdAt: timestamp("created_at").defaultNow(),
});

// 📆 Disciplinary Incidents Table
export const disciplinaryIncidents = pgTable("disciplinary_incidents", {
  id: serial("id").primaryKey(),
  studentId: integer("student_id").references(() => users.id),
  incidentType: text("incident_type").notNull(), // late_arrivals, misconduct, academic_dishonesty
  description: text("description").notNull(),
  decision: text("decision"), // Warning, suspension, expulsion, etc.
  incidentDate: date("incident_date").notNull(),
  reportedBy: integer("reported_by").references(() => users.id),
  convocationGenerated: boolean("convocation_generated").default(false),
  convocationUrl: text("convocation_url"), // PDF URL
  parentNotified: boolean("parent_notified").default(false),
  resolved: boolean("resolved").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// 📚 Moroccan Academic Calendar & Holidays
export const academicCalendar = pgTable("academic_calendar", {
  id: serial("id").primaryKey(),
  eventName: text("event_name").notNull(), // Aïd, Achoura, Spring Break, etc.
  eventType: text("event_type").notNull(), // holiday, exam_period, term_start, term_end
  startDate: date("start_date").notNull(),
  endDate: date("end_date"),
  academicYear: text("academic_year").notNull(),
  description: text("description"),
  isRecurring: boolean("is_recurring").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// 📚 Class Schedules (Moroccan Hours: 08:00-12:00, 14:00-18:00)
export const classSchedules = pgTable("class_schedules", {
  id: serial("id").primaryKey(),
  courseId: integer("course_id").references(() => courses.id),
  dayOfWeek: text("day_of_week").notNull(), // Monday-Friday (or Saturday for some schools)
  startTime: text("start_time").notNull(), // 08:00, 14:00, etc.
  endTime: text("end_time").notNull(), // 12:00, 18:00, etc.
  classroom: text("classroom"),
  academicYear: text("academic_year").notNull(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// 🏛 System Settings (Moroccan Education Defaults)
export const systemSettings = pgTable("system_settings", {
  id: serial("id").primaryKey(),
  settingKey: text("setting_key").notNull().unique(),
  settingValue: text("setting_value").notNull(),
  settingType: text("setting_type").notNull(), // string, number, boolean, json
  description: text("description"),
  category: text("category").notNull(), // grading, calendar, fees, communication
  isEditable: boolean("is_editable").default(true),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCourseSchema = createInsertSchema(courses).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertEnrollmentSchema = createInsertSchema(enrollments).omit({
  id: true,
  enrolledAt: true,
});

export const insertAssignmentSchema = createInsertSchema(assignments).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertSubmissionSchema = createInsertSchema(submissions).omit({
  id: true,
  submittedAt: true,
  gradedAt: true,
});

export const insertNotificationSchema = createInsertSchema(notifications).omit({
  id: true,
  createdAt: true,
});

// 🧮 Moroccan Education System Insert Schemas
export const insertSubjectCoefficientSchema = createInsertSchema(subjectCoefficients).omit({
  id: true,
  createdAt: true,
});

export const insertGradeSchema = createInsertSchema(grades).omit({
  id: true,
  createdAt: true,
  gradedAt: true,
});

export const insertExamResultSchema = createInsertSchema(examResults).omit({
  id: true,
  createdAt: true,
});

export const insertAttendanceSchema = createInsertSchema(attendance).omit({
  id: true,
  createdAt: true,
});

export const insertDisciplinaryIncidentSchema = createInsertSchema(disciplinaryIncidents).omit({
  id: true,
  createdAt: true,
});

export const insertAcademicCalendarSchema = createInsertSchema(academicCalendar).omit({
  id: true,
  createdAt: true,
});

export const insertClassScheduleSchema = createInsertSchema(classSchedules).omit({
  id: true,
  createdAt: true,
});

export const insertSystemSettingSchema = createInsertSchema(systemSettings).omit({
  id: true,
  updatedAt: true,
});

// Types - Original
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Course = typeof courses.$inferSelect;
export type InsertCourse = z.infer<typeof insertCourseSchema>;
export type Enrollment = typeof enrollments.$inferSelect;
export type InsertEnrollment = z.infer<typeof insertEnrollmentSchema>;
export type Assignment = typeof assignments.$inferSelect;
export type InsertAssignment = z.infer<typeof insertAssignmentSchema>;
export type Submission = typeof submissions.$inferSelect;
export type InsertSubmission = z.infer<typeof insertSubmissionSchema>;
export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = z.infer<typeof insertNotificationSchema>;

// Types - Moroccan Education System
export type SubjectCoefficient = typeof subjectCoefficients.$inferSelect;
export type InsertSubjectCoefficient = z.infer<typeof insertSubjectCoefficientSchema>;
export type Grade = typeof grades.$inferSelect;
export type InsertGrade = z.infer<typeof insertGradeSchema>;
export type ExamResult = typeof examResults.$inferSelect;
export type InsertExamResult = z.infer<typeof insertExamResultSchema>;
export type Attendance = typeof attendance.$inferSelect;
export type InsertAttendance = z.infer<typeof insertAttendanceSchema>;
export type DisciplinaryIncident = typeof disciplinaryIncidents.$inferSelect;
export type InsertDisciplinaryIncident = z.infer<typeof insertDisciplinaryIncidentSchema>;
export type AcademicCalendar = typeof academicCalendar.$inferSelect;
export type InsertAcademicCalendar = z.infer<typeof insertAcademicCalendarSchema>;
export type ClassSchedule = typeof classSchedules.$inferSelect;
export type InsertClassSchedule = z.infer<typeof insertClassScheduleSchema>;
export type SystemSetting = typeof systemSettings.$inferSelect;
export type InsertSystemSetting = z.infer<typeof insertSystemSettingSchema>;
