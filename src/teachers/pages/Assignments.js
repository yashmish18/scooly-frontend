import React, { useEffect, useState, useMemo } from 'react';
import api from '../../utils/api';

export default function Assignments() {
  // Sync state and fetching logic with Materials.js
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [assignedStudentsMap, setAssignedStudentsMap] = useState({});
  const [showNewAssignmentModal, setShowNewAssignmentModal] = useState(false);
  const [newAssignmentForm, setNewAssignmentForm] = useState({ batchId: '', semesterId: '', sectionId: '', title: '', description: '', dueDateTime: '', maxPoints: '' });
  const [programBatches, setProgramBatches] = useState([]);
  const [programSemesters, setProgramSemesters] = useState([]);
  const [programSections, setProgramSections] = useState([]);
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState(null);
  const [createSuccess, setCreateSuccess] = useState(null);

  // State for viewing assignments
  const [showViewAssignmentsModal, setShowViewAssignmentsModal] = useState(false);
  const [assignments, setAssignments] = useState([]);
  const [assignmentsLoading, setAssignmentsLoading] = useState(false);
  const [assignmentsError, setAssignmentsError] = useState(null);
  
  // State for viewing submissions
  const [showViewSubmissionsModal, setShowViewSubmissionsModal] = useState(false);
  const [submissions, setSubmissions] = useState([]);
  const [submissionsLoading, setSubmissionsLoading] = useState(false);
  const [submissionsError, setSubmissionsError] = useState(null);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  
  // State for grading submissions
  const [showGradeModal, setShowGradeModal] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [gradeForm, setGradeForm] = useState({ points: '', feedback: '' });
  const [gradeLoading, setGradeLoading] = useState(false);
  const [gradeError, setGradeError] = useState(null);
  const [gradeSuccess, setGradeSuccess] = useState(null);

  // Fetch teacher's courses and assigned students
  useEffect(() => {
    async function fetchAll() {
      try {
        setLoading(true);
        const teacherCoursesRes = await api.get('/teachers/courses');
        // Robustly extract teacherId from JWT payload
        const payload = JSON.parse(atob(localStorage.getItem('token').split('.')[1]));
        let teacherId = payload.id || payload.userId || payload.sub;
        if (!teacherId) {
          teacherId = Object.values(payload).find(v => typeof v === 'string' && v.length > 10);
        }
        const myCourses = (teacherCoursesRes.data.data || []).filter(c => c.teacherId === teacherId);
        setCourses(myCourses);
        // Fetch assigned students for all courses
        const newMap = {};
        await Promise.all(myCourses.map(async (course) => {
          try {
            const res = await api.get('/students', { params: { courseId: course.id } });
            newMap[course.id] = res.data.data || [];
          } catch {
            newMap[course.id] = [];
          }
        }));
        setAssignedStudentsMap(newMap);
      } catch (err) {
        setError('Failed to fetch data from server.');
      } finally {
        setLoading(false);
      }
    }
    fetchAll();
  }, []);

  // Helper to get batch/semester/section names for a course
  const getAssignedClassInfo = (courseId) => {
    const students = assignedStudentsMap[courseId] || [];
    const batchNames = [...new Set(students.map(s => s.batch?.name).filter(Boolean))];
    const semesterNames = [...new Set(students.map(s => s.semester?.name).filter(Boolean))];
    const sectionNames = [...new Set(students.map(s => s.section?.name).filter(Boolean))];
    return {
      batchNames: batchNames.length > 0 ? batchNames.join(', ') : 'N/A',
      semesterNames: semesterNames.length > 0 ? semesterNames.join(', ') : 'N/A',
      sectionNames: sectionNames.length > 0 ? sectionNames.join(', ') : 'N/A',
    };
  };

  // Fetch batches/semesters/sections for the selected course's program
  useEffect(() => {
    if (!selectedCourse) return;
    async function fetchProgramData() {
      try {
        const [batchesRes, semestersRes, sectionsRes] = await Promise.all([
          api.get(`/batches/by-program/${encodeURIComponent(selectedCourse.program)}`),
          api.get(`/semesters/by-program/${encodeURIComponent(selectedCourse.program)}`),
          api.get(`/sections/by-program/${encodeURIComponent(selectedCourse.program)}`),
        ]);
        setProgramBatches(batchesRes.data.data || []);
        setProgramSemesters(semestersRes.data.data || []);
        setProgramSections(sectionsRes.data.data || []);
      } catch {
        setProgramBatches([]);
        setProgramSemesters([]);
        setProgramSections([]);
      }
    }
    fetchProgramData();
  }, [selectedCourse]);

  const batchOptions = programBatches;
  
  const sectionOptions = useMemo(() => {
    if (!newAssignmentForm.batchId) return [];
    return programSections.filter(s => s.batchId === newAssignmentForm.batchId);
  }, [programSections, newAssignmentForm.batchId]);
  const filteredSemesterOptions = useMemo(() => {
    if (!newAssignmentForm.batchId) return [];
    return programSemesters.filter(s => s.batchId === newAssignmentForm.batchId);
  }, [programSemesters, newAssignmentForm.batchId]);

  // Handle new assignment form changes
  const handleNewAssignmentFormChange = e => {
    setNewAssignmentForm(f => ({ ...f, [e.target.name]: e.target.value }));
    setCreateError(null);
    setCreateSuccess(null);
  };

  // Handle create assignment
  const handleCreateAssignment = async (e) => {
    e.preventDefault();
    setCreateLoading(true);
    setCreateError(null);
    setCreateSuccess(null);
    try {
      const { batchId, semesterId, sectionId, title, description, dueDateTime, maxPoints } = newAssignmentForm;
      if (!batchId || !semesterId || !title || !dueDateTime || !maxPoints) {
        setCreateError('Please fill all required fields.');
        setCreateLoading(false);
        return;
      }
      await api.post('/assignments', {
        courseId: selectedCourse.id,
        batchId,
        semesterId,
        sectionId,
        title,
        description,
        dueDateTime,
        maxPoints: Number(maxPoints)
      });
      setCreateSuccess('Assignment created successfully!');
      setNewAssignmentForm({ batchId: '', semesterId: '', sectionId: '', title: '', description: '', dueDateTime: '', maxPoints: '' });
      setShowNewAssignmentModal(false);
      // Optionally, refresh assignments list here
    } catch (err) {
      setCreateError('Failed to create assignment.');
    } finally {
      setCreateLoading(false);
    }
  };

  // Handle view assignments for a course
  const handleViewAssignments = async (course) => {
    setSelectedCourse(course);
    setShowViewAssignmentsModal(true);
    setAssignmentsLoading(true);
    setAssignmentsError(null);
    try {
      const res = await api.get('/assignments', {
        params: { courseId: course.id }
      });
      setAssignments(res.data.data || []);
    } catch (err) {
      setAssignmentsError('Failed to fetch assignments.');
    } finally {
      setAssignmentsLoading(false);
    }
  };

  // Handle view submissions for an assignment
  const handleViewSubmissions = async (assignment) => {
    setSelectedAssignment(assignment);
    setShowViewSubmissionsModal(true);
    setSubmissionsLoading(true);
    setSubmissionsError(null);
    try {
      const res = await api.get(`/submissions/assignment/${assignment.id}`);
      setSubmissions(res.data.data || []);
    } catch (err) {
      setSubmissionsError('Failed to fetch submissions.');
    } finally {
      setSubmissionsLoading(false);
    }
  };

  // Handle grade submission
  const handleGradeSubmission = (submission) => {
    setSelectedSubmission(submission);
    setGradeForm({ 
      points: submission.points || '', 
      feedback: submission.feedback || '' 
    });
    setShowGradeModal(true);
    setGradeError(null);
    setGradeSuccess(null);
  };

  // Handle grade form changes
  const handleGradeFormChange = (e) => {
    setGradeForm(f => ({ ...f, [e.target.name]: e.target.value }));
    setGradeError(null);
    setGradeSuccess(null);
  };

  // Handle submit grade
  const handleSubmitGrade = async (e) => {
    e.preventDefault();
    setGradeLoading(true);
    setGradeError(null);
    setGradeSuccess(null);
    
    try {
      const { points, feedback } = gradeForm;
      if (!points || points < 0 || points > selectedSubmission.maxPoints) {
        setGradeError(`Points must be between 0 and ${selectedSubmission.maxPoints}`);
        setGradeLoading(false);
        return;
      }

      await api.put(`/submissions/${selectedSubmission.id}/grade`, {
        points: Number(points),
        feedback: feedback
      });

      setGradeSuccess('Grade submitted successfully!');
      
      // Refresh submissions list
      const res = await api.get(`/submissions/assignment/${selectedAssignment.id}`);
      setSubmissions(res.data.data || []);
      
      // Close modal after a short delay
      setTimeout(() => {
        setShowGradeModal(false);
        setGradeSuccess(null);
      }, 1500);
      
    } catch (err) {
      setGradeError(err?.response?.data?.message || 'Failed to submit grade.');
    } finally {
      setGradeLoading(false);
    }
  };

  // Handle view grade details
  const handleViewGrade = (submission) => {
    setSelectedSubmission(submission);
    setGradeForm({ 
      points: submission.points || '', 
      feedback: submission.feedback || '' 
    });
    setShowGradeModal(true);
    setGradeError(null);
    setGradeSuccess(null);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Scooly</h1>
        <h2 className="text-2xl font-semibold text-gray-700">Assignments</h2>
      </div>
      {loading ? (
        <div className="text-gray-500">Loading...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : courses.length === 0 ? (
        <div className="text-gray-400">No courses found. Please add a course to get started.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
          {courses.map((course) => {
            const { batchNames, semesterNames, sectionNames } = getAssignedClassInfo(course.id);
            return (
              <div
                key={course.id}
                className={`bg-white rounded-lg shadow p-5 border border-gray-100 cursor-pointer transition hover:shadow-lg ${selectedCourse?.id === course.id ? 'ring-2 ring-blue-400' : ''}`}
                onClick={() => setSelectedCourse(course)}
              >
                <div className="text-xl font-semibold text-blue-900">{course.name}</div>
                <div className="text-gray-600 mb-2">Code: {course.code}</div>
                <div className="text-gray-600 mb-2">Program: {course.program || 'N/A'}</div>
                <div className="text-gray-500 text-sm mb-1">Batches: {batchNames}</div>
                <div className="text-gray-500 text-sm mb-1">Semesters: {semesterNames}</div>
                <div className="text-gray-500 text-sm">Sections: {sectionNames}</div>
                <div className="mt-4 flex gap-2">
                <button
                  type="button"
                    className="bg-green-600 text-white px-4 py-2 rounded font-semibold"
                  onClick={e => {
                    e.stopPropagation();
                    setSelectedCourse(course);
                    setShowNewAssignmentModal(true);
                  }}
                >
                  + New Assignment
                </button>
                  <button
                    type="button"
                    className="bg-blue-600 text-white px-4 py-2 rounded font-semibold"
                    onClick={e => {
                      e.stopPropagation();
                      handleViewAssignments(course);
                    }}
                  >
                    View Assignments
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
      {/* Modal overlay for new assignment form */}
      {showNewAssignmentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" onClick={() => setShowNewAssignmentModal(false)}>
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-lg relative" onClick={e => e.stopPropagation()}>
            <button className="absolute top-2 right-2 text-gray-500 hover:text-red-600 text-2xl font-bold" onClick={() => setShowNewAssignmentModal(false)}>&times;</button>
            <h2 className="text-lg font-bold mb-4 text-accent">Create New Assignment for {selectedCourse?.name}</h2>
            <form className="flex flex-wrap gap-4 items-end" onSubmit={handleCreateAssignment}>
              <select name="batchId" value={newAssignmentForm.batchId} onChange={handleNewAssignmentFormChange} className="border p-2 rounded w-32" required>
                <option value="">Select Batch</option>
                {batchOptions.length === 0 ? (
                  <option disabled value="">N/A</option>
                ) : (
                  batchOptions.map(b => <option key={b.id} value={b.id}>{b.name}</option>)
                )}
              </select>
              <select name="semesterId" value={newAssignmentForm.semesterId} onChange={handleNewAssignmentFormChange} className="border p-2 rounded w-32" required>
                <option value="">Select Semester</option>
                {filteredSemesterOptions.length === 0 ? (
                  <option disabled value="">N/A</option>
                ) : (
                  filteredSemesterOptions.map(s => <option key={s.id} value={s.id}>{s.name}</option>)
                )}
              </select>
              <select name="sectionId" value={newAssignmentForm.sectionId} onChange={handleNewAssignmentFormChange} className="border p-2 rounded w-32">
                <option value="">Select Section (optional)</option>
                {sectionOptions.length === 0 ? (
                  <option disabled value="">N/A</option>
                ) : (
                  sectionOptions.map(s => <option key={s.id} value={s.id}>{s.name}</option>)
                )}
              </select>
              <input name="title" value={newAssignmentForm.title} onChange={handleNewAssignmentFormChange} placeholder="Title" className="border p-2 rounded w-40" required />
              <input name="dueDateTime" value={newAssignmentForm.dueDateTime} onChange={handleNewAssignmentFormChange} placeholder="Due Date" type="datetime-local" className="border p-2 rounded w-48" required />
              <input name="maxPoints" value={newAssignmentForm.maxPoints} onChange={handleNewAssignmentFormChange} placeholder="Max Points" type="number" className="border p-2 rounded w-32" required />
              <textarea name="description" value={newAssignmentForm.description} onChange={handleNewAssignmentFormChange} placeholder="Description" className="border p-2 rounded w-full" rows={2} />
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded font-semibold" disabled={createLoading}>
                {createLoading ? 'Creating...' : 'Create Assignment'}
              </button>
            </form>
            {createError && <div className="mt-2 text-red-500 font-semibold">{createError}</div>}
            {createSuccess && <div className="mt-2 text-green-600 font-semibold">{createSuccess}</div>}
          </div>
        </div>
      )}
      
      {/* Modal overlay for viewing assignments */}
      {showViewAssignmentsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" onClick={() => setShowViewAssignmentsModal(false)}>
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-4xl relative overflow-x-auto" style={{ maxHeight: '90vh' }} onClick={e => e.stopPropagation()}>
            <button className="absolute top-2 right-2 text-gray-500 hover:text-red-600 text-2xl font-bold" onClick={() => setShowViewAssignmentsModal(false)}>&times;</button>
            <h2 className="text-2xl font-bold mb-6 text-accent">Assignments for {selectedCourse?.name}</h2>
            
            {assignmentsLoading ? (
              <div className="text-gray-500">Loading assignments...</div>
            ) : assignmentsError ? (
              <div className="text-red-500">{assignmentsError}</div>
            ) : assignments.length === 0 ? (
              <div className="text-gray-400">No assignments found for this course.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm border rounded-xl shadow-lg">
                  <thead className="bg-blue-100 sticky top-0 z-10">
                    <tr>
                      <th className="py-3 px-4 text-left">Title</th>
                      <th className="py-3 px-4 text-left">Description</th>
                      <th className="py-3 px-4 text-left">Due Date</th>
                      <th className="py-3 px-4 text-left">Max Points</th>
                      <th className="py-3 px-4 text-left">Status</th>
                      <th className="py-3 px-4 text-left">Batch</th>
                      <th className="py-3 px-4 text-left">Section</th>
                      <th className="py-3 px-4 text-left">Submissions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {assignments.map((assignment, i) => (
                      <tr key={assignment.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="py-2 px-4 whitespace-nowrap font-medium">{assignment.title}</td>
                        <td className="py-2 px-4 max-w-xs truncate">{assignment.description || '-'}</td>
                        <td className="py-2 px-4 whitespace-nowrap">{new Date(assignment.dueDateTime).toLocaleString()}</td>
                        <td className="py-2 px-4 whitespace-nowrap">{assignment.maxPoints}</td>
                        <td className="py-2 px-4 whitespace-nowrap">
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${
                            assignment.status === 'Published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {assignment.status}
                          </span>
                        </td>
                        <td className="py-2 px-4 whitespace-nowrap">{assignment.batch || '-'}</td>
                        <td className="py-2 px-4 whitespace-nowrap">{assignment.section || '-'}</td>
                        <td className="py-2 px-4 whitespace-nowrap">
                          <button
                            type="button"
                            className="bg-purple-600 text-white px-3 py-1 rounded text-xs font-semibold hover:bg-purple-700"
                            onClick={() => handleViewSubmissions(assignment)}
                          >
                            View Submissions ({assignment.submissions})
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Modal overlay for viewing submissions */}
      {showViewSubmissionsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" onClick={() => setShowViewSubmissionsModal(false)}>
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-6xl relative overflow-x-auto" style={{ maxHeight: '90vh' }} onClick={e => e.stopPropagation()}>
            <button className="absolute top-2 right-2 text-gray-500 hover:text-red-600 text-2xl font-bold" onClick={() => setShowViewSubmissionsModal(false)}>&times;</button>
            <h2 className="text-2xl font-bold mb-6 text-accent">Submissions for "{selectedAssignment?.title}"</h2>
            
            {submissionsLoading ? (
              <div className="text-gray-500">Loading submissions...</div>
            ) : submissionsError ? (
              <div className="text-red-500">{submissionsError}</div>
            ) : submissions.length === 0 ? (
              <div className="text-gray-400">No submissions found for this assignment.</div>
            ) : (
              <>
                {/* Summary Statistics */}
                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                  <h3 className="font-semibold text-lg mb-3">Summary</h3>
                  <div className="grid grid-cols-4 gap-4 text-sm">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{submissions.length}</div>
                      <div className="text-gray-600">Total Submissions</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {submissions.filter(s => s.status === 'GRADED').length}
                      </div>
                      <div className="text-gray-600">Graded</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-yellow-600">
                        {submissions.filter(s => s.status === 'SUBMITTED').length}
                      </div>
                      <div className="text-gray-600">Pending</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-600">
                        {submissions.filter(s => s.isLate).length}
                      </div>
                      <div className="text-gray-600">Late</div>
                    </div>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm border rounded-xl shadow-lg">
                    <thead className="bg-purple-100 sticky top-0 z-10">
                      <tr>
                        <th className="py-3 px-4 text-left">Student Name</th>
                        <th className="py-3 px-4 text-left">Roll Number</th>
                        <th className="py-3 px-4 text-left">Email</th>
                        <th className="py-3 px-4 text-left">Batch</th>
                        <th className="py-3 px-4 text-left">Section</th>
                        <th className="py-3 px-4 text-left">Submitted At</th>
                        <th className="py-3 px-4 text-left">Due Date</th>
                        <th className="py-3 px-4 text-left">Status</th>
                        <th className="py-3 px-4 text-left">Points</th>
                        <th className="py-3 px-4 text-left">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {submissions.map((submission, i) => (
                        <tr key={submission.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <td className="py-2 px-4 whitespace-nowrap font-medium">{submission.studentName}</td>
                          <td className="py-2 px-4 whitespace-nowrap">{submission.rollNumber}</td>
                          <td className="py-2 px-4 whitespace-nowrap break-all">{submission.studentEmail}</td>
                          <td className="py-2 px-4 whitespace-nowrap">{submission.batch}</td>
                          <td className="py-2 px-4 whitespace-nowrap">{submission.section}</td>
                          <td className="py-2 px-4 whitespace-nowrap">
                            {new Date(submission.submittedAt).toLocaleString()}
                            {submission.isLate && (
                              <span className="ml-2 px-2 py-1 bg-red-100 text-red-800 text-xs rounded">Late</span>
                            )}
                          </td>
                          <td className="py-2 px-4 whitespace-nowrap">
                            {new Date(submission.dueDate).toLocaleString()}
                          </td>
                          <td className="py-2 px-4 whitespace-nowrap">
                            <span className={`px-2 py-1 rounded text-xs font-semibold ${
                              submission.status === 'GRADED' ? 'bg-green-100 text-green-800' :
                              submission.status === 'LATE' ? 'bg-red-100 text-red-800' :
                              submission.status === 'MISSING' ? 'bg-gray-100 text-gray-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {submission.status}
                            </span>
                          </td>
                          <td className="py-2 px-4 whitespace-nowrap">
                            {submission.points !== null ? `${submission.points}/${submission.maxPoints}` : '-'}
                          </td>
                          <td className="py-2 px-4 whitespace-nowrap">
                            {submission.status !== 'GRADED' && (
                              <button
                                type="button"
                                className="bg-blue-600 text-white px-3 py-1 rounded text-xs font-semibold hover:bg-blue-700"
                                onClick={() => handleGradeSubmission(submission)}
                              >
                                Grade
                              </button>
                            )}
                            {submission.status === 'GRADED' && (
                              <button
                                type="button"
                                className="bg-green-600 text-white px-3 py-1 rounded text-xs font-semibold hover:bg-green-700"
                                onClick={() => handleViewGrade(submission)}
                              >
                                View Grade
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        </div>
      )}
      
      {/* Modal overlay for grading submissions */}
      {showGradeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" onClick={() => setShowGradeModal(false)}>
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-2xl relative" onClick={e => e.stopPropagation()}>
            <button className="absolute top-2 right-2 text-gray-500 hover:text-red-600 text-2xl font-bold" onClick={() => setShowGradeModal(false)}>&times;</button>
            
            <h2 className="text-2xl font-bold mb-6 text-accent">
              {selectedSubmission?.status === 'GRADED' ? 'View Grade' : 'Grade Submission'}
            </h2>
            
            {/* Submission Details */}
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <h3 className="font-semibold text-lg mb-3">Submission Details</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Student:</span> {selectedSubmission?.studentName}
                </div>
                <div>
                  <span className="font-medium">Roll Number:</span> {selectedSubmission?.rollNumber}
                </div>
                <div>
                  <span className="font-medium">Email:</span> {selectedSubmission?.studentEmail}
                </div>
                <div>
                  <span className="font-medium">Batch:</span> {selectedSubmission?.batch}
                </div>
                <div>
                  <span className="font-medium">Section:</span> {selectedSubmission?.section}
                </div>
                <div>
                  <span className="font-medium">Assignment:</span> {selectedAssignment?.title}
                </div>
                <div>
                  <span className="font-medium">Submitted At:</span> {selectedSubmission?.submittedAt ? new Date(selectedSubmission.submittedAt).toLocaleString() : '-'}
                </div>
                <div>
                  <span className="font-medium">Due Date:</span> {selectedSubmission?.dueDate ? new Date(selectedSubmission.dueDate).toLocaleString() : '-'}
                </div>
                <div>
                  <span className="font-medium">Status:</span>
                  <span className={`ml-2 px-2 py-1 rounded text-xs font-semibold ${
                    selectedSubmission?.status === 'GRADED' ? 'bg-green-100 text-green-800' :
                    selectedSubmission?.status === 'LATE' ? 'bg-red-100 text-red-800' :
                    selectedSubmission?.status === 'MISSING' ? 'bg-gray-100 text-gray-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {selectedSubmission?.status}
                  </span>
                  {selectedSubmission?.isLate && (
                    <span className="ml-2 px-2 py-1 bg-red-100 text-red-800 text-xs rounded">Late</span>
                  )}
                </div>
                <div>
                  <span className="font-medium">Max Points:</span> {selectedSubmission?.maxPoints}
                </div>
              </div>
            </div>

            {/* Submission Content */}
            {(selectedSubmission?.content || selectedSubmission?.fileUrl) && (
              <div className="bg-blue-50 p-4 rounded-lg mb-6">
                <h3 className="font-semibold text-lg mb-3">Submission Content</h3>
                {selectedSubmission?.content && (
                  <div className="mb-3">
                    <span className="font-medium">Text Content:</span>
                    <div className="mt-2 p-3 bg-white rounded border text-sm whitespace-pre-wrap">
                      {selectedSubmission.content}
                    </div>
                  </div>
                )}
                {selectedSubmission?.fileUrl && (
                  <div>
                    <span className="font-medium">File:</span>
                    <a 
                      href={selectedSubmission.fileUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="ml-2 text-blue-600 hover:text-blue-800 underline"
                    >
                      View File
                    </a>
                  </div>
                )}
              </div>
            )}

            {/* Grading Form */}
            <form onSubmit={handleSubmitGrade} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Points Awarded (0 - {selectedSubmission?.maxPoints})
                </label>
                <input
                  type="number"
                  name="points"
                  value={gradeForm.points}
                  onChange={handleGradeFormChange}
                  min="0"
                  max={selectedSubmission?.maxPoints}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  disabled={selectedSubmission?.status === 'GRADED'}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Feedback (Optional)
                </label>
                <textarea
                  name="feedback"
                  value={gradeForm.feedback}
                  onChange={handleGradeFormChange}
                  rows={4}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Provide feedback to the student..."
                  disabled={selectedSubmission?.status === 'GRADED'}
                />
              </div>

              {gradeError && (
                <div className="text-red-500 font-semibold">{gradeError}</div>
              )}
              
              {gradeSuccess && (
                <div className="text-green-600 font-semibold">{gradeSuccess}</div>
              )}

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowGradeModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                {selectedSubmission?.status !== 'GRADED' && (
                  <button
                    type="submit"
                    disabled={gradeLoading}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                  >
                    {gradeLoading ? 'Submitting...' : 'Submit Grade'}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 