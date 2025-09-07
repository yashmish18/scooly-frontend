import React, { useEffect, useState, useMemo } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import api from '../../utils/api';
// Unused imports commented out
// import { 
//   FaFilter, 
//   FaEye, 
//   FaEdit, 
//   FaTrash, 
//   FaBell,
//   FaMapMarkerAlt,
//   FaClock,
//   FaUsers
// } from 'react-icons/fa';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const locales = {
  'en-US': require('date-fns/locale/en-US')
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

export default function Schedule() {
  const [events, setEvents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);
  const [showCalendarOverlay, setShowCalendarOverlay] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [filterEventType, setFilterEventType] = useState('');
  
  // Form state for adding/editing events
  const [form, setForm] = useState({
    title: '',
    description: '',
    eventType: 'CLASS',
    courseId: '',
    startDate: '',
    startTime: '',
    endTime: '',
    location: '',
    maxPoints: '',
    notifyStudents: true,
    notifyTeachers: false,
    batchId: '',
    sectionId: '',
    allDay: false
  });

  const [formError, setFormError] = useState(null);
  const [formSuccess, setFormSuccess] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

    const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch teacher's assigned courses (same logic as Materials.js)
      const teacherCoursesRes = await api.get('/teachers/courses');
      // Robustly extract teacherId from JWT payload
      const payload = JSON.parse(atob(localStorage.getItem('token').split('.')[1]));
      let teacherId = payload.id || payload.userId || payload.sub;
      if (!teacherId) {
        teacherId = Object.values(payload).find(v => typeof v === 'string' && v.length > 10);
      }
      const myCourses = (teacherCoursesRes.data.data || []).filter(c => c.teacherId === teacherId);
      setCourses(myCourses);
      
      // Fetch events
      try {
        const eventsRes = await api.get('/schedules/teacher');
        setEvents(eventsRes.data.data || []);
      } catch (eventsErr) {
        console.log('Schedules endpoint failed, setting empty events');
        setEvents([]);
      }
      } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to fetch data');
      } finally {
        setLoading(false);
    }
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    setFormError(null);
    setFormSuccess(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError(null);
    setFormSuccess(null);

    try {
      const payload = {
        ...form,
        maxPoints: form.maxPoints ? parseInt(form.maxPoints) : undefined,
        batchId: form.batchId || undefined,
        sectionId: form.sectionId || undefined,
        endDate: form.startDate // Use start date as end date
      };

      if (selectedEvent) {
        await api.put(`/schedules/${selectedEvent.id}`, payload);
        setFormSuccess('Event updated successfully!');
      } else {
        await api.post('/schedules', payload);
        setFormSuccess('Event created successfully!');
      }

      setTimeout(() => {
        setShowAddModal(false);
        setShowEventModal(false);
        setSelectedEvent(null);
        setForm({
          title: '',
          description: '',
          eventType: 'CLASS',
          courseId: '',
          startDate: '',
          startTime: '',
          endTime: '',
          location: '',
          maxPoints: '',
          notifyStudents: true,
          notifyTeachers: false,
          batchId: '',
          sectionId: '',
          allDay: false
        });
        fetchData();
      }, 1500);
    } catch (err) {
      setFormError(err?.response?.data?.message || 'Failed to save event');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;
    
    try {
      await api.delete(`/schedules/${eventId}`);
      setFormSuccess('Event deleted successfully!');
      setTimeout(() => {
        setShowEventModal(false);
        setSelectedEvent(null);
        fetchData();
      }, 1500);
    } catch (err) {
      setFormError('Failed to delete event');
    }
  };

  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    setForm({
      title: event.title,
      description: event.description || '',
      eventType: event.eventType,
      courseId: event.courseId,
      startDate: format(event.start, 'yyyy-MM-dd'),
      startTime: event.startTime || '',
      endTime: event.endTime || '',
      location: event.location || '',
      maxPoints: event.maxPoints?.toString() || '',
      notifyStudents: event.notifyStudents,
      notifyTeachers: event.notifyTeachers,
      batchId: event.batchId || '',
      sectionId: event.sectionId || '',
      allDay: event.allDay
    });
    setShowEventModal(true);
  };

  const handleSelectDate = (slotInfo) => {
    setShowCalendarOverlay(false);
    setSelectedEvent(null);
    setForm({
      title: '',
      description: '',
      eventType: 'CLASS',
      courseId: selectedCourse.id,
      startDate: format(slotInfo.start, 'yyyy-MM-dd'),
      startTime: format(slotInfo.start, 'HH:mm'),
      endTime: format(slotInfo.end, 'HH:mm'),
      location: '',
      maxPoints: '',
      notifyStudents: true,
      notifyTeachers: false,
      batchId: '',
      sectionId: '',
      allDay: false
    });
    setShowAddModal(true);
  };



  // Filter events based on selected course and event type
  const filteredEvents = useMemo(() => {
    let filtered = events;
    
    if (selectedCourse) {
      filtered = filtered.filter(event => event.courseId === selectedCourse.id);
    }
    
    if (filterEventType) {
      filtered = filtered.filter(event => event.eventType === filterEventType);
    }
    
    return filtered;
  }, [events, selectedCourse, filterEventType]);

  // Get batches and sections for selected course
  const selectedCourseData = courses.find(c => c.id === form.courseId);
  const batches = selectedCourseData?.batches || [];
  

  // Event type options
  const eventTypes = [
    { value: 'EXAM', label: 'Exam', color: '#ef4444' },
    { value: 'ASSIGNMENT', label: 'Assignment', color: '#3b82f6' },
    { value: 'LAB', label: 'Lab', color: '#10b981' },
    { value: 'CLASS', label: 'Class', color: '#8b5cf6' },
    { value: 'QUIZ', label: 'Quiz', color: '#f59e0b' },
    { value: 'PROJECT', label: 'Project', color: '#ec4899' },
    { value: 'PRESENTATION', label: 'Presentation', color: '#06b6d4' },
    { value: 'OTHER', label: 'Other', color: '#6b7280' }
  ];

  const eventStyleGetter = (event) => {
    const eventType = eventTypes.find(et => et.value === event.eventType);
    return {
      style: {
        backgroundColor: eventType?.color || '#6b7280',
        borderRadius: '4px',
        opacity: 0.8,
        color: 'white',
        border: '0px',
        display: 'block'
      }
    };
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="text-center py-8">
          <div className="text-gray-500">Loading schedule...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="text-center py-8">
          <div className="text-red-500">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Scooly</h1>
          <h2 className="text-2xl font-semibold text-gray-700">Schedule</h2>
        </div>
      </div>

      {/* Course Selection Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
        <div
          className={`bg-white rounded-lg shadow p-5 border border-gray-100 cursor-pointer transition hover:shadow-lg ${selectedCourse === null ? 'ring-2 ring-blue-400' : ''}`}
          onClick={() => setSelectedCourse(null)}
        >
          <div className="text-xl font-semibold text-blue-900">All Courses</div>
          <div className="text-gray-600 mb-2">View all events</div>
          <div className="text-gray-500 text-sm">All schedules</div>
        </div>
        {courses.map((course) => {
          // Get event count for this course
          const courseEvents = events.filter(event => event.courseId === course.id);
          const eventCount = courseEvents.length;
          
          return (
            <div
              key={course.id}
              className={`bg-white rounded-lg shadow p-5 border border-gray-100 cursor-pointer transition hover:shadow-lg ${selectedCourse?.id === course.id ? 'ring-2 ring-blue-400' : ''}`}
              onClick={() => {
                setSelectedCourse(course);
                setShowCalendarOverlay(true);
              }}
            >
              <div className="text-xl font-semibold text-blue-900">{course.name}</div>
              <div className="text-gray-600 mb-2">Code: {course.code}</div>
              <div className="text-gray-600 mb-2">Program: {course.program || 'N/A'}</div>
              <div className="text-gray-500 text-sm mb-1">Events: {eventCount}</div>
              <div className="text-gray-500 text-sm">Click to select date</div>
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Event Type</label>
            <select
              value={filterEventType}
              onChange={(e) => setFilterEventType(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Event Types</option>
              {eventTypes.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Calendar */}
      <div className="bg-white rounded-lg shadow p-6">
        <Calendar
          localizer={localizer}
          events={filteredEvents}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 600 }}
          eventPropGetter={eventStyleGetter}
          onSelectEvent={handleSelectEvent}
          popup
          views={['month', 'week', 'day']}
          defaultView="month"
          step={60}
          timeslots={1}
        />
      </div>

      {/* Calendar Overlay Modal */}
      {showCalendarOverlay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">
                Select Date for {selectedCourse?.name}
              </h2>
              <button
                onClick={() => setShowCalendarOverlay(false)}
                className="text-gray-500 hover:text-red-600 text-2xl font-bold"
              >
                &times;
              </button>
            </div>
            
            <div className="mb-4">
              <p className="text-gray-600">Click on a date to create an event for this course.</p>
            </div>

            <Calendar
              localizer={localizer}
              events={events.filter(event => event.courseId === selectedCourse?.id)}
              startAccessor="start"
              endAccessor="end"
              style={{ height: 400 }}
              eventPropGetter={eventStyleGetter}
              onSelectEvent={handleSelectEvent}
              onSelectSlot={handleSelectDate}
              selectable
              popup
              views={['month', 'week', 'day']}
              defaultView="month"
              step={60}
              timeslots={1}
            />
          </div>
        </div>
      )}

      {/* Add/Edit Event Modal */}
      {(showAddModal || showEventModal) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">
                {selectedEvent ? 'Edit Event' : 'Add New Event'}
              </h2>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setShowEventModal(false);
                  setSelectedEvent(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            {formError && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
                {formError}
              </div>
            )}

            {formSuccess && (
              <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
                {formSuccess}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                  <input
                    type="text"
                    name="title"
                    value={form.title}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Event Type *</label>
                  <select
                    name="eventType"
                    value={form.eventType}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    {eventTypes.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Course *</label>
                  <select
                    name="courseId"
                    value={form.courseId}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select Course</option>
                    {courses.map(course => (
                      <option key={course.id} value={course.id}>{course.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <input
                    type="text"
                    name="location"
                    value={form.location}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Room number, building, etc."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Date *</label>
                  <input
                    type="date"
                    name="startDate"
                    value={form.startDate}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>



                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                  <input
                    type="time"
                    name="startTime"
                    value={form.startTime}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={form.allDay}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                  <input
                    type="time"
                    name="endTime"
                    value={form.endTime}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={form.allDay}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Max Points</label>
                  <input
                    type="number"
                    name="maxPoints"
                    value={form.maxPoints}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="100"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Batch</label>
                  <select
                    name="batchId"
                    value={form.batchId}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">All Batches</option>
                    {batches.map(batch => (
                      <option key={batch.id} value={batch.id}>{batch.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleFormChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Event description..."
                />
              </div>

              <div className="flex items-center space-x-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="allDay"
                    checked={form.allDay}
                    onChange={handleFormChange}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">All Day Event</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="notifyStudents"
                    checked={form.notifyStudents}
                    onChange={handleFormChange}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">Notify Students</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="notifyTeachers"
                    checked={form.notifyTeachers}
                    onChange={handleFormChange}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">Notify Teachers</span>
                </label>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                {selectedEvent && (
                  <button
                    type="button"
                    onClick={() => handleDeleteEvent(selectedEvent.id)}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                  >
                    Delete
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setShowEventModal(false);
                    setSelectedEvent(null);
                  }}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : (selectedEvent ? 'Update Event' : 'Create Event')}
                </button>
              </div>
            </form>
          </div>
        </div>
          )}
        </div>
  );
} 