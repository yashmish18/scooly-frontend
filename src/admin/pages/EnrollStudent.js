import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StepIndicator from '../../components/forms/StepIndicator';
import PersonalInfoStep from '../../components/forms/PersonalInfoStep';
import AcademicDetailsStep from '../../components/forms/AcademicDetailsStep';
import ReviewStep from '../../components/forms/ReviewStep';
import PrimaryButton from '../../components/ui/PrimaryButton';
import { useFormStep } from '../../hooks/useFormStep';
import { useToast } from '../../components/ui/ToastProvider';
import api from '../../utils/api';

const steps = [
  { title: 'Personal Info', description: 'Basic details' },
  { title: 'Academic Details', description: 'Course & batch' },
  { title: 'Review', description: 'Confirm & submit' }
];

export default function EnrollStudent() {
  const navigate = useNavigate();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  
  const {
    currentStep,
    formData,
    nextStep,
    prevStep,
    updateFormData,
    isFirstStep,
    isLastStep,
    totalSteps
  } = useFormStep(3);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await api.post('/students', formData);
      toast.success('Student enrolled successfully!');
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to enroll student');
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <PersonalInfoStep formData={formData} updateFormData={updateFormData} />;
      case 1:
        return <AcademicDetailsStep formData={formData} updateFormData={updateFormData} />;
      case 2:
        return <ReviewStep formData={formData} onSubmit={handleSubmit} loading={loading} />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-2xl font-bold mb-6">Enroll Student</div>
      
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <StepIndicator
          currentStep={currentStep}
          totalSteps={totalSteps}
          steps={steps}
        />
        
        <div className="mb-8">
          {renderStep()}
        </div>
        
        {!isLastStep && (
          <div className="flex justify-between">
            <PrimaryButton
              onClick={prevStep}
              disabled={isFirstStep}
              className={isFirstStep ? 'opacity-50 cursor-not-allowed' : ''}
            >
              Previous
            </PrimaryButton>
            
            <PrimaryButton onClick={nextStep}>
              Next
            </PrimaryButton>
          </div>
        )}
      </div>
    </div>
  );
} 