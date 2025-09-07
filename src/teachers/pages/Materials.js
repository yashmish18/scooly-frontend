import React, { useEffect, useState, useMemo } from 'react';
import api from '../../utils/api';

export default function Materials() {
  const [courses, setCourses] = useState([]);
  const [allCourses, setAllCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addError, setAddError] = useState(null);
  const [addSuccess, setAddSuccess] = useState(null);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ program: '', courseId: '' });
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [students, setStudents] = useState([]);
  const [studentFilters, setStudentFilters] = useState({ batchId: '', semesterId: '', sectionId: '' });
  
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [addStudentForm, setAddStudentForm] = useState({ firstName: '', lastName: '', email: '', batchId: '', semesterId: '', sectionId: '' });
  
  

  // 1. Add state for all students and search
  const [allStudents, setAllStudents] = useState([]);
  const [studentSearch, setStudentSearch] = useState('');
  

  // Add state for the new flow
  const [showStudentSelect, setShowStudentSelect] = useState(false);
  const [availableStudents, setAvailableStudents] = useState([]);
  
  const [findLoading, setFindLoading] = useState(false);
  const [assignLoading, setAssignLoading] = useState(false);
  const [assignMessage, setAssignMessage] = useState('');

  // 1. Change assignedStudents to a map: { [courseId]: [students] }
  const [assignedStudentsMap, setAssignedStudentsMap] = useState({});

  // Function to fetch assigned students for the selected course/class
  
    if (!selectedCourse) return;
    try {
      
        params: {
          courseId: selectedCourse.id
        }
      });
      // console.log('Fetched assigned students:', res.data.data);
      // setAssignedStudents(res.data.data || []); // This line is no longer needed
    } catch {
      // setAssignedStudents([]); // This line is no longer needed
    }
  };

  // 2. Fetch assigned students for all courses
  const fetchAllAssignedStudents = async (coursesList) => {
    if (!coursesList || coursesList.length === 0) return;
    const newMap = {};
    await Promise.all(coursesList.map(async (course) => {
      try {
        
        newMap[course.id] = res.data.data || [];
      } catch {
        newMap[course.id] = [];
      }
    }));
    setAssignedStudentsMap(newMap);
  };

  // Fetch teacher's courses and all courses for dropdowns
  useEffect(() => {
    async function fetchAll() {
      try {
        setLoading(true);
        // Fetch all programs for the dropdown
        const programsRes = await api.get('/courses/programs');
        setAllCourses([]); // reset courses until a program is selected
        setCourses([]); // reset teacher's assigned courses
        setProgramOptions(programsRes.data.data || []);
        // Fetch teacher's assigned courses for display
        const teacherCoursesRes = await api.get('/teachers/courses');
        // Robustly extract teacherId from JWT payload
        const payload = JSON.parse(atob(localStorage.getItem('token').split('.')[1]));
        let teacherId = payload.id || payload.userId || payload.sub;
        if (!teacherId) {
          teacherId = Object.values(payload).find(v => typeof v === 'string' && v.length > 10);
        }
        const myCourses = (teacherCoursesRes.data.data || []).filter(c => c.teacherId === teacherId);
        setCourses(myCourses);
      } catch (err) {
        setError('Failed to fetch data from server.');
      } finally {
        setLoading(false);
      }
    }
    fetchAll();
  }, []);

  // Fetch courses for selected program
  useEffect(() => {
    async function fetchCoursesForProgram() {
      if (!form.program) {
        setAllCourses([]);
        return;
      }
      setLoading(true);
      try {
        
        setAllCourses(res.data.data || []);
      } catch (err) {
        setAllCourses([]);
      } finally {
        setLoading(false);
      }
    }
    fetchCoursesForProgram();
  }, [form.program]);

  // Unique program options (now from API)
  const [programOptions, setProgramOptions] = useState([]);

  // Courses filtered by selected program (now just allCourses)
  const filteredCourses = allCourses;

  const handleFormChange = e => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    setAddError(null);
    setAddSuccess(null);
  };

  const handleAddCourse = async e => {
    e.preventDefault();
    setAdding(true);
    setAddError(null);
    setAddSuccess(null);
    try {
      const selected = allCourses.find(c => c.id === form.courseId);
      if (!selected) {
        setAddError('Please select a course.');
        setAdding(false);
        return;
      }
      await api.post('/teachers/courses/add', {
        name: selected.name,
        code: selected.code,
        description: selected.description,
        duration: selected.duration,
        credits: selected.credits,
        program: selected.program,
      });
      setAddSuccess('Course added successfully!');
      setForm({ program: '', courseId: '' });
      // Refresh teacher's courses
      const teacherCoursesRes = await api.get('/teachers/courses');
      const payload = JSON.parse(atob(localStorage.getItem('token').split('.')[1]));
      let teacherId = payload.id || payload.userId || payload.sub;
      if (!teacherId) {
        teacherId = Object.values(payload).find(v => typeof v === 'string' && v.length > 10);
      }
      const myCourses = (teacherCoursesRes.data.data || []).filter(c => c.teacherId === teacherId);
      setCourses(myCourses);
    } catch (err) {
      setAddError(
        err?.response?.data?.error || 'Failed to add course.'
      );
    } finally {
      setAdding(false);
    }
  };

  // Global program-based dropdowns for Add Student
  const [programBatches, setProgramBatches] = useState([]);
  const [programSemesters, setProgramSemesters] = useState([]);
  const [programSections, setProgramSections] = useState([]);

  // When Add Student is opened, set the program in the form to the selected course's program (if any)
  
    setShowAddStudent(true);
    setAddStudentForm({
      firstName: '',
      lastName: '',
      email: '',
      batchId: '',
      semesterId: '',
      sectionId: '',
      program: selectedCourse?.program || form.program || ''
    });
    setAddStudentError(null);
    setAddStudentSuccess(null);
  };

  // Fetch batches/semesters/sections for the correct program (from Add Student form or global form)
  useEffect(() => {
    const program = addStudentForm.program || form.program;
    // console.log('Dropdown fetch for program:', program);
    if (!program) {
      setProgramBatches([]);
      setProgramSemesters([]);
      setProgramSections([]);
      return;
    }
    async function fetchProgramData() {
      try {
        const [batchesRes, semestersRes, sectionsRes] = await Promise.all([
          api.get(`/batches/by-program/${encodeURIComponent(program)}`),
          api.get(`/semesters/by-program/${encodeURIComponent(program)}`),
          api.get(`/sections/by-program/${encodeURIComponent(program)}`),
        ]);
        setProgramBatches(batchesRes.data.data || []);
        setProgramSemesters(semestersRes.data.data || []);
        setProgramSections(sectionsRes.data.data || []);
        // console.log('Fetched batches:', batchesRes.data.data);
        // console.log('Fetched semesters:', semestersRes.data.data);
        // console.log('Fetched sections:', sectionsRes.data.data);
      } catch {
        setProgramBatches([]);
        setProgramSemesters([]);
        setProgramSections([]);
      }
    }
    fetchProgramData();
  }, [addStudentForm.program, form.program]);

  // Use these for Add Student dropdowns
  const batchOptions = programBatches;
  
  const sectionOptions = useMemo(() => {
    if (!addStudentForm.batchId) return [];
    // Only show sections for the selected batch
    return programSections.filter(s => s.batchId === addStudentForm.batchId);
  }, [programSections, addStudentForm.batchId]);

  // Filter semesters for the selected batch
  const filteredSemesterOptions = useMemo(() => {
    if (!addStudentForm.batchId) return [];
    return programSemesters.filter(s => s.batchId === addStudentForm.batchId);
  }, [programSemesters, addStudentForm.batchId]);

  
    setStudentFilters(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleAddStudentFormChange = e => {
    setAddStudentForm(f => ({ ...f, [e.target.name]: e.target.value }));
    setAddStudentError(null);
    setAddStudentSuccess(null);
  };

  
    e.preventDefault();
    setAddStudentError(null);
    setAddStudentSuccess(null);
    try {
      await api.post('/teachers/students/add', {
        ...addStudentForm,
        courseId: selectedCourse.id,
      });
      setAddStudentSuccess('Student added successfully!');
      setAddStudentForm({ firstName: '', lastName: '', email: '', batchId: '', semesterId: '', sectionId: '' });
      // Refresh students
      const params = {
        courseId: selectedCourse.id,
        ...(studentFilters.batchId && { batchId: studentFilters.batchId }),
        ...(studentFilters.semesterId && { semesterId: studentFilters.semesterId }),
        ...(studentFilters.sectionId && { sectionId: studentFilters.sectionId }),
      };
      
      setStudents(res.data.data || []);
    } catch (err) {
      setAddStudentError(err?.response?.data?.error || 'Failed to add student');
    }
  };

  // 2. Fetch all students when Add Student is opened
  useEffect(() => {
    if (showAddStudent) {
      api.get('/students', { params: { limit: 1000 } })
        .then(res => setAllStudents(res.data.data || []))
        .catch(() => setAllStudents([]));
    }
  }, [showAddStudent]);

  // 3. Filter students for search
  
    if (!studentSearch) return allStudents;
    const search = studentSearch.toLowerCase();
    return allStudents.filter(s =>
      s.firstName?.toLowerCase().includes(search) ||
      s.lastName?.toLowerCase().includes(search) ||
      s.email?.toLowerCase().includes(search) ||
      s.rollNumber?.toLowerCase().includes(search)
    );
  }, [allStudents, studentSearch]);

  // Handler for Find Students
  const handleFindStudents = async (e) => {
    e.preventDefault();
    setFindLoading(true);
    setAssignMessage('');
    setShowStudentSelect(false);
    setAvailableStudents([]);
    setSelectedStudentIds([]);
    try {
      const { batchId, semesterId, sectionId, program } = addStudentForm;
      if (!batchId || !semesterId) {
        setAssignMessage('Please select batch and semester.');
        setFindLoading(false);
        return;
      }
      
        params: { batchId, semesterId, sectionId, program }
      });
      if (!res.data.data || res.data.data.length === 0) {
        setAssignMessage('No students found for the selected class.');
        setFindLoading(false);
        return;
      }
      setAvailableStudents(res.data.data || []);
      setShowStudentSelect(true);
    } catch (err) {
      if (err.response && err.response.status === 400) {
        setAssignMessage(err.response.data.error || 'Invalid selection.');
      } else {
        setAssignMessage('Failed to fetch students.');
      }
    } finally {
      setFindLoading(false);
    }
  };

  // 3. Fetch assigned students for all courses
  useEffect(() => {
    if (courses.length > 0) fetchAllAssignedStudents(courses);
  }, [courses]);

  // Filter available students by search
  const filteredAvailableStudents = useMemo(() => {
    if (!studentSearch) return availableStudents;
    const search = studentSearch.toLowerCase();
    return availableStudents.filter(s =>
      s.firstName?.toLowerCase().includes(search) ||
      s.lastName?.toLowerCase().includes(search) ||
      s.email?.toLowerCase().includes(search) ||
      s.rollNumber?.toLowerCase().includes(search)
    );
  }, [availableStudents, studentSearch]);

  // State for Select All checkbox
  const [allSelected, setAllSelected] = useState(false);

  const handleSelectAll = (e) => {
    setAllSelected(e.target.checked);
    setSelectedStudentIds(filteredAvailableStudents.map(s => s.id));
  };

  // 4. After assignment, re-fetch for the affected course
  const handleBulkAssign = async (e) => {
    e.preventDefault();
    setAssignLoading(true);
    setAssignMessage('');
    try {
      const { batchId, semesterId, sectionId } = addStudentForm;
      await api.post('/teachers/students/assign', {
        studentIds: selectedStudentIds,
        batchId,
        semesterId,
        sectionId,
        courseId: selectedCourse.id
      });
      setAssignMessage('Students assigned successfully!');
      setShowStudentSelect(false);
      setAvailableStudents([]);
      setSelectedStudentIds([]);
      setAddStudentForm(f => ({ ...f, batchId: '', semesterId: '', sectionId: '' }));
      // Re-fetch only for this course
      fetchAllAssignedStudents([selectedCourse]);
    } catch (err) {
      setAssignMessage('Failed to assign students.');
    } finally {
      setAssignLoading(false);
    }
  };

  // Add state for modal
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);

  // Add state for assigned students modal
  const [showAssignedStudentsModal, setShowAssignedStudentsModal] = useState(false);

  // 5. Update getAssignedClassInfo to use the map
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

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">My Courses</h1>
      {/* Add Course Form */}
      <form className="bg-white rounded-lg shadow p-4 mb-8 flex flex-wrap gap-4 items-end" onSubmit={handleAddCourse}>
        <select
          name="program"
          value={form.program}
          onChange={handleFormChange}
          className="border p-2 rounded w-40"
          required
        >
          <option value="">Select Program</option>
          {programOptions.map(p => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
        <select
          name="courseId"
          value={form.courseId}
          onChange={handleFormChange}
          className="border p-2 rounded w-40"
          required
          disabled={!form.program}
        >
          <option value="">Select Course</option>
          {filteredCourses.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded font-semibold"
          disabled={adding}
        >
          {adding ? 'Adding...' : 'Add Course'}
        </button>
        {addError && <div className="text-red-500 ml-4">{addError}</div>}
        {addSuccess && <div className="text-green-600 ml-4">{addSuccess}</div>}
      </form>
      {/* Teacher's Courses */}
      {loading ? (
        <div className="text-gray-500">Loading...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : courses.length === 0 ? (
        <div className="text-gray-400">No courses found. Please add a course to get started.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
          {courses.map((course) => {
            // Use batchNames and sectionNames from backend (only those with students)
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
                <button
                  type="button"
                  className="mt-4 bg-blue-600 text-white px-4 py-2 rounded font-semibold"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedCourse(course);
                    setAddStudentForm({
                      batchId: '',
                      semesterId: '',
                      sectionId: '',
                      program: course.program || ''
                    });
                    setShowAddStudentModal(true);
                    setAddStudentError(null);
                    setAddStudentSuccess(null);
                  }}
                >
                  Add Student
                </button>
                <button
                  type="button"
                  className="mt-4 ml-2 bg-purple-600 text-white px-4 py-2 rounded font-semibold"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent course card click
                    setSelectedCourse(course);
                    fetchAllAssignedStudents([course]); // Re-fetch for this specific course
                    setShowAssignedStudentsModal(true);
                  }}
                >
                  See Assigned Students
                </button>
              </div>
            );
          })}
        </div>
      )}
      {/* Course Details and Students */}
      {selectedCourse && (
        <div className="bg-white rounded-lg shadow p-6 mt-4">
          {/* FILTERS */}
          {/* REMOVED: Filter Students UI */}
          {/* ADD STUDENT FORM */}
          {showAddStudent && (
            <div className="bg-white border border-accent rounded-xl shadow-lg p-6 mb-6">
              <h2 className="text-lg font-bold mb-4 text-accent">Assign Student to Class</h2>
              <form className="flex flex-wrap gap-4 items-end" onSubmit={handleFindStudents}>
                <select name="batchId" value={addStudentForm.batchId} onChange={handleAddStudentFormChange} className="border p-2 rounded w-32" required>
                  <option value="">Select Batch</option>
                  {batchOptions.length === 0 ? (
                    <option disabled value="">N/A</option>
                  ) : (
                    batchOptions.map(b => <option key={b.id} value={b.id}>{b.name}</option>)
                  )}
                </select>
                <select name="semesterId" value={addStudentForm.semesterId} onChange={handleAddStudentFormChange} className="border p-2 rounded w-32" required>
                  <option value="">Select Semester</option>
                  {filteredSemesterOptions.length === 0 ? (
                    <option disabled value="">N/A</option>
                  ) : (
                    filteredSemesterOptions.map(s => <option key={s.id} value={s.id}>{s.name}</option>)
                  )}
                </select>
                <select name="sectionId" value={addStudentForm.sectionId} onChange={handleAddStudentFormChange} className="border p-2 rounded w-32">
                  <option value="">Select Section (optional)</option>
                  {sectionOptions.length === 0 ? (
                    <option disabled value="">N/A</option>
                  ) : (
                    sectionOptions.map(s => <option key={s.id} value={s.id}>{s.name}</option>)
                  )}
                </select>
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded font-semibold" disabled={findLoading || !addStudentForm.batchId || !addStudentForm.semesterId}>
                  {findLoading ? 'Finding...' : 'Find Students'}
                </button>
                <button type="button" className="ml-2 px-4 py-2 rounded border" onClick={() => setShowAddStudent(false)}>Cancel</button>
              </form>
              {assignMessage && <div className="mt-2 text-red-500 font-semibold">{assignMessage}</div>}
              {/* Student selection modal/panel */}
              {showStudentSelect && (
                <div className="mt-6 p-4 border rounded-xl bg-gray-50">
                  <div className="mb-2 font-semibold">Select Students to Assign</div>
                  <input
                    type="text"
                    className="border p-2 rounded w-full mb-2"
                    placeholder="Search by name, email, or roll number"
                    value={studentSearch}
                    onChange={e => setStudentSearch(e.target.value)}
                  />
                  <div className="max-h-48 overflow-y-auto border rounded bg-white shadow mb-4">
                    <label><input type="checkbox" checked={allSelected} onChange={handleSelectAll} /> Select All</label>
                    {filteredAvailableStudents.length === 0 ? (
                      <div className="px-3 py-2 text-gray-400">No students found</div>
                    ) : (
                      filteredAvailableStudents.map(s => (
                        <label key={s.id} className="block px-3 py-2 cursor-pointer hover:bg-pastelBlue">
                          <input
                            type="checkbox"
                            checked={selectedStudentIds.includes(s.id)}
                            onChange={e => {
                              if (e.target.checked) setSelectedStudentIds(ids => [...ids, s.id]);
                              else setSelectedStudentIds(ids => ids.filter(id => id !== s.id));
                            }}
                            className="mr-2"
                          />
                          {s.firstName} {s.lastName} ({s.rollNumber}) - {s.email}
                        </label>
                      ))
                    )}
                  </div>
                  <button
                    className="bg-green-600 text-white px-4 py-2 rounded font-semibold"
                    onClick={handleBulkAssign}
                    disabled={assignLoading || selectedStudentIds.length === 0}
                  >
                    {assignLoading ? 'Assigning...' : 'Assign'}
                  </button>
                  <button type="button" className="ml-2 px-4 py-2 rounded border" onClick={() => setShowStudentSelect(false)}>Cancel</button>
                </div>
              )}
            </div>
          )}
          {/* Student Table (unchanged) */}
          {studentLoading ? (
            <div className="text-gray-500">Loading students...</div>
          ) : students.length > 0 ? (
            <table className="w-full text-sm bg-white rounded-xl shadow-lg">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-3 px-4 text-left">Name</th>
                  <th className="py-3 px-4 text-left">Email</th>
                  <th className="py-3 px-4 text-left">Batch</th>
                  <th className="py-3 px-4 text-left">Semester</th>
                  <th className="py-3 px-4 text-left">Section</th>
                </tr>
              </thead>
              <tbody>
                {students.map((s, i) => (
                  <tr key={s.id || i} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="py-3 px-4">{s.firstName} {s.lastName}</td>
                    <td className="py-3 px-4">{s.email}</td>
                    <td className="py-3 px-4">{s.batch?.name || '-'}</td>
                    <td className="py-3 px-4">{s.semester?.name || '-'}</td>
                    <td className="py-3 px-4">{s.section?.name || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : null}
        </div>
      )}
      {/* Modal overlay for assign student form */}
      {showAddStudentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" onClick={() => setShowAddStudentModal(false)}>
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-lg relative" onClick={e => e.stopPropagation()}>
            <button className="absolute top-2 right-2 text-gray-500 hover:text-red-600 text-2xl font-bold" onClick={() => setShowAddStudentModal(false)}>&times;</button>
            <h2 className="text-lg font-bold mb-4 text-accent">Assign Student to Class</h2>
            <form className="flex flex-wrap gap-4 items-end" onSubmit={handleFindStudents}>
              <select name="batchId" value={addStudentForm.batchId} onChange={handleAddStudentFormChange} className="border p-2 rounded w-32" required>
                <option value="">Select Batch</option>
                {batchOptions.length === 0 ? (
                  <option disabled value="">N/A</option>
                ) : (
                  batchOptions.map(b => <option key={b.id} value={b.id}>{b.name}</option>)
                )}
              </select>
              <select name="semesterId" value={addStudentForm.semesterId} onChange={handleAddStudentFormChange} className="border p-2 rounded w-32" required>
                <option value="">Select Semester</option>
                {filteredSemesterOptions.length === 0 ? (
                  <option disabled value="">N/A</option>
                ) : (
                  filteredSemesterOptions.map(s => <option key={s.id} value={s.id}>{s.name}</option>)
                )}
              </select>
              <select name="sectionId" value={addStudentForm.sectionId} onChange={handleAddStudentFormChange} className="border p-2 rounded w-32">
                <option value="">Select Section (optional)</option>
                {sectionOptions.length === 0 ? (
                  <option disabled value="">N/A</option>
                ) : (
                  sectionOptions.map(s => <option key={s.id} value={s.id}>{s.name}</option>)
                )}
              </select>
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded font-semibold" disabled={findLoading || !addStudentForm.batchId || !addStudentForm.semesterId}>
                {findLoading ? 'Finding...' : 'Find Students'}
              </button>
            </form>
            {assignMessage && <div className="mt-2 text-red-500 font-semibold">{assignMessage}</div>}
            {showStudentSelect && (
              <div className="mt-6 p-4 border rounded-xl bg-gray-50">
                <div className="mb-2 font-semibold">Select Students to Assign</div>
                <input
                  type="text"
                  className="border p-2 rounded w-full mb-2"
                  placeholder="Search by name, email, or roll number"
                  value={studentSearch}
                  onChange={e => setStudentSearch(e.target.value)}
                />
                <div className="max-h-48 overflow-y-auto border rounded bg-white shadow mb-4">
                  <label><input type="checkbox" checked={allSelected} onChange={handleSelectAll} /> Select All</label>
                  {filteredAvailableStudents.length === 0 ? (
                    <div className="px-3 py-2 text-gray-400">No students found</div>
                  ) : (
                    filteredAvailableStudents.map(s => (
                      <label key={s.id} className="block px-3 py-2 cursor-pointer hover:bg-pastelBlue">
                        <input
                          type="checkbox"
                          checked={selectedStudentIds.includes(s.id)}
                          onChange={e => {
                            if (e.target.checked) setSelectedStudentIds(ids => [...ids, s.id]);
                            else setSelectedStudentIds(ids => ids.filter(id => id !== s.id));
                          }}
                          className="mr-2"
                        />
                        {s.firstName} {s.lastName} ({s.rollNumber}) - {s.email}
                      </label>
                    ))
                  )}
                </div>
                <button
                  className="bg-green-600 text-white px-4 py-2 rounded font-semibold"
                  onClick={handleBulkAssign}
                  disabled={assignLoading || selectedStudentIds.length === 0}
                >
                  {assignLoading ? 'Assigning...' : 'Assign'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
      {/* Modal overlay for assigned students table */}
      {showAssignedStudentsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" onClick={() => setShowAssignedStudentsModal(false)}>
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-6xl relative overflow-x-auto" style={{ maxHeight: '90vh' }} onClick={e => e.stopPropagation()}>
            <button className="absolute top-2 right-2 text-gray-500 hover:text-red-600 text-2xl font-bold" onClick={() => setShowAssignedStudentsModal(false)}>&times;</button>
            <h2 className="text-2xl font-bold mb-6 text-accent">Assigned Students for {selectedCourse?.name}</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm border rounded-xl shadow-lg">
                <thead className="bg-blue-100 sticky top-0 z-10">
                  <tr>
                    <th className="py-3 px-4 text-left">Name</th>
                    <th className="py-3 px-4 text-left">Email</th>
                    <th className="py-3 px-4 text-left">Phone</th>
                    <th className="py-3 px-4 text-left">Batch</th>
                    <th className="py-3 px-4 text-left">Semester</th>
                    <th className="py-3 px-4 text-left">Section</th>
                    <th className="py-3 px-4 text-left">Parent Name</th>
                    <th className="py-3 px-4 text-left">Parent Phone</th>
                    <th className="py-3 px-4 text-left">Parent Email</th>
                    <th className="py-3 px-4 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {assignedStudentsMap[selectedCourse?.id]?.map((s, i) => (
                    <tr key={s.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="py-2 px-4 whitespace-nowrap">{s.firstName} {s.lastName}</td>
                      <td className="py-2 px-4 whitespace-nowrap break-all">{s.email}</td>
                      <td className="py-2 px-4 whitespace-nowrap">{s.phone || '-'}</td>
                      <td className="py-2 px-4 whitespace-nowrap">{s.batch?.name || '-'}</td>
                      <td className="py-2 px-4 whitespace-nowrap">{s.semester?.name || '-'}</td>
                      <td className="py-2 px-4 whitespace-nowrap">{s.section?.name || '-'}</td>
                      <td className="py-2 px-4 whitespace-nowrap">{s.parentName || '-'}</td>
                      <td className="py-2 px-4 whitespace-nowrap">{s.parentPhone || '-'}</td>
                      <td className="py-2 px-4 whitespace-nowrap break-all">{s.parentEmail || '-'}</td>
                      <td className="py-2 px-4 whitespace-nowrap">{s.status || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 