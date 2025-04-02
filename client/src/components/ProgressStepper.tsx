import { Step } from "@/lib/types";

interface ProgressStepperProps {
  steps: Step[];
  currentStep: number;
}

export function ProgressStepper({ steps, currentStep }: ProgressStepperProps) {
  return (
    <>
      {/* Desktop Progress Stepper */}
      <div className="mb-8 hidden md:block">
        <div className="flex justify-between items-center max-w-3xl mx-auto">
          {steps.map((step, index) => (
            <div key={step.id} className="flex flex-col items-center">
              <div 
                className={`rounded-full w-8 h-8 flex items-center justify-center mb-2 font-semibold
                  ${currentStep === index 
                    ? 'bg-primary text-white'
                    : index < currentStep
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
              >
                {step.id}
              </div>
              <span 
                className={`text-xs font-medium
                  ${currentStep === index 
                    ? 'text-gray-700'
                    : index < currentStep
                      ? 'text-gray-700'
                      : 'text-gray-400'
                  }`}
              >
                {step.label}
              </span>
              
              {/* Connector line between steps */}
              {index < steps.length - 1 && (
                <div 
                  className={`h-0.5 w-24 mx-2 mt-4
                    ${index < currentStep ? 'bg-green-600' : 'bg-gray-200'}`}
                  style={{ 
                    position: 'absolute', 
                    left: `calc((100% / ${steps.length - 1}) * ${index} + (24px / ${steps.length}))`, 
                    width: `calc((100% / ${steps.length - 1}) - (48px / ${steps.length}))` 
                  }}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Mobile Progress Indicator */}
      <div className="flex items-center justify-between mb-6 md:hidden">
        <div>
          <h2 className="font-bold text-lg text-gray-900">Step {currentStep + 1} of {steps.length}</h2>
          <p className="text-sm text-gray-600">
            {steps[currentStep]?.label || ""}
          </p>
        </div>
        <div className="w-1/3 bg-gray-200 rounded-full h-2">
          <div 
            className="bg-primary rounded-full h-2" 
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          />
        </div>
      </div>
    </>
  );
}
