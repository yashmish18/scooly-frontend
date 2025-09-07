import React, { useEffect, useState } from 'react';
import { FaCheckCircle, FaTimesCircle, FaClock, FaExclamationTriangle, FaBook, FaFileAlt, FaGraduationCap, FaCalendarAlt } from 'react-icons/fa';
import api from '../../utils/api';
import { useStudentCourses } from '../hooks/useStudentCourses';

const statusMap = {
  PRESENT: { label: 'Present', color: 'bg-green-100 text-green-800', icon: <FaCheckCircle className="text-green-600" /> },
  ABSENT: { label: 'Absent', color: 'bg-red-100 text-red-800', icon: <FaTimesCircle className="text-red-600" /> },
  LATE: { label: 'Late', color: 'bg-yellow-100 text-yellow-800', icon: <FaClock className="text-yellow-600" /> },
  EXCUSED: { label: 'Excused', color: 'bg-blue-100 text-blue-800', icon: <FaExclamationTriangle className="text-blue-600" /> },
  HALF_DAY: { label: 'Half Day', color: 'bg-orange-100 text-orange-800', icon: <FaClock className="text-orange-600" /> },
};

export default function Attendance() {
  const [attendance, setAttendance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { data: courses = [], isLoading: coursesLoading, isError: coursesError } = useStudentCourses();

  useEffect(() => {
    async function fetchAttendance() {
      try {
        setLoading(true);
        const res = await api.get('/attendance/student');
        setAttendance(res.data.data || null);
      } catch (err) {
        setError('Failed to fetch attendance');
      } finally {
        setLoading(false);
      }
    }
    fetchAttendance();
  }, []);

  const isLoading = loading || coursesLoading;
  const isError = error || coursesError;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Scooly</h1>
        <h2 className="text-2xl font-semibold text-gray-700">Attendance</h2>
      </div>
      
      {isLoading ? (
        <div className="text-gray-500 text-center py-8">Loading...</div>
      ) : isError ? (
        <div className="text-red-500 text-center py-8">Failed to load data.</div>
      ) : (
        <div className="space-y-8">
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
                      <div className="flex items-center">
                        <FaCalendarAlt className="mr-2 text-gray-400" />
                        <span>Attendance: {attendance?.percentage ?? '--'}%</span>
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

          {/* Attendance Summary */}
          {attendance && (
            <div>
              <h2 className="text-2xl font-semibold mb-6 text-gray-800">Attendance Summary</h2>
              <div className="mb-6 flex gap-6 flex-wrap">
                <div className="bg-green-100 text-green-800 rounded-lg px-4 py-2 font-semibold">Attendance %: {attendance.percentage ?? '--'}%</div>
                <div className="bg-blue-100 text-blue-800 rounded-lg px-4 py-2 font-semibold">Present: {attendance.presentCount}</div>
                <div className="bg-red-100 text-red-800 rounded-lg px-4 py-2 font-semibold">Absent: {attendance.absentCount}</div>
                <div className="bg-yellow-100 text-yellow-800 rounded-lg px-4 py-2 font-semibold">Late: {attendance.lateCount}</div>
                <div className="bg-orange-100 text-orange-800 rounded-lg px-4 py-2 font-semibold">Half Day: {attendance.halfDayCount}</div>
                <div className="bg-blue-50 text-blue-700 rounded-lg px-4 py-2 font-semibold">Excused: {attendance.excusedCount}</div>
              </div>
            </div>
          )}

          {/* Attendance Records Table */}
          <div>
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">Attendance Records</h2>
            {attendance && attendance.records && attendance.records.length > 0 ? (
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm rounded-xl overflow-hidden">
                    <thead className="bg-green-50">
                      <tr>
                        <th className="py-3 px-4 text-left font-semibold text-green-800">Date</th>
                        <th className="py-3 px-4 text-left font-semibold text-green-800">Status</th>
                        <th className="py-3 px-4 text-left font-semibold text-green-800">Remarks</th>
                      </tr>
                    </thead>
                    <tbody>
                      {attendance.records.map((rec, i) => (
                        <tr key={i} className={`border-b last:border-0 ${i % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-green-50/50`}>
                          <td className="py-3 px-4">{rec.date}</td>
                          <td className="py-3 px-4">
                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${statusMap[rec.status]?.color || 'bg-gray-100 text-gray-800'}`}>
                              {statusMap[rec.status]?.icon}
                              {statusMap[rec.status]?.label || rec.status}
                            </span>
                          </td>
                          <td className="py-3 px-4">{rec.remarks || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="text-gray-400 text-center py-8">No attendance records found.</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 