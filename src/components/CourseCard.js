import React from 'react';
import { FaBook, FaFileAlt, FaGraduationCap, FaClock, FaFile, FaLink, FaVideo, FaUsers, FaCalendar, FaChartBar } from 'react-icons/fa';

const CourseCard = ({ 
  course, 
  variant = 'default', 
  onClick, 
  showStats = true,
  stats = {},
  className = ""
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'documents':
        return {
          icon: FaFile,
          iconColor: 'text-blue-500',
          borderColor: 'border-blue-200',
          hoverColor: 'hover:border-blue-300'
        };
      case 'subjects':
        return {
          icon: FaBook,
          iconColor: 'text-green-500',
          borderColor: 'border-green-200',
          hoverColor: 'hover:border-green-300'
        };
      case 'assignments':
        return {
          icon: FaFileAlt,
          iconColor: 'text-purple-500',
          borderColor: 'border-purple-200',
          hoverColor: 'hover:border-purple-300'
        };
      case 'attendance':
        return {
          icon: FaUsers,
          iconColor: 'text-orange-500',
          borderColor: 'border-orange-200',
          hoverColor: 'hover:border-orange-300'
        };
      case 'grades':
        return {
          icon: FaChartBar,
          iconColor: 'text-indigo-500',
          borderColor: 'border-indigo-200',
          hoverColor: 'hover:border-indigo-300'
        };
      default:
        return {
          icon: FaBook,
          iconColor: 'text-gray-500',
          borderColor: 'border-gray-200',
          hoverColor: 'hover:border-gray-300'
        };
    }
  };

  const variantStyles = getVariantStyles();
  const IconComponent = variantStyles.icon;

  const renderStats = () => {
    if (!showStats) return null;

    switch (variant) {
      case 'documents':
        return (
          <div className="border-t pt-3 mt-3">
            <h4 className="font-medium text-gray-700 mb-2">Documents:</h4>
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <FaFile className="mr-2 text-blue-400" />
                  <span>Course Documents:</span>
                </div>
                <span className="font-medium">{stats.documents || 0}</span>
              </div>
            </div>
          </div>
        );
      
      case 'subjects':
        return (
          <div className="border-t pt-3 mt-3">
            <h4 className="font-medium text-gray-700 mb-2">Course Content:</h4>
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <FaFile className="mr-2 text-blue-400" />
                  <span>Documents:</span>
                </div>
                <span className="font-medium">{stats.documents || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <FaVideo className="mr-2 text-red-400" />
                  <span>Videos:</span>
                </div>
                <span className="font-medium">{stats.videos || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <FaLink className="mr-2 text-green-400" />
                  <span>Resources:</span>
                </div>
                <span className="font-medium">{stats.resources || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <FaFileAlt className="mr-2 text-purple-400" />
                  <span>Total Materials:</span>
                </div>
                <span className="font-medium">{stats.totalMaterials || 0}</span>
              </div>
            </div>
          </div>
        );
      
      case 'assignments':
        return (
          <div className="border-t pt-3 mt-3">
            <h4 className="font-medium text-gray-700 mb-2">Assignments:</h4>
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <FaFileAlt className="mr-2 text-purple-400" />
                  <span>Total:</span>
                </div>
                <span className="font-medium">{stats.totalAssignments || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <FaCalendar className="mr-2 text-green-400" />
                  <span>Pending:</span>
                </div>
                <span className="font-medium">{stats.pendingAssignments || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <FaChartBar className="mr-2 text-blue-400" />
                  <span>Completed:</span>
                </div>
                <span className="font-medium">{stats.completedAssignments || 0}</span>
              </div>
            </div>
          </div>
        );
      
      case 'attendance':
        return (
          <div className="border-t pt-3 mt-3">
            <h4 className="font-medium text-gray-700 mb-2">Attendance:</h4>
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <FaUsers className="mr-2 text-green-400" />
                  <span>Present:</span>
                </div>
                <span className="font-medium">{stats.presentDays || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <FaCalendar className="mr-2 text-red-400" />
                  <span>Absent:</span>
                </div>
                <span className="font-medium">{stats.absentDays || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <FaChartBar className="mr-2 text-blue-400" />
                  <span>Percentage:</span>
                </div>
                <span className="font-medium">{stats.attendancePercentage || 0}%</span>
              </div>
            </div>
          </div>
        );
      
      case 'grades':
        return (
          <div className="border-t pt-3 mt-3">
            <h4 className="font-medium text-gray-700 mb-2">Grades:</h4>
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <FaChartBar className="mr-2 text-blue-400" />
                  <span>Average:</span>
                </div>
                <span className="font-medium">{stats.averageGrade || 0}%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <FaFileAlt className="mr-2 text-green-400" />
                  <span>Assignments:</span>
                </div>
                <span className="font-medium">{stats.totalAssignments || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <FaBook className="mr-2 text-purple-400" />
                  <span>Exams:</span>
                </div>
                <span className="font-medium">{stats.totalExams || 0}</span>
              </div>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div
      className={`bg-white shadow-md rounded-lg p-6 border ${variantStyles.borderColor} ${variantStyles.hoverColor} transition-all duration-200 ${onClick ? 'cursor-pointer' : ''} ${className}`}
      onClick={onClick}
    >
      <div className="flex items-center mb-4">
        <div className={`${variantStyles.iconColor} mr-3`}>
          <IconComponent size={24} />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-800">{course.name}</h3>
          <p className="text-sm text-gray-600">{course.code}</p>
        </div>
      </div>
      
      <div className="space-y-2 text-sm text-gray-600">
        <div className="flex items-center">
          <FaGraduationCap className="mr-2 text-gray-400" />
          <span>Program: {course.program}</span>
        </div>
        <div className="flex items-center">
          <FaClock className="mr-2 text-gray-400" />
          <span>Duration: {course.duration} months</span>
        </div>
        <div className="flex items-center">
          <FaFileAlt className="mr-2 text-gray-400" />
          <span>Credits: {course.credits}</span>
        </div>
      </div>
      
      {renderStats()}
      
      {course.description && (
        <p className="mt-4 text-sm text-gray-600 border-t pt-3">
          {course.description}
        </p>
      )}
    </div>
  );
};

export default CourseCard; 