import React, { useState, useEffect } from 'react';
import api from '../../utils/api';

export default function AcademicDetailsStep({ formData, updateFormData }) {
  const [courses, setCourses] = useState([]);
  const [batches, setBatches] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [coursesRes, batchesRes, semestersRes, sectionsRes] = await Promise.all([
          api.get('/courses'),
          api.get('/batches'),
          api.get('/semesters'),
          api.get('/sections')
        ]);
        
        setCourses(coursesRes.data.data || []);
        setBatches(batchesRes.data.data || []);
        setSemesters(semestersRes.data.data || []);
        setSections(sectionsRes.data.data || []);
      } catch (error) {
        console.error('Error fetching academic data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const handleChange = (field, value) => {
    updateFormData({ [field]: value });
  };

  if (loading) {
    return <div className="text-center py-8">Loading academic options...</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-accent mb-6">Academic Details</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="relative my-4">
          <select
            id="courseId"
            value={formData.courseId || ''}
            onChange={(e) => handleChange('courseId', e.target.value)}
            className="block w-full px-4 py-3 bg-white border border-pastelBlue rounded-xl focus:outline-none focus:ring-2 focus:ring-accent"
            required
          >
            <option value="">Select Course</option>
            {courses.map(course => (
              <option key={course.id} value={course.id}>
                {course.name} ({course.code})
              </option>
            ))}
          </select>
        </div>
        
        <div className="relative my-4">
          <select
            id="batchId"
            value={formData.batchId || ''}
            onChange={(e) => handleChange('batchId', e.target.value)}
            className="block w-full px-4 py-3 bg-white border border-pastelBlue rounded-xl focus:outline-none focus:ring-2 focus:ring-accent"
            required
          >
            <option value="">Select Batch</option>
            {batches.map(batch => (
              <option key={batch.id} value={batch.id}>
                {batch.name} ({batch.year})
              </option>
            ))}
          </select>
        </div>
        
        <div className="relative my-4">
          <select
            id="semesterId"
            value={formData.semesterId || ''}
            onChange={(e) => handleChange('semesterId', e.target.value)}
            className="block w-full px-4 py-3 bg-white border border-pastelBlue rounded-xl focus:outline-none focus:ring-2 focus:ring-accent"
            required
          >
            <option value="">Select Semester</option>
            {semesters.map(semester => (
              <option key={semester.id} value={semester.id}>
                {semester.name} (Semester {semester.number})
              </option>
            ))}
          </select>
        </div>
        
        <div className="relative my-4">
          <select
            id="sectionId"
            value={formData.sectionId || ''}
            onChange={(e) => handleChange('sectionId', e.target.value)}
            className="block w-full px-4 py-3 bg-white border border-pastelBlue rounded-xl focus:outline-none focus:ring-2 focus:ring-accent"
          >
            <option value="">Select Section (Optional)</option>
            {sections.map(section => (
              <option key={section.id} value={section.id}>
                Section {section.name} (Capacity: {section.capacity})
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
} 