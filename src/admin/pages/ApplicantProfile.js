import React from 'react';
import { useParams } from 'react-router-dom';

const applicant = {
  name: 'Sophia Bennett',
  id: '789012',
  email: 'sophia.bennett@email.com',
  phone: '(555) 123-4567',
  dob: '1998-05-15',
  address: '123 Maple Street',
  city: 'Springfield',
  state: 'CA',
  zip: '91234',
  highSchool: 'Northwood High',
  gpa: '3.8',
  sat: '1450',
  major: 'Computer Science',
  status: 'Under Review',
  decision: 'Pending',
  avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
};

export default function ApplicantProfile() {
  const { id } = useParams();

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold mb-1">Applicant Profile</h1>
          <p className="text-gray-500 text-sm">Review and manage applicant details</p>
        </div>
        <button className="bg-gray-100 text-gray-800 rounded-md px-5 py-2 font-semibold shadow hover:bg-gray-200 transition">Export Report</button>
      </div>

      {/* Profile section */}
      <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
        <div className="flex items-center gap-6 mb-10">
          <img src={applicant.avatar} alt={applicant.name} className="w-24 h-24 rounded-full object-cover border-4 border-white shadow" />
          <div>
            <div className="text-xl font-bold text-gray-900">{applicant.name}</div>
            <div className="text-blue-600 text-sm font-medium">Application ID: {applicant.id}</div>
          </div>
        </div>

        {/* Personal Information */}
        <div className="mb-10">
          <div className="font-bold text-lg mb-4">Personal Information</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-2 border-t border-gray-200 pt-4">
            <div><span className="font-medium">Full Name</span><div>{applicant.name}</div></div>
            <div><span className="font-medium">Email</span><div>{applicant.email}</div></div>
            <div><span className="font-medium">Phone</span><div>{applicant.phone}</div></div>
            <div><span className="font-medium">Date of Birth</span><div>{applicant.dob}</div></div>
            <div><span className="font-medium">Address</span><div>{applicant.address}</div></div>
            <div><span className="font-medium">City</span><div>{applicant.city}</div></div>
            <div><span className="font-medium">State</span><div>{applicant.state}</div></div>
            <div><span className="font-medium">Zip Code</span><div>{applicant.zip}</div></div>
          </div>
        </div>

        {/* Academic Information */}
        <div className="mb-10">
          <div className="font-bold text-lg mb-4">Academic Information</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-2 border-t border-gray-200 pt-4">
            <div><span className="font-medium">High School</span><div>{applicant.highSchool}</div></div>
            <div><span className="font-medium">GPA</span><div>{applicant.gpa}</div></div>
            <div><span className="font-medium">SAT Score</span><div>{applicant.sat}</div></div>
            <div><span className="font-medium">Intended Major</span><div>{applicant.major}</div></div>
            <div><span className="font-medium">Application Status</span><div>{applicant.status}</div></div>
            <div><span className="font-medium">Decision</span><div>{applicant.decision}</div></div>
          </div>
        </div>

        {/* Admin Controls */}
        <div className="mb-10">
          <div className="font-bold text-lg mb-4">Admin Controls</div>
          <div className="flex gap-4 mb-4">
            <button className="bg-gray-100 text-gray-800 rounded-md px-5 py-2 font-semibold shadow hover:bg-gray-200 transition">Reset Password</button>
            <button className="bg-gray-100 text-gray-800 rounded-md px-5 py-2 font-semibold shadow hover:bg-gray-200 transition">Suspend Account</button>
          </div>
          <button className="bg-blue-400 text-white rounded-md px-8 py-2 font-semibold shadow hover:bg-blue-500 transition">Save Changes</button>
        </div>
      </div>
    </div>
  );
} 