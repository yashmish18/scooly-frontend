import React from 'react';
import FloatingInput from '../ui/FloatingInput';

export default function PersonalInfoStep({ formData, updateFormData }) {
  const handleChange = (field, value) => {
    updateFormData({ [field]: value });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-accent mb-6">Personal Information</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FloatingInput
          label="First Name"
          id="firstName"
          value={formData.firstName || ''}
          onChange={(e) => handleChange('firstName', e.target.value)}
          required
        />
        
        <FloatingInput
          label="Last Name"
          id="lastName"
          value={formData.lastName || ''}
          onChange={(e) => handleChange('lastName', e.target.value)}
          required
        />
        
        <FloatingInput
          label="Email"
          id="email"
          type="email"
          value={formData.email || ''}
          onChange={(e) => handleChange('email', e.target.value)}
          required
        />
        
        <FloatingInput
          label="Phone"
          id="phone"
          type="tel"
          value={formData.phone || ''}
          onChange={(e) => handleChange('phone', e.target.value)}
        />
        
        <FloatingInput
          label="Date of Birth"
          id="dateOfBirth"
          type="date"
          value={formData.dateOfBirth || ''}
          onChange={(e) => handleChange('dateOfBirth', e.target.value)}
        />
        
        <div className="relative my-4">
          <select
            id="gender"
            value={formData.gender || ''}
            onChange={(e) => handleChange('gender', e.target.value)}
            className="block w-full px-4 py-3 bg-white border border-pastelBlue rounded-xl focus:outline-none focus:ring-2 focus:ring-accent"
          >
            <option value="">Select Gender</option>
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
            <option value="OTHER">Other</option>
            <option value="PREFER_NOT_TO_SAY">Prefer not to say</option>
          </select>
        </div>
      </div>
      
      <div className="space-y-4">
        <FloatingInput
          label="Address"
          id="address"
          value={formData.address || ''}
          onChange={(e) => handleChange('address', e.target.value)}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FloatingInput
            label="City"
            id="city"
            value={formData.city || ''}
            onChange={(e) => handleChange('city', e.target.value)}
          />
          
          <FloatingInput
            label="State"
            id="state"
            value={formData.state || ''}
            onChange={(e) => handleChange('state', e.target.value)}
          />
          
          <FloatingInput
            label="Postal Code"
            id="postalCode"
            value={formData.postalCode || ''}
            onChange={(e) => handleChange('postalCode', e.target.value)}
          />
        </div>
      </div>
    </div>
  );
} 