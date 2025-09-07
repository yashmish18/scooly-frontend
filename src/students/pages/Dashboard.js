import React, { useEffect, useState } from 'react';
import { FaUser, FaCalendarCheck, FaClipboardList, FaBook, FaClock, FaCheckCircle, FaTimesCircle, FaFileAlt, FaGraduationCap } from 'react-icons/fa';
import api from '../../utils/api';
import { useStudentCourses } from '../hooks/useStudentCourses';

export default function Dashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { data: courses = [], isLoading: coursesLoading, isError: coursesError } = useStudentCourses();

  useEffect(() => {
    async function fetchDashboard() {
      try {
        setLoading(true);
        const res = await api.get('/dashboard/student');
        setDashboard(res.data.data || null);
      } catch (err) {
        setError('Failed to fetch dashboard data');
      } finally {
        setLoading(false);
      }
    }
    fetchDashboard();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const isLoading = loading || coursesLoading;
  const isError = error || coursesError;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Scooly</h1>
        <h2 className="text-2xl font-semibold text-gray-700">Student Dashboard</h2>
      </div>
      
      {isLoading ? (
        <div className="text-gray-500 text-center py-8">Loading...</div>
      ) : isError ? (
        <div className="text-red-500 text-center py-8">Failed to load data.</div>
      ) : (
        <div className="space-y-8">
          {/* Welcome Section */}
          {dashboard && (
            <div className="bg-blue-50 rounded-lg p-6 flex items-center gap-6">
              <FaUser className="text-4xl text-blue-600" />
              <div>
                <div className="text-xl font-semibold">Welcome, {dashboard.student?.firstName} {dashboard.student?.lastName}</div>
                <div className="text-gray-600 text-sm">Roll: {dashboard.student?.rollNumber} | Program: {dashboard.student?.program || 'N/A'}</div>
              </div>
            </div>
          )}

          {/* Course Cards */}
          <div>
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">My Courses</h2>
            {courses.length === 0 ? (
              <div className="text-gray-400 text-center py-8">No courses found.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map((course) => (
                  <div
                    key={course.id}
                    className="bg-white shadow-md rounded-lg p-6 border border-gray-100 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-center mb-4">
                      <div className="text-blue-500 mr-3">
                        <FaBook size={24} />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">{course.name}</h3>
                        <p className="text-sm text-gray-600">{course.code}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center">
                        <FaGraduationCap className="mr-2 text-gray-400" />
                        <span>Program: {course.program}</span>
                      </div>
                      <div className="flex items-center">
                        <FaClock className="mr-2 text-gray-400" />
                        <span>Duration: {course.duration} months</span>
                      </div>
                      <div className="flex items-center">
                        <FaFileAlt className="mr-2 text-gray-400" />
                        <span>Credits: {course.credits}</span>
                      </div>
                    </div>
                    
                    {course.description && (
                      <p className="mt-4 text-sm text-gray-600 border-t pt-3">
                        {course.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Stats */}
          {dashboard && (
            <div>
              <h2 className="text-2xl font-semibold mb-6 text-gray-800">Quick Stats</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                <div className="flex items-center gap-4 bg-white rounded-lg shadow p-5 border border-gray-100">
                  <div className="text-3xl text-green-600"><FaCalendarCheck /></div>
                  <div>
                    <div className="text-2xl font-bold">{dashboard.attendanceStats?.percentage ?? '--'}%</div>
                    <div className="text-gray-500 text-sm">Attendance</div>
                  </div>
                </div>
                <div className="flex items-center gap-4 bg-white rounded-lg shadow p-5 border border-gray-100">
                  <div className="text-3xl text-yellow-600"><FaClipboardList /></div>
                  <div>
                    <div className="text-2xl font-bold">{dashboard.assignments?.dueCount ?? '--'}</div>
                    <div className="text-gray-500 text-sm">Assignments Due</div>
                  </div>
                </div>
                <div className="flex items-center gap-4 bg-white rounded-lg shadow p-5 border border-gray-100">
                  <div className="text-3xl text-purple-600"><FaBook /></div>
                  <div>
                    <div className="text-2xl font-bold">{dashboard.grades?.average ?? '--'}</div>
                    <div className="text-gray-500 text-sm">Average Grade</div>
                  </div>
                </div>
                <div className="flex items-center gap-4 bg-white rounded-lg shadow p-5 border border-gray-100">
                  <div className="text-3xl text-blue-600"><FaClock /></div>
                  <div>
                    <div className="text-2xl font-bold">{dashboard.schedule?.upcomingCount ?? '--'}</div>
                    <div className="text-gray-500 text-sm">Upcoming Classes</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Recent Activity Tables */}
          {dashboard && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Recent Attendance */}
              <div>
                <h2 className="text-2xl font-semibold mb-6 text-gray-800">Recent Attendance</h2>
                {dashboard.attendanceStats?.recent?.length ? (
                  <div className="bg-white rounded-2xl shadow-xl p-8">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm rounded-xl overflow-hidden">
                        <thead className="bg-green-50">
                          <tr>
                            <th className="py-3 px-4 text-left font-semibold text-green-800">Date</th>
                            <th className="py-3 px-4 text-left font-semibold text-green-800">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {dashboard.attendanceStats.recent.map((rec, i) => (
                            <tr key={i} className={`border-b last:border-0 ${i % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-green-50/50`}>
                              <td className="py-3 px-4">{rec.date}</td>
                              <td className="py-3 px-4">
                                {rec.status === 'PRESENT' && <span className="text-green-700 font-semibold flex items-center gap-1"><FaCheckCircle /> Present</span>}
                                {rec.status === 'ABSENT' && <span className="text-red-700 font-semibold flex items-center gap-1"><FaTimesCircle /> Absent</span>}
                                {rec.status === 'LATE' && <span className="text-yellow-700 font-semibold">Late</span>}
                                {rec.status === 'EXCUSED' && <span className="text-blue-700 font-semibold">Excused</span>}
                                {rec.status === 'HALF_DAY' && <span className="text-orange-700 font-semibold">Half Day</span>}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  <div className="text-gray-400 text-center py-8">No recent attendance records.</div>
                )}
              </div>

              {/* Upcoming Assignments */}
              <div>
                <h2 className="text-2xl font-semibold mb-6 text-gray-800">Upcoming Assignments</h2>
                {dashboard.assignments?.upcoming?.length ? (
                  <div className="bg-white rounded-2xl shadow-xl p-8">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm rounded-xl overflow-hidden">
                        <thead className="bg-yellow-50">
                          <tr>
                            <th className="py-3 px-4 text-left font-semibold text-yellow-800">Title</th>
                            <th className="py-3 px-4 text-left font-semibold text-yellow-800">Due Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {dashboard.assignments.upcoming.map((a, i) => (
                            <tr key={i} className={`border-b last:border-0 ${i % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-yellow-50/50`}>
                              <td className="py-3 px-4 font-medium">{a.title}</td>
                              <td className="py-3 px-4">{a.dueDate ? formatDate(a.dueDate) : '-'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  <div className="text-gray-400 text-center py-8">No upcoming assignments.</div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 