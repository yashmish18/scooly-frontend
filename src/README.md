# Frontend Structure

This is the main frontend application for the CampusConnect university management system, organized into role-based modules for better maintainability and scalability.

## Directory Structure

```
src/
├── admin/                 # Administrative functionality
│   ├── components/        # Admin-specific components
│   ├── pages/            # Admin pages
│   ├── AdminLayout.js    # Admin routing layout
│   └── README.md         # Admin module documentation
├── teachers/             # Teacher functionality
│   ├── components/       # Teacher-specific components
│   ├── pages/           # Teacher pages
│   └── README.md        # Teachers module documentation
├── students/             # Student functionality
│   ├── components/       # Student-specific components
│   ├── pages/           # Student pages
│   └── README.md        # Students module documentation
├── general/              # General/public pages
│   ├── components/       # General components
│   ├── pages/           # General pages
│   └── README.md        # General module documentation
├── components/           # Shared components
│   ├── ui/              # UI components (buttons, inputs, etc.)
│   ├── forms/           # Form components
│   └── layout/          # Layout components
├── features/             # Feature modules
│   └── auth/            # Authentication features
├── hooks/               # Custom React hooks
├── utils/               # Utility functions
└── App.js               # Main application component
```

## Module Overview

### Admin Module (`/admin`)
- **Purpose**: Complete administrative control over the university system
- **Features**: Student management, admissions, bulk operations, system administration
- **Access**: Administrators and system managers

### Teachers Module (`/teachers`)
- **Purpose**: Course management and student interaction for faculty
- **Features**: Course management, grading, assignment creation, student interaction
- **Access**: Faculty members and teaching staff

### Students Module (`/students`)
- **Purpose**: Academic tracking and course access for students
- **Features**: Course viewing, grade tracking, assignment submission, schedule management
- **Access**: Enrolled students

### General Module (`/general`)
- **Purpose**: Public-facing pages and entry points
- **Features**: Landing page, authentication, public information
- **Access**: All users (public)

## Shared Resources

### Components (`/components`)
- **UI Components**: Reusable UI elements (buttons, inputs, modals, etc.)
- **Form Components**: Form-specific components and validation
- **Layout Components**: Layout wrappers and navigation elements

### Features (`/features`)
- **Authentication**: Login, registration, and session management
- **Other Features**: Additional feature modules as needed

### Hooks (`/hooks`)
- **Custom Hooks**: Reusable React hooks for common functionality

### Utils (`/utils`)
- **Utility Functions**: Helper functions, API clients, and utilities

## Routing Structure

- `/` - General home page
- `/admin/*` - Admin module routes
- `/teacher/*` - Teacher module routes
- `/student/*` - Student module routes
- `/login` - Authentication
- `/about`, `/contact` - Public pages

## Development Guidelines

1. **Module Organization**: Keep all role-specific functionality within its respective module
2. **Component Reusability**: Use shared components from `/components` when possible
3. **Consistent Styling**: Follow the established design system and Tailwind CSS patterns
4. **Documentation**: Maintain README files for each module
5. **Routing**: Use nested routing for better organization and navigation state management

## Getting Started

1. Navigate to the appropriate module for your feature
2. Follow the module-specific documentation
3. Use the established patterns and components
4. Maintain consistency with the overall design system 