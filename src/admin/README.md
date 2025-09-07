# Admin Module

This module contains all administrative functionality for the university management system.

## Structure

```
admin/
├── components/
│   ├── AdminShell.js      # Main admin layout wrapper
│   ├── AdminSidebar.js    # Navigation sidebar
│   └── AdminTopNav.js     # Top navigation bar
├── pages/
│   ├── Dashboard.js       # Admin dashboard overview
│   ├── Applicants.js      # Student applications list
│   ├── StudentsList.js    # Enrolled students management
│   ├── AddStudent.js      # Single student enrollment form
│   ├── EnrollStudent.js   # Multi-step enrollment form
│   ├── BulkUpload.js      # CSV bulk upload interface
│   └── ApplicantProfile.js # Individual applicant details
└── AdminLayout.js         # Main admin routing layout
```

## Features

- **Dashboard**: Overview of admissions, statistics, and recent activity
- **Applicants Management**: View, filter, and manage student applications
- **Student Management**: Manage enrolled students, view profiles, edit information
- **Enrollment**: Single student and bulk enrollment capabilities
- **Bulk Operations**: CSV upload for mass student import
- **Profile Management**: Detailed applicant and student profiles

## Navigation

- Dashboard (`/`)
- Applicants (`/applicants`)
- Students (`/students`)
- Add Student (`/add-student`)
- Enroll Student (`/enroll`)
- Bulk Upload (`/bulk-upload`)
- Applicant Profile (`/applicants/:id`)

## Usage

The admin module is accessed through the main application routing and provides a complete administrative interface for university management. 