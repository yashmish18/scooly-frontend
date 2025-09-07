import React from 'react';
import classNames from 'classnames';

export default function StepIndicator({ currentStep, totalSteps, steps }) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={index} className="flex items-center">
            <div
              className={classNames(
                'w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all',
                {
                  'bg-accent text-white': index <= currentStep,
                  'bg-pastelBlue text-accent': index > currentStep,
                }
              )}
            >
              {index + 1}
            </div>
            <div className="ml-3">
              <div className="font-semibold text-accent">{step.title}</div>
              <div className="text-sm text-gray-500">{step.description}</div>
            </div>
            {index < totalSteps - 1 && (
              <div
                className={classNames(
                  'w-16 h-1 mx-4 transition-all',
                  {
                    'bg-accent': index < currentStep,
                    'bg-pastelBlue': index >= currentStep,
                  }
                )}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
} 