import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import classNames from 'classnames';

export default function DropZone({ onFileAccepted, loading }) {
  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      onFileAccepted(acceptedFiles[0]);
    }
  }, [onFileAccepted]);

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.ms-excel': ['.csv']
    },
    multiple: false,
    disabled: loading
  });

  return (
    <div
      {...getRootProps()}
      className={classNames(
        'border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-200',
        {
          'border-accent bg-pastelBlue': isDragActive && !isDragReject,
          'border-red-400 bg-red-50': isDragReject,
          'border-pastelBlue bg-pastelYellow hover:border-accent': !isDragActive && !isDragReject,
          'opacity-50 cursor-not-allowed': loading
        }
      )}
    >
      <input {...getInputProps()} />
      
      <div className="space-y-4">
        <div className="text-6xl">📄</div>
        
        {isDragActive ? (
          <div className="text-lg font-semibold text-accent">
            {isDragReject ? 'Invalid file type!' : 'Drop the CSV file here...'}
          </div>
        ) : (
          <div>
            <div className="text-lg font-semibold text-accent mb-2">
              {loading ? 'Processing...' : 'Drag & drop a CSV file here'}
            </div>
            <div className="text-gray-500">
              or click to browse files
            </div>
          </div>
        )}
        
        <div className="text-sm text-gray-400">
          Only CSV files are accepted
        </div>
      </div>
    </div>
  );
} 