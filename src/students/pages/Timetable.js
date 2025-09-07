import React, { useState } from 'react';
import { FaChevronLeft, FaChevronRight, FaTable, FaBook, FaFileAlt, FaGraduationCap, FaClock } from 'react-icons/fa';
import { useStudentSchedules } from '../hooks/useStudentSchedules';
import { useStudentCourses } from '../hooks/useStudentCourses';

export default function Timetable() {
  const today = new Date();
  const [month, setMonth] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());
  const [selected, setSelected] = useState(today.getDate());

  const { data: schedules = [], isLoading: schedulesLoading, isError: schedulesError } = useStudentSchedules();
  const { data: courses = [], isLoading: coursesLoading, isError: coursesError } = useStudentCourses();

  // Group schedules by date
  const grouped = {};
  schedules.forEach(s => {
    const date = new Date(s.date).toDateString();
    if (!grouped[date]) grouped[date] = [];
    grouped[date].push(s);
  });
  const sortedDates = Object.keys(grouped).sort((a, b) => new Date(a) - new Date(b));

  const handlePrev = () => {
    if (month === 0) {
      setMonth(11);
      setYear(y => y - 1);
    } else {
      setMonth(m => m - 1);
    }
    setSelected(1);
  };
  const handleNext = () => {
    if (month === 11) {
      setMonth(0);
      setYear(y => y + 1);
    } else {
      setMonth(m => m + 1);
    }
    setSelected(1);
  };

  const isLoading = schedulesLoading || coursesLoading;
  const isError = schedulesError || coursesError;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Scooly</h1>
        <h2 className="text-2xl font-semibold text-gray-700">Class Timetable</h2>
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
                {courses.map((course) => {
                  const courseSchedules = schedules.filter(s => s.courseId === course.id);
                  
                  return (
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
                          <FaTable className="mr-2 text-gray-400" />
                          <span>Classes: {courseSchedules.length}</span>
                        </div>
                      </div>
                      
                      {course.description && (
                        <p className="mt-4 text-sm text-gray-600 border-t pt-3">
                          {course.description}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Calendar Navigation */}
          <div>
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">Class Schedule</h2>
            <div className="rounded-2xl shadow-lg bg-gradient-to-r from-blue-100 via-indigo-50 to-white p-6 flex flex-col items-center mb-6">
              <div className="flex items-center gap-6 mb-2">
                <button onClick={handlePrev} className="rounded-full p-2 hover:bg-indigo-200">
                  <FaChevronLeft />
                </button>
                <span className="font-semibold text-lg text-indigo-900">{new Date(year, month).toLocaleString('default', { month: 'long', year: 'numeric' })}</span>
                <button onClick={handleNext} className="rounded-full p-2 hover:bg-indigo-200">
                  <FaChevronRight />
                </button>
              </div>
            </div>
          </div>

          {/* Schedules Table */}
          <div>
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">Class Schedules</h2>
            {sortedDates.length === 0 ? (
              <div className="text-gray-400 text-center py-8">No schedules found.</div>
            ) : (
              <div className="bg-white rounded-2xl shadow-xl border overflow-hidden">
                {sortedDates.map(date => (
                  <div key={date} className="border-b last:border-0">
                    <div className="bg-indigo-50 px-6 py-3 font-semibold text-indigo-700 text-lg">{date}</div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead className="bg-indigo-100">
                          <tr>
                            <th className="text-left py-3 px-4 font-semibold text-indigo-800">Time</th>
                            <th className="text-left py-3 px-4 font-semibold text-indigo-800">Title</th>
                            <th className="text-left py-3 px-4 font-semibold text-indigo-800">Course</th>
                            <th className="text-left py-3 px-4 font-semibold text-indigo-800">Section</th>
                            <th className="text-left py-3 px-4 font-semibold text-indigo-800">Room</th>
                            <th className="text-left py-3 px-4 font-semibold text-indigo-800">Duration</th>
                          </tr>
                        </thead>
                        <tbody>
                          {grouped[date].map((s, i) => (
                            <tr key={s.id} className={`border-b last:border-0 ${i % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-indigo-50/50`}>
                              <td className="py-3 px-4 font-medium text-indigo-700">{s.time}</td>
                              <td className="py-3 px-4">{s.title}</td>
                              <td className="py-3 px-4">{s.courseId}</td>
                              <td className="py-3 px-4">{s.sectionId || '-'}</td>
                              <td className="py-3 px-4">{s.room || '-'}</td>
                              <td className="py-3 px-4">{s.duration} min</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 