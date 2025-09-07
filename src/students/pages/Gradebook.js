import React, { useEffect, useState } from 'react';
import { FaBook, FaFileAlt, FaClock, FaGraduationCap, FaStar } from 'react-icons/fa';
import api from '../../utils/api';
import { useStudentCourses } from '../hooks/useStudentCourses';

function getGradeColor(grade) {
  if (!grade) return 'text-gray-700';
  if (grade === 'A' || grade === 'A+') return 'text-green-700 font-bold';
  if (grade === 'B' || grade === 'B+') return 'text-blue-700 font-semibold';
  if (grade === 'C' || grade === 'C+') return 'text-yellow-700 font-semibold';
  if (grade === 'D') return 'text-orange-700 font-semibold';
  if (grade === 'F') return 'text-red-700 font-bold';
  return 'text-gray-700';
}

export default function Gradebook() {
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { data: courses = [], isLoading: coursesLoading, isError: coursesError } = useStudentCourses();

  useEffect(() => {
    async function fetchGrades() {
      try {
        setLoading(true);
        const res = await api.get('/grades/student');
        setGrades(res.data.data || []);
      } catch (err) {
        setError('Failed to fetch grades');
      } finally {
        setLoading(false);
      }
    }
    fetchGrades();
  }, []);

  const isLoading = loading || coursesLoading;
  const isError = error || coursesError;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Scooly</h1>
        <h2 className="text-2xl font-semibold text-gray-700">Gradebook</h2>
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
                  const courseGrades = grades.filter(g => g.courseId === course.id);
                  const averageGrade = courseGrades.length > 0 
                    ? courseGrades.reduce((sum, g) => sum + (parseFloat(g.grade) || 0), 0) / courseGrades.length
                    : null;
                  
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
                          <FaStar className="mr-2 text-gray-400" />
                          <span>Grades: {courseGrades.length}</span>
                        </div>
                        {averageGrade && (
                          <div className="flex items-center">
                            <FaStar className="mr-2 text-yellow-400" />
                            <span>Average: {averageGrade.toFixed(2)}</span>
                          </div>
                        )}
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

          {/* Grades Table */}
          <div>
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">All Grades</h2>
            {grades.length === 0 ? (
              <div className="text-gray-400 text-center py-8">No grades found.</div>
            ) : (
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm rounded-xl overflow-hidden">
                    <thead className="bg-purple-50">
                      <tr>
                        <th className="py-3 px-4 text-left font-semibold text-purple-800">Subject</th>
                        <th className="py-3 px-4 text-left font-semibold text-purple-800">Semester</th>
                        <th className="py-3 px-4 text-left font-semibold text-purple-800">Grade</th>
                        <th className="py-3 px-4 text-left font-semibold text-purple-800">Points</th>
                      </tr>
                    </thead>
                    <tbody>
                      {grades.map((grade, i) => (
                        <tr key={grade.id || i} className={`border-b last:border-0 ${i % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-purple-50/50`}>
                          <td className="py-3 px-4 font-medium">{grade.subject || grade.courseName}</td>
                          <td className="py-3 px-4">{grade.semester || '-'}</td>
                          <td className={`py-3 px-4 ${getGradeColor(grade.grade)}`}>{grade.grade || '-'}</td>
                          <td className="py-3 px-4">{grade.points || '-'}</td>
                        </tr>
                      ))}
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