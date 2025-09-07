
import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { 
  FaCalendarAlt, 
  FaUsers, 
  FaCheck, 
  FaTimes, 
  FaClock, 
  FaExclamationTriangle,
  FaChartBar,
  FaEdit,
  FaSave,
  FaEye
} from 'react-icons/fa';
import api from '../../utils/api';

export default function Attendance() {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [students, setStudents] = useState([]);
  const [attendanceData, setAttendanceData] = useState({});
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(null);
  
  // Schedule integration
  const [scheduledDates, setScheduledDates] = useState([]);
  const [showDateSelector, setShowDateSelector] = useState(false);
  
  // Modal states
  const [showMarkAttendance, setShowMarkAttendance] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(false);

  // Fetch teacher's courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const teacherCoursesRes = await api.get('/teachers/courses');
        const payload = JSON.parse(atob(localStorage.getItem('token').split('.')[1]));
        let teacherId = payload.id || payload.userId || payload.sub;
        if (!teacherId) {
          teacherId = Object.values(payload).find(v => typeof v === 'string' && v.length > 10);
        }
        const myCourses = (teacherCoursesRes.data.data || []).filter(c => c.teacherId === teacherId);
        setCourses(myCourses);
      } catch (err) {
        setError('Failed to fetch courses');
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  // Fetch students and scheduled dates when course is selected
  useEffect(() => {
    if (selectedCourse) {
      fetchStudents(selectedCourse.id);
      fetchScheduledDates(selectedCourse.id);
    }
  }, [selectedCourse]);

  const fetchStudents = async (courseId) => {
    try {
      const res = await api.get(`/attendance/course/${courseId}/students`);
      setStudents(res.data.data || []);
    } catch (err) {
      console.error('Error fetching students:', err);
      setStudents([]);
    }
  };

  const fetchScheduledDates = async (courseId) => {
    try {
      const res = await api.get('/schedules/teacher', {
        params: { courseId: courseId }
      });
      
      // Extract unique dates from scheduled events
      const dates = [...new Set(
        res.data.data
          .filter(event => event.courseId === courseId)
          .map(event => format(new Date(event.start), 'yyyy-MM-dd'))
      )].sort();
      
      setScheduledDates(dates);
    } catch (err) {
      console.error('Error fetching scheduled dates:', err);
      setScheduledDates([]);
    }
  };

  const handleMarkAttendance = () => {
    if (!selectedCourse) return;
    
    if (scheduledDates.length === 0) {
      // No scheduled dates, show regular attendance modal
      setAttendanceData({});
      setShowMarkAttendance(true);
    } else {
      // Show date selector for scheduled dates
      setShowDateSelector(true);
    }
  };

  const handleAttendanceChange = (studentId, status) => {
    setAttendanceData(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        status,
        remarks: prev[studentId]?.remarks || ''
      }
    }));
  };

  const handleRemarksChange = (studentId, remarks) => {
    setAttendanceData(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        status: prev[studentId]?.status || 'PRESENT',
        remarks
      }
    }));
  };

  const handleSubmitAttendance = async () => {
    try {
      setSubmitting(true);
      setError(null);
      setSuccess(null);

      const attendanceDataArray = Object.entries(attendanceData).map(([studentId, data]) => ({
        studentId,
        status: data.status,
        remarks: data.remarks
      }));

      await api.post('/attendance/mark', {
        courseId: selectedCourse.id,
        date: selectedDate,
        attendanceData: attendanceDataArray
      });

      setSuccess('Attendance marked successfully!');
      setShowMarkAttendance(false);
      setAttendanceData({});
      
      // Refresh stats
      if (showStats) {
        fetchStats();
      }
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to mark attendance');
    } finally {
      setSubmitting(false);
    }
  };

  const fetchStats = async () => {
    if (!selectedCourse) return;
    
    try {
      setStatsLoading(true);
      const res = await api.get(`/attendance/course/${selectedCourse.id}/stats`);
      setStats(res.data.data);
    } catch (err) {
      console.error('Error fetching stats:', err);
    } finally {
      setStatsLoading(false);
    }
  };

  const handleViewStats = () => {
    if (!selectedCourse) return;
    fetchStats();
    setShowStats(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PRESENT': return 'bg-green-100 text-green-800';
      case 'ABSENT': return 'bg-red-100 text-red-800';
      case 'LATE': return 'bg-yellow-100 text-yellow-800';
      case 'EXCUSED': return 'bg-blue-100 text-blue-800';
      case 'HALF_DAY': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'PRESENT': return <FaCheck className="text-green-600" />;
      case 'ABSENT': return <FaTimes className="text-red-600" />;
      case 'LATE': return <FaClock className="text-yellow-600" />;
      case 'EXCUSED': return <FaExclamationTriangle className="text-blue-600" />;
      case 'HALF_DAY': return <FaClock className="text-orange-600" />;
      default: return null;
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="text-center py-8">
          <div className="text-gray-500">Loading attendance...</div>
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
          <h2 className="text-2xl font-semibold text-gray-700">Attendance</h2>
        </div>
      </div>

      {/* Course Selection Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
        {courses.map((course) => {
          const courseStudents = students.filter(s => s.courseId === course.id);
          const courseScheduledDates = scheduledDates.filter(date => {
            // This will be populated when course is selected
            return true; // Placeholder - will be filtered properly when course is selected
          });
          const studentCount = courseStudents.length;
          const scheduledCount = courseScheduledDates.length;
          
          return (
            <div
              key={course.id}
              className={`bg-white rounded-lg shadow p-5 border border-gray-100 cursor-pointer transition hover:shadow-lg ${selectedCourse?.id === course.id ? 'ring-2 ring-blue-400' : ''}`}
              onClick={() => setSelectedCourse(course)}
            >
              <div className="text-xl font-semibold text-blue-900">{course.name}</div>
              <div className="text-gray-600 mb-2">Code: {course.code}</div>
              <div className="text-gray-600 mb-2">Program: {course.program || 'N/A'}</div>
              <div className="text-gray-500 text-sm mb-1">Students: {studentCount}</div>
              <div className="text-gray-500 text-sm mb-1">
                {selectedCourse?.id === course.id ? (
                  scheduledCount > 0 ? (
                    `Scheduled Sessions: ${scheduledCount}`
                  ) : (
                    <span className="text-orange-600">No scheduled classes</span>
                  )
                ) : (
                  'Scheduled Sessions: ...'
                )}
              </div>
              <div className="text-gray-500 text-sm">Click to manage attendance</div>
            </div>
          );
        })}
      </div>

      {/* Course Actions */}
      {selectedCourse && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Attendance for {selectedCourse.name}</h2>
            <div className="flex gap-3">
              <button
                onClick={handleMarkAttendance}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition"
              >
                <FaCalendarAlt />
                Mark Attendance
              </button>
              <button
                onClick={handleViewStats}
                className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700 transition"
              >
                <FaChartBar />
                View Statistics
              </button>
            </div>
          </div>
          
          <div className="text-gray-600">
            <p>Students enrolled: {students.length}</p>
            <p>Selected course: {selectedCourse.code}</p>
            {scheduledDates.length === 0 && (
              <p className="text-orange-600 text-sm mt-2">
                ⚠️ No scheduled classes found. You can still mark attendance for any date.
              </p>
            )}
          </div>
        </div>
      )}

      {/* Date Selector Modal */}
      {showDateSelector && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">
                Select Scheduled Date - {selectedCourse?.name}
              </h2>
              <button
                onClick={() => setShowDateSelector(false)}
                className="text-gray-500 hover:text-red-600 text-2xl font-bold"
              >
                &times;
              </button>
            </div>

            <div className="mb-6">
              <p className="text-gray-600 mb-4">
                Choose a scheduled date to mark attendance for this course:
              </p>
              
              {scheduledDates.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-gray-500 mb-4">No scheduled classes for today</div>
                  <div className="text-sm text-gray-400 mb-4">
                    This course has no scheduled sessions. You can still mark attendance for any date.
                  </div>
                  <button
                    onClick={() => {
                      setShowDateSelector(false);
                      setShowMarkAttendance(true);
                    }}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                  >
                    Mark Attendance for Any Date
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {scheduledDates.map((date) => (
                    <button
                      key={date}
                      onClick={() => {
                        setSelectedDate(date);
                        setShowDateSelector(false);
                        setAttendanceData({});
                        setShowMarkAttendance(true);
                      }}
                      className="p-4 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition text-left"
                    >
                      <div className="font-medium text-gray-900">
                        {format(new Date(date), 'EEEE, MMMM d, yyyy')}
                      </div>
                      <div className="text-sm text-gray-500">
                        {format(new Date(date), 'MMM d, yyyy')}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDateSelector(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              {scheduledDates.length > 0 && (
                <button
                  onClick={() => {
                    setShowDateSelector(false);
                    setShowMarkAttendance(true);
                  }}
                  className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition"
                >
                  Mark for Different Date
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Mark Attendance Modal */}
      {showMarkAttendance && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">
                Mark Attendance - {selectedCourse?.name}
              </h2>
              <button
                onClick={() => setShowMarkAttendance(false)}
                className="text-gray-500 hover:text-red-600 text-2xl font-bold"
              >
                &times;
              </button>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
                {error}
              </div>
            )}

            {success && (
              <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
                {success}
              </div>
            )}

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
              <div className="flex items-center gap-2 mb-2">
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {scheduledDates.includes(selectedDate) && (
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                    Scheduled
                  </span>
                )}
              </div>
              {scheduledDates.includes(selectedDate) && (
                <p className="text-sm text-green-600">
                  ✓ This date has scheduled sessions for {selectedCourse?.name}
                </p>
              )}
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Student Attendance</h3>
              <div className="space-y-3">
                {students.map((student) => (
                  <div key={student.id} className="flex items-center gap-4 p-3 border rounded-lg">
                    <div className="flex-1">
                      <div className="font-medium">{student.firstName} {student.lastName}</div>
                      <div className="text-sm text-gray-500">Roll: {student.rollNumber}</div>
                    </div>
                    
                    <div className="flex gap-2">
                      {['PRESENT', 'ABSENT', 'LATE', 'EXCUSED', 'HALF_DAY'].map((status) => (
                        <button
                          key={status}
                          onClick={() => handleAttendanceChange(student.id, status)}
                          className={`px-3 py-1 rounded text-sm font-medium transition ${
                            attendanceData[student.id]?.status === status
                              ? getStatusColor(status)
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          {getStatusIcon(status)}
                          <span className="ml-1">{status}</span>
                        </button>
                      ))}
                    </div>
                    
                    <div className="w-48">
                      <input
                        type="text"
                        placeholder="Remarks (optional)"
                        value={attendanceData[student.id]?.remarks || ''}
                        onChange={(e) => handleRemarksChange(student.id, e.target.value)}
                        className="w-full px-3 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowMarkAttendance(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitAttendance}
                disabled={submitting}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition disabled:opacity-50"
              >
                <FaSave />
                {submitting ? 'Saving...' : 'Save Attendance'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Statistics Modal */}
      {showStats && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-6xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">
                Attendance Statistics - {selectedCourse?.name}
              </h2>
              <button
                onClick={() => setShowStats(false)}
                className="text-gray-500 hover:text-red-600 text-2xl font-bold"
              >
                &times;
              </button>
            </div>

            {statsLoading ? (
              <div className="text-center py-8">
                <div className="text-gray-500">Loading statistics...</div>
              </div>
            ) : stats ? (
              <div>
                {/* Overall Statistics */}
                <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
                  <div className="bg-green-100 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-green-600">{stats.overall.presentCount}</div>
                    <div className="text-sm text-green-700">Present</div>
                  </div>
                  <div className="bg-red-100 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-red-600">{stats.overall.absentCount}</div>
                    <div className="text-sm text-red-700">Absent</div>
                  </div>
                  <div className="bg-yellow-100 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-yellow-600">{stats.overall.lateCount}</div>
                    <div className="text-sm text-yellow-700">Late</div>
                  </div>
                  <div className="bg-blue-100 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-blue-600">{stats.overall.excusedCount}</div>
                    <div className="text-sm text-blue-700">Excused</div>
                  </div>
                  <div className="bg-orange-100 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-orange-600">{stats.overall.halfDayCount}</div>
                    <div className="text-sm text-orange-700">Half Day</div>
                  </div>
                  <div className="bg-purple-100 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-purple-600">{stats.overall.attendancePercentage}%</div>
                    <div className="text-sm text-purple-700">Overall</div>
                  </div>
                </div>

                {/* Student Statistics Table */}
                <div className="bg-white border rounded-lg overflow-hidden">
                  <div className="px-6 py-4 bg-gray-50 border-b">
                    <h3 className="text-lg font-semibold">Student Attendance Breakdown</h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Present</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Absent</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Late</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Excused</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Half Day</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Percentage</th>
            </tr>
          </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {stats.studentStats.map((studentStat, index) => (
                          <tr key={studentStat.student.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">
                                {studentStat.student.firstName} {studentStat.student.lastName}
                              </div>
                              <div className="text-sm text-gray-500">{studentStat.student.rollNumber}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{studentStat.total}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">{studentStat.present}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">{studentStat.absent}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-yellow-600">{studentStat.late}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">{studentStat.excused}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-orange-600">{studentStat.halfDay}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                studentStat.attendancePercentage >= 90 ? 'bg-green-100 text-green-800' :
                                studentStat.attendancePercentage >= 75 ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {studentStat.attendancePercentage}%
                              </span>
                            </td>
              </tr>
            ))}
          </tbody>
        </table>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-gray-500">No attendance data available</div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 