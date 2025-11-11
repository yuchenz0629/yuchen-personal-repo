import React, { useState } from "react";
import { Steps } from "../../components/steps";
import { StepsHeader } from "../../components/steps_header";
import { FileUpload } from "../../components/file_upload";

const initialStepsState = [
    {
        id: 1,
        name: "Initial Setup and Document Preparation",
        options: [
            { 
                value: "1-1", 
                label: "Approve sale listing on FSH website", 
                checked: false 
            },
            {
                value: "1-2",
                label: "Gather seller disclosure documents and provide access",
                checked: false,
            },
            {
                value: "1-3",
                label: "Open Escrow and provide Escrow number to seller",
                checked: false,
            },
            {
                value: "1-4",
                label: "Gather Natural Hazard Report",
                checked: false,
            },
            {
                value: "1-5",
                label: "Mark sale on listing website as 'In Escrow'",
                checked: false,
            },
        ],
    },
    {
        id: 2,
        name: "Purchase Process",
        options : [
            { 
                value: "2-1", 
                label: "Provide buyer with access to seller's disclosures", 
                checked: false 
            },
            { 
                value: "2-2", 
                label: "Order fee simple appraisal report for buyer property tax disclosure", 
                checked: false 
            },
            { 
                value: "2-3", 
                label: "Order leasehold value appraisal report for buyer loan value to purchase price", 
                checked: false 
            },
            { 
                value: "2-4", 
                label: "File seller's terminate report and share with buyer", 
                checked: false 
            },
            { 
                value: "2-5", 
                label: "Prepare disclosure statements in Docusign", 
                checked: false 
            },
            { 
                value: "2-6", 
                label: "Route disclosure statements to seller and buyer", 
                checked: false 
            },
        ]
    },
    {
        id: 3,
        name: "Finalizing procedures",
        options : [
            { 
                value: "3-1", 
                label: "Sign buyer's title document", 
                checked: false 
            },
            { 
                value: "3-2", 
                label: "Transfer buyer loan fund to title company", 
                checked: false 
            },
            { 
                value: "3-3", 
                label: "Close sale listing on website and update sale statistics", 
                checked: false 
            },
        ]
    }
]

export default function FshWorkflow({ initialStep = 1, initialOption = 0 }) {

    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
    const [currentStep, setCurrentStep] = useState(initialStep);
    const [currentOption, setCurrentOption] = useState(initialOption);
    const [steps, setSteps] = useState(initialStepsState);

    const isDisclosureDisabled = (disclosureStepId) => {
        return disclosureStepId >= currentStep;
    };
    const isNextDisabled = () => {
        return false;
    };
    const isPrevDisabled = () => {
        return currentOption === 0;
    };
    const step = steps.find((step) => step.id === currentStep);
    const updateOptionCheckedStatus = (stepId, optionIndex, checked) => {
        setSteps((prevSteps) =>
        prevSteps.map((s) => {
            if (s.id === stepId) {
            return {
                ...s,
                options: s.options.map((o, index) => {
                if (index === optionIndex) {
                    return { ...o, checked };
                }
                return o;
                }),
            };
            }
            return s;
        })
        );
    };

    return (
        <Steps
          title={"FSH Workflow"}
          steps={steps}
          mobileFiltersOpen={mobileFiltersOpen}
          setMobileFiltersOpen={setMobileFiltersOpen}
          isDisclosureDisabled={isDisclosureDisabled}
          currentStep={currentStep}
          updateOptionCheckedStatus={updateOptionCheckedStatus}
        >
          <div className="mt-4">
            <StepsHeader
              title={step.options[currentOption].label}
              progress={((currentOption + 1) / step.options.length) * 100}
              nextTitle={currentOption < step.options.length - 1 ? "Next" : "Save"}
              onClickNext={() => {
                updateOptionCheckedStatus(currentStep, currentOption, true);
    
                if (currentOption < step.options.length - 1) {
                  setCurrentOption(currentOption + 1);
                } else {
                  if (currentStep < steps.length) {
                    setCurrentStep(currentStep + 1);
                    setCurrentOption(0);
                  } else {
                    alert("All steps in the workflow are completed.");
                  }
                }
              }}
              onClickPrev={() => {
                if (currentOption > 0) {
                  updateOptionCheckedStatus(currentStep, currentOption - 1, false);
                  setCurrentOption(currentOption - 1);
                } else if (currentStep > 1) {
                  const previousStep = steps.find((s) => s.id === currentStep - 1);
                  setCurrentStep(currentStep - 1);
                  setCurrentOption(previousStep.options.length - 1);
                  updateOptionCheckedStatus(currentStep - 1, previousStep.options.length - 1, false);
                } else {
                  alert("This is the first step.");
                }
              }}
              isPrevDisabled={isPrevDisabled()}
              isNextDisabled={isNextDisabled()}
            />
            <FileUpload />
          </div>
        </Steps>
      );
}