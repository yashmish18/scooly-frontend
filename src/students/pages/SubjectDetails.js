import React, { useEffect, useState } from 'react';
import { FaFileAlt, FaFile, FaLink } from 'react-icons/fa';
import api from '../../utils/api';
import CourseCard from '../../components/CourseCard';

export default function SubjectDetails() {
  const [subjects, setSubjects] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchSubjectDetails() {
      try {
        setLoading(true);
        const [subjectsRes, materialsRes, resourcesRes] = await Promise.all([
          api.get('/subjects/current'),
          api.get('/materials/current'),
          api.get('/resources/current'),
        ]);
        setSubjects(subjectsRes.data.data || []);
        setMaterials(materialsRes.data.data || []);
        setResources(resourcesRes.data.data || []);
      } catch (err) {
        setError('Failed to fetch subject details');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchSubjectDetails();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };


  // Get materials for a specific course
  const getMaterialsForCourse = (courseId) => {
    return materials.filter(material => material.courseId === courseId);
  };

  // Get resources for a specific course
  const getResourcesForCourse = (courseId) => {
    return resources.filter(resource => resource.courseId === courseId);
  };

  // Get materials by type for a course
  const getMaterialsByType = (courseId, type) => {
    return materials.filter(material => material.courseId === courseId && material.type === type);
  };

  // Get resources by type for a course
  const getResourcesByType = (courseId, type) => {
    return resources.filter(resource => resource.courseId === courseId && resource.type === type);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Scooly</h1>
        <h2 className="text-2xl font-semibold text-gray-700">Subject Details</h2>
      </div>
      
      {loading ? (
        <div className="text-gray-500 text-center py-8">Loading...</div>
      ) : error ? (
        <div className="text-red-500 text-center py-8">{error}</div>
      ) : (
        <div className="space-y-8">
          {/* Subject Cards */}
          <div>
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">My Courses</h2>
            {subjects.length === 0 ? (
              <div className="text-gray-400 text-center py-8">No courses found.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {subjects.map((subject) => {
                  const courseMaterials = getMaterialsForCourse(subject.id);
                  const courseResources = getResourcesForCourse(subject.id);
                  const documents = getMaterialsByType(subject.id, 'document');
                  const videos = getMaterialsByType(subject.id, 'video');
                  // const links = getResourcesByType(subject.id, 'link');
                  
                  return (
                    <CourseCard
                      key={subject.id}
                      course={subject}
                      variant="subjects"
                      stats={{
                        documents: documents.length,
                        videos: videos.length,
                        resources: courseResources.length,
                        totalMaterials: courseMaterials.length
                      }}
                    />
                  );
                })}
              </div>
            )}
          </div>

          {/* Materials Table */}
          <div>
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">Course Materials & Resources</h2>
            {materials.length === 0 && resources.length === 0 ? (
              <div className="text-gray-400 text-center py-8">No materials or resources found.</div>
            ) : (
              <div className="space-y-6">
                {/* Materials Section */}
                {materials.length > 0 && (
                  <div>
                    <h3 className="text-xl font-semibold mb-4 text-gray-700">Materials</h3>
                    <div className="bg-white rounded-2xl shadow-xl p-8">
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm rounded-xl overflow-hidden">
                          <thead className="bg-blue-50">
                            <tr>
                              <th className="py-3 px-4 text-left font-semibold text-blue-800">Title</th>
                              <th className="py-3 px-4 text-left font-semibold text-blue-800">Description</th>
                              <th className="py-3 px-4 text-left font-semibold text-blue-800">Type</th>
                              <th className="py-3 px-4 text-left font-semibold text-blue-800">Created Date</th>
                              <th className="py-3 px-4 text-left font-semibold text-blue-800">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {materials.map((material, i) => (
                              <tr key={material.id} className={
                                `border-b last:border-0 ${i % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-blue-50/50`}
                              >
                                <td className="py-3 px-4 font-medium">{material.title}</td>
                                <td className="py-3 px-4">{material.description || '-'}</td>
                                <td className="py-3 px-4">
                                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                    material.type === 'video' 
                                      ? 'bg-red-100 text-red-800'
                                      : material.type === 'document'
                                      ? 'bg-blue-100 text-blue-800'
                                      : 'bg-gray-100 text-gray-800'
                                  }`}>
                                    {material.type}
                                  </span>
                                </td>
                                <td className="py-3 px-4">
                                  {material.createdAt ? formatDate(material.createdAt) : '-'}
                                </td>
                                <td className="py-3 px-4">
                                  <div className="flex items-center gap-2">
                                    {material.fileUrl && (
                                      <>
                                        <button
                                          onClick={() => window.open(material.fileUrl, '_blank')}
                                          className="p-1 text-blue-500 hover:text-blue-700 transition-colors"
                                          title="View"
                                        >
                                          <FaFile size={14} />
                                        </button>
                                        <button
                                          onClick={() => {
                                            const link = document.createElement('a');
                                            link.href = material.fileUrl;
                                            link.download = material.title || 'material';
                                            link.click();
                                          }}
                                          className="p-1 text-green-500 hover:text-green-700 transition-colors"
                                          title="Download"
                                        >
                                          <FaFileAlt size={14} />
                                        </button>
                                      </>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}

                {/* Resources Section */}
                {resources.length > 0 && (
                  <div>
                    <h3 className="text-xl font-semibold mb-4 text-gray-700">Resources</h3>
                    <div className="bg-white rounded-2xl shadow-xl p-8">
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm rounded-xl overflow-hidden">
                          <thead className="bg-green-50">
                            <tr>
                              <th className="py-3 px-4 text-left font-semibold text-green-800">Title</th>
                              <th className="py-3 px-4 text-left font-semibold text-green-800">Description</th>
                              <th className="py-3 px-4 text-left font-semibold text-green-800">Type</th>
                              <th className="py-3 px-4 text-left font-semibold text-green-800">Created Date</th>
                              <th className="py-3 px-4 text-left font-semibold text-green-800">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {resources.map((resource, i) => (
                              <tr key={resource.id} className={
                                `border-b last:border-0 ${i % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-green-50/50`}
                              >
                                <td className="py-3 px-4 font-medium">{resource.title}</td>
                                <td className="py-3 px-4">{resource.description || '-'}</td>
                                <td className="py-3 px-4">
                                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                    resource.type === 'link' 
                                      ? 'bg-green-100 text-green-800'
                                      : 'bg-gray-100 text-gray-800'
                                  }`}>
                                    {resource.type}
                                  </span>
                                </td>
                                <td className="py-3 px-4">
                                  {resource.createdAt ? formatDate(resource.createdAt) : '-'}
                                </td>
                                <td className="py-3 px-4">
                                  <div className="flex items-center gap-2">
                                    {resource.url && (
                                      <button
                                        onClick={() => window.open(resource.url, '_blank')}
                                        className="p-1 text-green-500 hover:text-green-700 transition-colors"
                                        title="Open Link"
                                      >
                                        <FaLink size={14} />
                                      </button>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 