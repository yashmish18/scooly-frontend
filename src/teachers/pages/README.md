# Teacher Pages

This directory contains all the pages available to teachers in the system.

## Pages

### Dashboard
- Main dashboard with overview statistics and recent activity
- Shows course stats, student distribution, and assignment status

### Schedule (UPDATED)
- **Calendar-based UI** for class scheduling
- **Features:**
  - Interactive calendar interface for date selection
  - Course, semester, and section selection
  - Class time and duration management
  - Export schedules to CSV
  - Visual indicators for scheduled classes
  - Real-time schedule management
  - Edit and delete existing schedules

### Assignments
- Manage individual assignments for students

### Gradebook
- Grade management and student performance tracking

### Students
- View and manage student information

### Materials
- Course materials and resources management

### Schedule
- Class scheduling and timetable management

### Mail
- Communication with students and staff

### Settings
- Teacher profile and preferences

## Schedule Feature Details

The Schedule page provides teachers with a powerful calendar-based interface to:

1. **Select Dates**: Click on any date in the calendar to schedule classes
2. **Choose Academic Details**: Select course, semester, and optional section
3. **Set Class Details**: Specify class title, time, and duration
4. **Save Schedules**: Persist schedules to the database
5. **Export Data**: Download schedules as CSV for reporting
6. **Visual Feedback**: Calendar shows scheduled classes with green indicators
7. **Edit/Delete**: Modify or remove existing schedules

### API Endpoints Used
- `GET /api/class-schedules` - Fetch schedules for date range
- `POST /api/class-schedules` - Create new class schedule
- `PUT /api/class-schedules/:id` - Update existing schedule
- `DELETE /api/class-schedules/:id` - Delete schedule

### Database Models
- `ClassSchedule` - Main schedule record with time and duration
- Includes course, semester, section, time, duration, and title fields 