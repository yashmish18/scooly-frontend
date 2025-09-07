import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DropZone from '../../components/ui/DropZone';
import PreviewTable from '../../components/ui/PreviewTable';
import { useToast } from '../../components/ui/ToastProvider';
import api from '../../utils/api';

export default function BulkUpload() {
  const navigate = useNavigate();
  const toast = useToast();
  const [uploading, setUploading] = useState(false);
  const [importing, setImporting] = useState(false);
  const [previewData, setPreviewData] = useState(null);
  const [errors, setErrors] = useState([]);

  const handleFileUpload = async (file) => {
    setUploading(true);
    setPreviewData(null);
    setErrors([]);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await api.post('/upload/students/csv', formData);

      setPreviewData(response.data.preview);
      setErrors(response.data.errors || []);
      
      if (response.data.errors && response.data.errors.length > 0) {
        toast.warning(`${response.data.errors.length} rows have validation errors`);
      } else {
        toast.success(`CSV uploaded successfully! ${response.data.preview.length} students ready to import.`);
      }
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to upload CSV file');
    } finally {
      setUploading(false);
    }
  };

  const handleConfirmImport = async () => {
    if (!previewData) return;

    setImporting(true);
    try {
      // Clean the data before sending
      const students = previewData.map(row => {
        const {
          firstName, lastName, email, password, phone, dateOfBirth, gender, address, city, state, country, postalCode,
          parentName, parentPhone, parentEmail, program, courseCode, courseName, batchId, semesterId, sectionId, courseId, rollNumber, batch, section
        } = row;
        return {
          firstName, lastName, email, password, phone, dateOfBirth, gender, address, city, state, country, postalCode,
          parentName, parentPhone, parentEmail, program, courseCode, courseName, batchId, semesterId, sectionId, courseId, rollNumber, batch, section
        };
      });
      if (students.length > 0) {
        // eslint-disable-next-line no-console
        console.log('DEBUG: First student sent to backend:', students[0]);
      }
      const response = await api.post('/upload/students/confirm', {
        students
      });

      toast.success(`Successfully imported ${response.data.imported} students!`);
      navigate('/admin');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to import students');
    } finally {
      setImporting(false);
    }
  };

  const handleCancel = () => {
    setPreviewData(null);
    setErrors([]);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-2xl font-bold mb-6">Bulk CSV Upload</div>
      
      <div className="bg-white rounded-2xl shadow-xl p-8">
        {!previewData ? (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Upload CSV File</h3>
              <p className="text-gray-600 mb-6">
                Drag and drop a CSV file containing student information. The file should include columns for: firstName, lastName, email, courseId, batchId, semesterId, etc.
              </p>
            </div>
            
            <DropZone
              onFileAccepted={handleFileUpload}
              loading={uploading}
            />
          </div>
        ) : (
          <PreviewTable
            data={previewData}
            errors={errors}
            onConfirm={handleConfirmImport}
            onCancel={handleCancel}
            loading={importing}
          />
        )}
      </div>
    </div>
  );
} 