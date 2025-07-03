# EduSphere - School Data Management Platform

## Overview

EduSphere is a modern, multilingual school data management platform designed to streamline education administration. The application serves three distinct user roles (Student, Professor, and Administration) with role-based dashboards and features. Built with a React frontend and Express backend, it combines Firebase Authentication with a PostgreSQL database via Drizzle ORM.

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

## Changelog

Changelog:
- July 03, 2025. Initial setup