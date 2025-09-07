import React, { useEffect, useState } from 'react';
import { FaSearch, FaEye } from 'react-icons/fa';
import api from '../../utils/api';


export default function Students() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCourse, setFilterCourse] = useState('');
  const [filterBatch, setFilterBatch] = useState('');

  useEffect(() => {
    async function fetchStudents() {
      try {
        setLoading(true);
        const res = await api.get('/teachers/students');
        setStudents(res.data.data || []);
      } catch (err) {
        setError('Failed to fetch students');
      } finally {
        setLoading(false);
      }
    }
    async function fetchCourses() {
      try {
        const res = await api.get('/teachers/courses');
        setCourses(res.data.data || []);
      } catch {}
    }
    fetchStudents();
    fetchCourses();
  }, []);

  // Get unique batches and semesters for filtering
  const uniqueBatches = [...new Set(students.map(s => s.batch?.name).filter(Boolean))];
  

  // Filter students based on search and filters
  const filteredStudents = students.filter(student => {
    const matchesSearch = 
      student.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.rollNumber?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCourse = !filterCourse || student.course?.id === filterCourse;
    const matchesBatch = !filterBatch || student.batch?.name === filterBatch;
    
    return matchesSearch && matchesCourse && matchesBatch;
  });

  // Statistics
  const totalStudents = students.length;
  const activeStudents = students.filter(s => s.status === 'ACTIVE').length;
  const uniqueCourses = [...new Set(students.map(s => s.course?.name).filter(Boolean))].length;

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Scooly</h1>
          <h2 className="text-2xl font-semibold text-gray-700">Students</h2>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-2xl font-bold text-blue-600">{totalStudents}</div>
          <div className="text-gray-600">Total Students</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-2xl font-bold text-green-600">{activeStudents}</div>
          <div className="text-gray-600">Active Students</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-2xl font-bold text-purple-600">{uniqueCourses}</div>
          <div className="text-gray-600">Courses</div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-3">Search Students</h2>
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search students by name, email, or roll number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Course</label>
            <select
              value={filterCourse}
              onChange={(e) => setFilterCourse(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Courses</option>
              {courses.map(course => (
                <option key={course.id} value={course.id}>{course.name}</option>
              ))}
        </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Batch</label>
            <select
              value={filterBatch}
              onChange={(e) => setFilterBatch(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Batches</option>
              {uniqueBatches.map(batch => (
                <option key={batch} value={batch}>{batch}</option>
              ))}
        </select>
          </div>
        </div>
      </div>

      {/* Students Table */}
      {loading ? (
        <div className="text-center py-8">
          <div className="text-gray-500">Loading students...</div>
        </div>
      ) : error ? (
        <div className="text-center py-8">
        <div className="text-red-500">{error}</div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Student List</h2>
              <div className="text-sm text-gray-600">
                Showing {filteredStudents.length} of {totalStudents} students
              </div>
            </div>
          </div>
          
          {filteredStudents.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {searchTerm || filterCourse || filterBatch 
                ? 'No students match your search criteria' 
                : 'No students found'
              }
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
                    <th className="py-3 px-4 text-left font-semibold text-gray-700">Student</th>
                    <th className="py-3 px-4 text-left font-semibold text-gray-700">Roll Number</th>
                    <th className="py-3 px-4 text-left font-semibold text-gray-700">Email</th>
                    <th className="py-3 px-4 text-left font-semibold text-gray-700">Course</th>
                    <th className="py-3 px-4 text-left font-semibold text-gray-700">Batch</th>
                    <th className="py-3 px-4 text-left font-semibold text-gray-700">Semester</th>
                    <th className="py-3 px-4 text-left font-semibold text-gray-700">Section</th>
                    <th className="py-3 px-4 text-left font-semibold text-gray-700">Status</th>
                    <th className="py-3 px-4 text-left font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
                  {filteredStudents.map((student, index) => (
                    <tr key={student.id || index} className="border-b border-gray-100 hover:bg-gray-50 transition">
                      <td className="py-3 px-4">
                        <div>
                          <div className="font-medium text-gray-900">
                            {student.firstName} {student.lastName}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-600">{student.rollNumber || '-'}</td>
                      <td className="py-3 px-4 text-gray-600">{student.email}</td>
                      <td className="py-3 px-4">
                        <div>
                          <div className="font-medium text-gray-900">{student.course?.name || '-'}</div>
                          <div className="text-sm text-gray-500">{student.course?.code || ''}</div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-600">{student.batch?.name || '-'}</td>
                      <td className="py-3 px-4 text-gray-600">{student.semester?.name || '-'}</td>
                      <td className="py-3 px-4 text-gray-600">{student.section?.name || '-'}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          student.status === 'ACTIVE' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {student.status || 'ACTIVE'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <button className="text-blue-600 hover:text-blue-800 transition">
                          <FaEye />
                        </button>
                      </td>
              </tr>
            ))}
          </tbody>
        </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 