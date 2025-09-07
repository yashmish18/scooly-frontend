import React from 'react';
import { FaClipboardList, FaCheckCircle, FaCalendarAlt, FaBook, FaFileAlt, FaClock, FaGraduationCap } from 'react-icons/fa';
import { useStudentAssignments } from '../hooks/useStudentAssignments';
import { useStudentCourses } from '../hooks/useStudentCourses';

export default function Assignments() {
  const { data: assignments = [], isLoading: assignmentsLoading, isError: assignmentsError } = useStudentAssignments();
  const { data: courses = [], isLoading: coursesLoading, isError: coursesError } = useStudentCourses();

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getAssignmentStatus = (assignment) => {
    const now = new Date();
    const dueDate = new Date(assignment.dueDateTime);
    
    if (dueDate > now) {
      return { status: 'Upcoming', color: 'bg-yellow-100 text-yellow-800' };
    } else {
      return { status: 'Overdue', color: 'bg-red-100 text-red-800' };
    }
  };

  const isLoading = assignmentsLoading || coursesLoading;
  const isError = assignmentsError || coursesError;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Scooly</h1>
        <h2 className="text-2xl font-semibold text-gray-700">Assignments</h2>
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
                  const courseAssignments = assignments.filter(a => a.courseId === course.id);
                  const upcomingAssignments = courseAssignments.filter(a => new Date(a.dueDateTime) > new Date());
                  
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
                          <FaClipboardList className="mr-2 text-gray-400" />
                          <span>Assignments: {courseAssignments.length}</span>
                        </div>
                        <div className="flex items-center">
                          <FaCalendarAlt className="mr-2 text-gray-400" />
                          <span>Upcoming: {upcomingAssignments.length}</span>
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

          {/* Assignments Table */}
          <div>
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">All Assignments</h2>
            {assignments.length === 0 ? (
              <div className="text-gray-400 text-center py-8">No assignments found.</div>
            ) : (
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm rounded-xl overflow-hidden">
                    <thead className="bg-blue-50">
                      <tr>
                        <th className="py-3 px-4 text-left font-semibold text-blue-800">Title</th>
                        <th className="py-3 px-4 text-left font-semibold text-blue-800">Course</th>
                        <th className="py-3 px-4 text-left font-semibold text-blue-800">Due Date</th>
                        <th className="py-3 px-4 text-left font-semibold text-blue-800">Max Points</th>
                        <th className="py-3 px-4 text-left font-semibold text-blue-800">Status</th>
                        <th className="py-3 px-4 text-left font-semibold text-blue-800">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {assignments.map((assignment, i) => {
                        const course = courses.find(c => c.id === assignment.courseId);
                        const status = getAssignmentStatus(assignment);
                        
                        return (
                          <tr key={assignment.id} className={
                            `border-b last:border-0 ${i % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-blue-50/50`}
                          >
                            <td className="py-3 px-4 font-medium">{assignment.title}</td>
                            <td className="py-3 px-4">{course ? course.name : assignment.courseId}</td>
                            <td className="py-3 px-4">
                              {assignment.dueDateTime ? formatDate(assignment.dueDateTime) : '-'}
                            </td>
                            <td className="py-3 px-4">{assignment.maxPoints || '-'}</td>
                            <td className="py-3 px-4">
                              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${status.color}`}>
                                {status.status}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <button className="text-blue-600 hover:text-blue-800 font-semibold text-sm">
                                {status.status === 'Upcoming' ? 'Submit' : 'View'}
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 