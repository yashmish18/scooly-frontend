import React from 'react';

export default function ReviewStep({ formData, onSubmit, loading }) {
  const formatDate = (dateString) => {
    if (!dateString) return 'Not provided';
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-accent mb-6">Review & Submit</h2>
      
      <div className="bg-pastelGreen rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <span className="font-medium">Name:</span> {formData.firstName} {formData.lastName}
          </div>
          <div>
            <span className="font-medium">Email:</span> {formData.email}
          </div>
          <div>
            <span className="font-medium">Phone:</span> {formData.phone || 'Not provided'}
          </div>
          <div>
            <span className="font-medium">Date of Birth:</span> {formatDate(formData.dateOfBirth)}
          </div>
          <div>
            <span className="font-medium">Gender:</span> {formData.gender || 'Not specified'}
          </div>
        </div>
        
        <div className="mt-4">
          <span className="font-medium">Address:</span> {formData.address || 'Not provided'}
          {formData.city && `, ${formData.city}`}
          {formData.state && `, ${formData.state}`}
          {formData.postalCode && ` ${formData.postalCode}`}
        </div>
      </div>
      
      <div className="bg-pastelYellow rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4">Academic Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <span className="font-medium">Course:</span> {formData.courseName || 'Selected'}
          </div>
          <div>
            <span className="font-medium">Batch:</span> {formData.batchName || 'Selected'}
          </div>
          <div>
            <span className="font-medium">Semester:</span> {formData.semesterName || 'Selected'}
          </div>
          <div>
            <span className="font-medium">Section:</span> {formData.sectionName || 'Not assigned'}
          </div>
        </div>
      </div>
      
      <div className="flex justify-end space-x-4">
        <button
          onClick={onSubmit}
          disabled={loading}
          className="bg-accent text-white rounded-xl px-8 py-3 font-semibold shadow hover:bg-pastelBlue hover:text-accent transition focus:outline-none focus:ring-2 focus:ring-accent disabled:opacity-50"
        >
          {loading ? 'Enrolling...' : 'Enroll Student'}
        </button>
      </div>
    </div>
  );
} 