import React, { useEffect, useState } from 'react';
import api from '../../utils/api';

export default function Gradebook() {
  // State for courses and students
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for grades
  const [grades, setGrades] = useState({});
  const [savingGrades, setSavingGrades] = useState({});
  const [saveMessage, setSaveMessage] = useState('');

  // Exam types
  const examTypes = [
    { value: 'MID_TERM', label: 'Mid Term' },
    { value: 'END_TERM', label: 'End Term' },
    { value: 'ASSIGNMENT', label: 'Assignment' },
    { value: 'QUIZ', label: 'Quiz' },
    { value: 'PROJECT', label: 'Project' },
    { value: 'LAB', label: 'Lab' },
    { value: 'PRESENTATION', label: 'Presentation' },
    { value: 'OTHER', label: 'Other' }
  ];

  // Fetch teacher's courses
  useEffect(() => {
    async function fetchCourses() {
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
    }
    fetchCourses();
  }, []);

  // Fetch students and grades when course is selected
  useEffect(() => {
    if (selectedCourse) {
      fetchStudentsAndGrades();
    }
  }, [selectedCourse, fetchStudentsAndGrades]);

  // Fetch students and their grades for selected course
  const fetchStudentsAndGrades = async () => {
    if (!selectedCourse) return;
    try {
      setLoading(true);
      
      // Fetch students
      const studentsRes = await api.get(`/grades/course/${selectedCourse.id}/students`);
      const studentsData = studentsRes.data.data || [];
      setStudents(studentsData);

      // Fetch existing grades
      const gradesRes = await api.get(`/grades/course/${selectedCourse.id}`);
      const gradesData = gradesRes.data.data || [];
      
      // Organize grades by student and exam type
      const organizedGrades = {};
      studentsData.forEach(student => {
        organizedGrades[student.id] = {};
        examTypes.forEach(examType => {
          organizedGrades[student.id][examType.value] = {
            marksObtained: '',
            maxMarks: '',
            remarks: ''
          };
        });
      });

      // Populate with existing grades
      gradesData.forEach(examGroup => {
        examGroup.grades.forEach(grade => {
          if (organizedGrades[grade.studentId] && organizedGrades[grade.studentId][examGroup.examType]) {
            organizedGrades[grade.studentId][examGroup.examType] = {
              marksObtained: grade.marksObtained.toString(),
              maxMarks: examGroup.maxMarks.toString(),
              remarks: grade.remarks || '',
              gradeId: grade.id
            };
          }
        });
      });

      setGrades(organizedGrades);
    } catch (err) {
      setError('Failed to fetch students and grades');
    } finally {
      setLoading(false);
    }
  };

  // Handle grade input change
  const handleGradeChange = (studentId, examType, field, value) => {
    setGrades(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [examType]: {
          ...prev[studentId][examType],
          [field]: value
        }
      }
    }));
  };

  // Save grade for a specific student and exam type
  const saveGrade = async (studentId, examType) => {
    const gradeData = grades[studentId][examType];
    
    if (!gradeData.marksObtained || !gradeData.maxMarks) {
      setSaveMessage('Please enter both marks obtained and max marks');
      setTimeout(() => setSaveMessage(''), 3000);
      return;
    }

    if (Number(gradeData.marksObtained) > Number(gradeData.maxMarks)) {
      setSaveMessage('Marks obtained cannot exceed max marks');
      setTimeout(() => setSaveMessage(''), 3000);
      return;
    }

    setSavingGrades(prev => ({ ...prev, [`${studentId}-${examType}`]: true }));
    setSaveMessage('');

    try {
      const gradePayload = {
        studentId: studentId,
        courseId: selectedCourse.id,
        examType: examType,
        examName: `${examTypes.find(t => t.value === examType)?.label} ${new Date().getFullYear()}`,
        maxMarks: Number(gradeData.maxMarks),
        marksObtained: Number(gradeData.marksObtained),
        examDate: new Date().toISOString().split('T')[0],
        totalMarks: 100, // Default total course marks
        remarks: gradeData.remarks
      };

      if (gradeData.gradeId) {
        // Update existing grade
        await api.put(`/grades/${gradeData.gradeId}`, {
          marksObtained: Number(gradeData.marksObtained),
          remarks: gradeData.remarks
        });
        setSaveMessage('Grade updated successfully!');
      } else {
        // Create new grade
        await api.post('/grades', gradePayload);
        setSaveMessage('Grade saved successfully!');
      }

      // Refresh grades to get the new gradeId
      setTimeout(() => {
        fetchStudentsAndGrades();
        setSaveMessage('');
      }, 1500);

    } catch (err) {
      setSaveMessage(err?.response?.data?.message || 'Failed to save grade');
    } finally {
      setSavingGrades(prev => ({ ...prev, [`${studentId}-${examType}`]: false }));
    }
  };

  // Calculate percentage and grade
  const calculateGrade = (marksObtained, maxMarks) => {
    if (!marksObtained || !maxMarks) return { percentage: '', grade: '' };
    
    const percentage = (Number(marksObtained) / Number(maxMarks)) * 100;
    let grade = 'F';
    
    if (percentage >= 90) grade = 'A+';
    else if (percentage >= 80) grade = 'A';
    else if (percentage >= 70) grade = 'B+';
    else if (percentage >= 60) grade = 'B';
    else if (percentage >= 50) grade = 'C+';
    else if (percentage >= 40) grade = 'C';
    else if (percentage >= 30) grade = 'D';
    
    return { percentage: percentage.toFixed(1), grade };
  };

  // Get grade color class
  const getGradeColor = (grade) => {
    if (grade === 'A+' || grade === 'A') return 'text-green-600 font-semibold';
    if (grade === 'B+' || grade === 'B') return 'text-blue-600 font-semibold';
    if (grade === 'C+' || grade === 'C') return 'text-yellow-600 font-semibold';
    if (grade === 'D') return 'text-orange-600 font-semibold';
    return 'text-red-600 font-semibold';
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Scooly</h1>
        <h2 className="text-2xl font-semibold text-gray-700">Gradebook</h2>
      </div>
      
      {/* Course Selection */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <h2 className="text-lg font-semibold mb-3">Select Course</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {courses.map((course) => (
            <div
              key={course.id}
              className={`p-4 border rounded-lg cursor-pointer transition ${
                selectedCourse?.id === course.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setSelectedCourse(course)}
            >
              <div className="font-semibold">{course.name}</div>
              <div className="text-sm text-gray-600">{course.code}</div>
              <div className="text-sm text-gray-500">{course.program}</div>
            </div>
          ))}
        </div>
      </div>

      {selectedCourse && (
        <>
          {/* Course Header */}
          <div className="bg-white rounded-lg shadow p-4 mb-6">
            <h2 className="text-xl font-bold mb-2">{selectedCourse.name}</h2>
            <p className="text-gray-600">Course Code: {selectedCourse.code} | Program: {selectedCourse.program}</p>
          </div>

          {/* Save Message */}
          {saveMessage && (
            <div className={`mb-4 p-3 rounded ${
              saveMessage.includes('successfully') 
                ? 'bg-green-100 text-green-700' 
                : 'bg-red-100 text-red-700'
            }`}>
              {saveMessage}
            </div>
          )}

          {/* Students and Grades Table */}
      {loading ? (
            <div className="text-gray-500">Loading students and grades...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
          ) : students.length === 0 ? (
            <div className="text-gray-400">No students found for this course.</div>
      ) : (
            <div className="bg-white rounded-lg shadow overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 sticky top-0">
            <tr>
                    <th className="py-3 px-4 text-left font-semibold">Student</th>
                    <th className="py-3 px-4 text-left font-semibold">Roll Number</th>
                    <th className="py-3 px-4 text-left font-semibold">Batch</th>
                    <th className="py-3 px-4 text-left font-semibold">Section</th>
                    {examTypes.map(examType => (
                      <th key={examType.value} className="py-3 px-4 text-left font-semibold text-center">
                        {examType.label}
                      </th>
                    ))}
                    </tr>
                  </thead>
                  <tbody>
                  {students.map((student, index) => (
                    <tr key={student.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="py-3 px-4 font-medium">
                        {student.name}
                      </td>
                      <td className="py-3 px-4">{student.rollNumber}</td>
                      <td className="py-3 px-4">{student.batch}</td>
                      <td className="py-3 px-4">{student.section}</td>
                      
                      {examTypes.map(examType => {
                        const gradeData = grades[student.id]?.[examType.value] || {};
                        const { percentage, grade } = calculateGrade(gradeData.marksObtained, gradeData.maxMarks);
                        
                        return (
                          <td key={examType.value} className="py-3 px-4">
                            <div className="space-y-2">
                              {/* Marks Input */}
                              <div className="flex gap-1">
                                <input
                                  type="number"
                                  placeholder="Marks"
                                  value={gradeData.marksObtained || ''}
                                  onChange={(e) => handleGradeChange(student.id, examType.value, 'marksObtained', e.target.value)}
                                  className="w-16 text-sm border border-gray-300 rounded px-2 py-1"
                                  min="0"
                                  max={gradeData.maxMarks || 100}
                                />
                                <span className="text-sm text-gray-500">/</span>
                                <input
                                  type="number"
                                  placeholder="Max"
                                  value={gradeData.maxMarks || ''}
                                  onChange={(e) => handleGradeChange(student.id, examType.value, 'maxMarks', e.target.value)}
                                  className="w-16 text-sm border border-gray-300 rounded px-2 py-1"
                                  min="1"
                                />
                              </div>
                              
                              {/* Percentage and Grade Display */}
                              {percentage && (
                                <div className="text-xs">
                                  <div className="text-gray-600">{percentage}%</div>
                                  <div className={getGradeColor(grade)}>{grade}</div>
                                </div>
                              )}
                              
                              {/* Save Button */}
                              <button
                                onClick={() => saveGrade(student.id, examType.value)}
                                disabled={savingGrades[`${student.id}-${examType.value}`]}
                                className="w-full text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 disabled:opacity-50"
                              >
                                {savingGrades[`${student.id}-${examType.value}`] ? 'Saving...' : 'Save'}
                              </button>
                              
                              {/* Remarks Input */}
                              <input
                                type="text"
                                placeholder="Remarks"
                                value={gradeData.remarks || ''}
                                onChange={(e) => handleGradeChange(student.id, examType.value, 'remarks', e.target.value)}
                                className="w-full text-xs border border-gray-300 rounded px-2 py-1"
                              />
                            </div>
                          </td>
                        );
                      })}
                          </tr>
            ))}
                  </tbody>
                </table>
            </div>
          )}

          {/* Instructions */}
          <div className="mt-6 bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-800 mb-2">How to use:</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Enter marks obtained and max marks for each exam type</li>
              <li>• Click "Save" to save the grade for that student and exam type</li>
              <li>• Percentage and letter grade are calculated automatically</li>
              <li>• Add optional remarks for additional feedback</li>
              <li>• Grades are saved individually for each student and exam type</li>
            </ul>
          </div>
        </>
        )}
    </div>
  );
} 