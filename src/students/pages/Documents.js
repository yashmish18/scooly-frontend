import React, { useEffect, useState } from 'react';
import { FaBook, FaFileAlt, FaGraduationCap, FaClock, FaFile, FaIdCard, FaCertificate, FaReceipt, FaUniversity, FaFilter, FaUpload, FaDownload, FaEye, FaTrash, FaPlus, FaEdit, FaTimes, FaCheck } from 'react-icons/fa';
import api from '../../utils/api';
import { useStudentCourses } from '../hooks/useStudentCourses';
import CourseCard from '../../components/CourseCard';

const getDocumentIcon = (type) => {
  switch (type) {
    case 'id_card':
      return <FaIdCard className="text-blue-500" />;
    case 'marksheet':
      return <FaFileAlt className="text-green-500" />;
    case 'certificate':
      return <FaCertificate className="text-purple-500" />;
    case 'fee_receipt':
      return <FaReceipt className="text-orange-500" />;
    case 'admission':
    case 'library_card':
    case 'hostel':
      return <FaUniversity className="text-indigo-500" />;
    default:
      return <FaFile className="text-gray-500" />;
  }
};

const getStatusColor = (status) => {
  switch (status) {
    case 'active':
      return 'bg-green-100 text-green-800';
    case 'completed':
      return 'bg-blue-100 text-blue-800';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getTypeColor = (type) => {
  switch (type) {
    case 'id_card':
      return 'bg-blue-100 text-blue-800';
    case 'marksheet':
      return 'bg-green-100 text-green-800';
    case 'certificate':
      return 'bg-purple-100 text-purple-800';
    case 'fee_receipt':
      return 'bg-orange-100 text-orange-800';
    case 'admission':
    case 'library_card':
    case 'hostel':
      return 'bg-indigo-100 text-indigo-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export default function Documents() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [editingDocument, setEditingDocument] = useState(null);
  const [uploadForm, setUploadForm] = useState({
    title: '',
    description: '',
    type: 'document',
    file: null
  });
  const { data: courses = [], isLoading: coursesLoading, isError: coursesError } = useStudentCourses();

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const res = await api.get('/documents/student');
      setDocuments(res.data.data || []);
    } catch (err) {
      setError('Failed to fetch documents');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setUploadForm(prev => ({ ...prev, file }));
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('title', uploadForm.title);
      formData.append('description', uploadForm.description);
      formData.append('type', uploadForm.type);
      if (uploadForm.file) {
        formData.append('file', uploadForm.file);
      }

      await api.post('/documents/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setShowUploadModal(false);
      setUploadForm({ title: '', description: '', type: 'document', file: null });
      fetchDocuments();
    } catch (err) {
      console.error('Upload error:', err);
      setError('Failed to upload document');
    }
  };

  const handleDownload = async (document) => {
    try {
      if (document.fileUrl) {
        const response = await api.get(`/documents/${document.id}/download`, {
          responseType: 'blob'
        });
        
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', document.title || 'document');
        document.body.appendChild(link);
        link.click();
        link.remove();
      }
    } catch (err) {
      console.error('Download error:', err);
      setError('Failed to download document');
    }
  };

  const handleView = async (document) => {
    try {
      if (document.fileUrl) {
        window.open(document.fileUrl, '_blank');
      }
    } catch (err) {
      console.error('View error:', err);
      setError('Failed to view document');
    }
  };

  const handleDelete = async (documentId) => {
    if (window.confirm('Are you sure you want to delete this document?')) {
      try {
        await api.delete(`/documents/${documentId}`);
        fetchDocuments();
      } catch (err) {
        console.error('Delete error:', err);
        setError('Failed to delete document');
      }
    }
  };

  const handleEdit = (document) => {
    setEditingDocument(document);
    setUploadForm({
      title: document.title,
      description: document.description || '',
      type: document.type,
      file: null
    });
    setShowUploadModal(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('title', uploadForm.title);
      formData.append('description', uploadForm.description);
      formData.append('type', uploadForm.type);
      if (uploadForm.file) {
        formData.append('file', uploadForm.file);
      }

      await api.put(`/documents/${editingDocument.id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setShowUploadModal(false);
      setEditingDocument(null);
      setUploadForm({ title: '', description: '', type: 'document', file: null });
      fetchDocuments();
    } catch (err) {
      console.error('Update error:', err);
      setError('Failed to update document');
    }
  };

  const isLoading = loading || coursesLoading;
  const isError = error || coursesError;

  // Filter documents by category
  const filteredDocuments = selectedCategory === 'all' 
    ? documents 
    : documents.filter(doc => doc.category === selectedCategory);

  // Get document counts by category
  const getDocumentCountByCategory = (category) => {
    return documents.filter(doc => doc.category === category).length;
  };

  // Get documents for a specific course
  const getDocumentsForCourse = (courseId) => {
    return documents.filter(doc => doc.courseId === courseId);
  };

  const categories = [
    { id: 'all', name: 'All Documents', count: documents.length },
    { id: 'university', name: 'University', count: getDocumentCountByCategory('university') },
    { id: 'academic', name: 'Academic', count: getDocumentCountByCategory('academic') },
    { id: 'financial', name: 'Financial', count: getDocumentCountByCategory('financial') },
    { id: 'course', name: 'Course', count: getDocumentCountByCategory('course') }
  ];

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Scooly</h1>
        <h2 className="text-2xl font-semibold text-gray-700">Documents</h2>
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
                  const courseDocuments = getDocumentsForCourse(course.id);
                  
                  return (
                    <CourseCard
                      key={course.id}
                      course={course}
                      variant="documents"
                      onClick={() => setSelectedCategory('course')}
                      stats={{
                        documents: courseDocuments.length
                      }}
                    />
                  );
                })}
              </div>
            )}
          </div>

          {/* Document Management Header */}
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold text-gray-800">All Documents</h2>
            <button
              onClick={() => {
                setEditingDocument(null);
                setUploadForm({ title: '', description: '', type: 'document', file: null });
                setShowUploadModal(true);
              }}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <FaPlus size={16} />
              Upload Document
            </button>
          </div>
          
          {/* Category Filter */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <FaFilter className="text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Filter by Category:</span>
            </div>
            <div className="flex flex-wrap gap-3">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category.name} ({category.count})
                </button>
              ))}
            </div>
          </div>

          {/* Documents Table */}
          {filteredDocuments.length === 0 ? (
            <div className="text-gray-400 text-center py-8">No documents found in this category.</div>
          ) : (
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="overflow-x-auto">
                <table className="w-full text-sm rounded-xl overflow-hidden">
                  <thead className="bg-blue-50">
                    <tr>
                      <th className="py-3 px-4 text-left font-semibold text-blue-800">Document</th>
                      <th className="py-3 px-4 text-left font-semibold text-blue-800">Type</th>
                      <th className="py-3 px-4 text-left font-semibold text-blue-800">Category</th>
                      <th className="py-3 px-4 text-left font-semibold text-blue-800">Status</th>
                      <th className="py-3 px-4 text-left font-semibold text-blue-800">Created Date</th>
                      <th className="py-3 px-4 text-left font-semibold text-blue-800">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDocuments.map((doc, i) => (
                      <tr key={doc.id || i} className={`border-b last:border-0 ${i % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-blue-50/50`}>
                        <td className="py-3 px-4">
                          <div className="flex items-center">
                            <div className="mr-3">
                              {getDocumentIcon(doc.type)}
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">{doc.title}</div>
                              <div className="text-xs text-gray-500">{doc.description}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${getTypeColor(doc.type)}`}>
                            {doc.type.replace('_', ' ').toUpperCase()}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="capitalize text-gray-700">{doc.category}</span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(doc.status)}`}>
                            {doc.status}
                          </span>
                        </td>
                        <td className="py-3 px-4">{doc.createdAt ? new Date(doc.createdAt).toLocaleDateString() : '-'}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleView(doc)}
                              className="p-1 text-blue-500 hover:text-blue-700 transition-colors"
                              title="View"
                            >
                              <FaEye size={14} />
                            </button>
                            <button
                              onClick={() => handleDownload(doc)}
                              className="p-1 text-green-500 hover:text-green-700 transition-colors"
                              title="Download"
                            >
                              <FaDownload size={14} />
                            </button>
                            <button
                              onClick={() => handleEdit(doc)}
                              className="p-1 text-yellow-500 hover:text-yellow-700 transition-colors"
                              title="Edit"
                            >
                              <FaEdit size={14} />
                            </button>
                            <button
                              onClick={() => handleDelete(doc.id)}
                              className="p-1 text-red-500 hover:text-red-700 transition-colors"
                              title="Delete"
                            >
                              <FaTrash size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Upload/Edit Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                {editingDocument ? 'Edit Document' : 'Upload Document'}
              </h3>
              <button
                onClick={() => setShowUploadModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes size={20} />
              </button>
            </div>
            
            <form onSubmit={editingDocument ? handleUpdate : handleUpload}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    value={uploadForm.title}
                    onChange={(e) => setUploadForm(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={uploadForm.description}
                    onChange={(e) => setUploadForm(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="3"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Type
                  </label>
                  <select
                    value={uploadForm.type}
                    onChange={(e) => setUploadForm(prev => ({ ...prev, type: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="document">Document</option>
                    <option value="video">Video</option>
                    <option value="link">Link</option>
                    <option value="id_card">ID Card</option>
                    <option value="marksheet">Marksheet</option>
                    <option value="certificate">Certificate</option>
                    <option value="fee_receipt">Fee Receipt</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    File
                  </label>
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.mp4,.mp3"
                  />
                </div>
              </div>
              
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center gap-2"
                >
                  {editingDocument ? <FaCheck size={14} /> : <FaUpload size={14} />}
                  {editingDocument ? 'Update' : 'Upload'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 