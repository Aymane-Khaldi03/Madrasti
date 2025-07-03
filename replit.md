# EduSphere (Madrasti) - Moroccan School Data Management Platform

## Overview

EduSphere (also known as Madrasti) is a comprehensive, multilingual school data management platform specifically designed for the Moroccan education system. The application integrates traditional school management features with Morocco-specific requirements including MASSAR ID management, 0-20 grading system, regional/national exam tracking, and Ministry of Education export formats. Built with a React frontend and Express backend, it combines Firebase Authentication with a PostgreSQL database via Drizzle ORM.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **UI Library**: Radix UI components with Tailwind CSS
- **Styling**: Tailwind CSS with CSS variables for theming
- **State Management**: React Context API for auth, theme, and language
- **Routing**: Wouter for client-side routing
- **Data Fetching**: TanStack Query for server state management
- **Build Tool**: Vite for fast development and optimized builds

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Authentication**: Firebase Authentication (email/password)
- **Database**: PostgreSQL with Drizzle ORM
- **File Storage**: Firebase Storage for file uploads
- **API Design**: RESTful endpoints with role-based access control
- **Session Management**: Connect-pg-simple for PostgreSQL session storage

### Key Design Decisions
1. **Hybrid Authentication**: Firebase for authentication flow, PostgreSQL for user data storage
2. **Role-Based Architecture**: Three distinct user types with separate dashboards and permissions
3. **Monorepo Structure**: Shared schema and utilities between client and server
4. **Component-First UI**: Radix UI primitives for accessibility and consistency

## Key Components

### Authentication System
- Firebase Authentication for secure login/logout
- Role-based access control with protected routes
- User profile management with Firestore integration
- Session persistence with remember me functionality

### Dashboard System
- **Student Dashboard**: Course enrollment, assignment tracking, grade viewing
- **Professor Dashboard**: Course management, student assessment, resource sharing
- **Admin Dashboard**: User management, system analytics, platform oversight

### Internationalization
- Multi-language support (English, Arabic, French)
- RTL layout support for Arabic
- Dynamic language switching with localStorage persistence

### Theme System
- Dark/Light mode toggle
- CSS variables for consistent theming
- Persistent theme preferences

## Data Flow

1. **Authentication Flow**:
   - User credentials validated through Firebase Auth
   - User profile fetched from Firestore
   - Role-based dashboard redirection
   - Session maintained across page refreshes

2. **Data Management**:
   - PostgreSQL stores relational data (users, courses, assignments)
   - Firebase Storage handles file uploads
   - Drizzle ORM provides type-safe database queries
   - Real-time updates through Firebase listeners

3. **UI State Management**:
   - React Context for global state (auth, theme, language)
   - TanStack Query for server state caching
   - Local state for component-specific data

## External Dependencies

### Firebase Services
- **Firebase Auth**: User authentication and session management
- **Firestore**: User profile and document storage
- **Firebase Storage**: File and media storage

### Database
- **PostgreSQL**: Primary relational database
- **Neon Database**: Cloud PostgreSQL hosting
- **Drizzle ORM**: Type-safe database queries and migrations

### UI/UX Libraries
- **Radix UI**: Accessible component primitives
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Icon library

## Deployment Strategy

### Development Environment
- Vite dev server for fast hot-reload development
- Express server with TypeScript compilation
- Environment-specific configuration via .env files
- Replit integration for cloud development

### Production Build
- Vite builds optimized static assets
- esbuild bundles Node.js server code
- PostgreSQL database migrations via Drizzle Kit
- Environment variables for production configuration

### Database Management
- Drizzle Kit for schema migrations
- Shared schema between client and server
- Type-safe database operations
- Connection pooling for production scalability

## User Preferences

Preferred communication style: Simple, everyday language.

## 🇲🇦 Moroccan Education System Features

### Student Profile Management (Admin Only Access)
- **MASSAR ID**: 10-character unique identifier for each student
- **National Identifiers**: CNE, APOGEE, CIN with issue details
- **Bilingual Names**: Arabic and Latin character support
- **Geographic Data**: Wilaya, Province, Commune of birth tracking
- **Academic Tracking**: Cycle (Primary/Collège/Lycée), Track specialization
- **Financial Aid**: Scholarship status and amount tracking
- **Academic History**: Redoublement flag and repeat count

### Grading System (0-20 Scale)
- **Subject Coefficients**: Configurable by academic cycle
- **Term Structure**: Semestre/Trimestre based on cycle
- **Exam Integration**: Regional and National Bac exam tracking
- **Final Calculations**: 25% regional + 75% national for Bac
- **Conduct Grades**: Note de conduite (0-20 scale)
- **Ranking System**: Class ranking by Moyenne Générale

### Attendance & Discipline Management
- **Absence Tracking**: Justified/unjustified with documentation
- **Late Arrivals**: Automatic parent notification after 3+ occurrences
- **Disciplinary Actions**: Incident logging with convocation generation
- **Guardian Communication**: SMS integration with Moroccan carriers

### Schedule & Calendar System
- **Moroccan Hours**: 08:00-12:00, 14:00-18:00 (Friday ends 17:00)
- **Religious Education**: Auto-integrated into timetables
- **Holiday Calendar**: Aïd, Achoura, spring/winter breaks
- **Weekend Configuration**: Saturday/Sunday (public) or Friday/Sunday (private)

### Administration Features
- **KPI Dashboard**: Bac pass rate, redoublement rate, scholarship spending
- **Ministry Exports**: XML/CSV formats compatible with MEN requirements
- **University Orientation**: ParcoursUP and ONOUSC export formats
- **Fee Management**: Insurance, cooperative, canteen fee tracking
- **Guardian Data**: Arabic names, relationship, phone numbers

### System Settings
- **Academic Year**: September 1 - June 30 structure
- **Currency**: MAD (درهم مغربي) with proper formatting
- **SMS Gateway**: Integration with Inwi, Orange, IAM providers
- **Grade Scale**: Locked 0-20 system for Bac compliance
- **Language Support**: Arabic RTL, French, English interfaces

## Database Schema Extensions

### New Tables Added
- `subject_coefficients`: Coefficient values by academic cycle
- `grades`: 0-20 grading system with coefficients
- `exam_results`: Regional/National exam tracking
- `attendance`: Absence and lateness logging
- `disciplinary_incidents`: Conduct and incident management
- `academic_calendar`: Moroccan holiday and term calendar
- `class_schedules`: Time-specific scheduling
- `system_settings`: Moroccan education configuration

### Enhanced User Table
Extended with 25+ Morocco-specific fields including MASSAR ID, CNE, guardianship information, fees tracking, and conduct grades.

## Changelog

Changelog:
- July 03, 2025: Complete Moroccan education system implementation
  ✓ MASSAR ID and national student profile system
  ✓ 0-20 grading system with subject coefficients
  ✓ Regional/National Bac exam tracking
  ✓ Moroccan schedule and holiday calendar
  ✓ Ministry export formats (XML/CSV)
  ✓ Guardian communication system
  ✓ Comprehensive admin dashboard with KPIs
  ✓ Bilingual forms (Arabic/French/English)
  ✓ Fee management and scholarship tracking
- July 03, 2025: Enhanced landing page with royal blue theme
- July 03, 2025: Initial setup