import { useState } from "react";
import { FileUpload } from "../../components/file_upload";
import { StepsHeader } from "../../components/steps_header";
import { Steps } from "../../components/steps";

const initialStepsState = [
  {
    id: 1,
    name: "Initial Setup and Listing Preparation",
    options: [
      { index: 0, value: "1-1", label: "Notify FSH of intent to sell", checked: false },
      {
        index: 1,
        value: "1-1",
        label: "Provide FSH with a photo for the website",
        checked: false,
      },
      {
        index: 2,
        value: "1-2",
        label: "Enter sale listing in FSH website",
        checked: false,
      },
      { index: 3, value: "1-3", label: "Approve sale listing on FSH", checked: false },
    ],
  },
];

export default function SellerWorkflow({ initialStep = 1, initialOption = 0 }) {
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
  const onSubmit = (event)=>{
    event.preventDefault();
  }
  
  return (
    <Steps
      title={"Listings / Create"}
      steps={steps}
      mobileFiltersOpen={mobileFiltersOpen}
      setMobileFiltersOpen={setMobileFiltersOpen}
      isDisclosureDisabled={isDisclosureDisabled}
      currentStep={currentStep}
    >
      <div className="mt-4">
        <StepsHeader
          title={step.options[currentOption].label}
          progress={(currentOption / step.options.length) * 100}
          nextTitle={currentOption < step.options.length - 1 ? "Next" : "Save"}
          onClickNext={() => {
            if (currentOption < step.options.length - 1) {
              setCurrentOption(currentOption + 1);
            } else {
              alert("submit");
            }
          }}
          onClickPrev={() => {
            if (currentOption > 0) {
              setCurrentOption(currentOption - 1);
            } else {
              alert("First");
            }
          }}
          isPrevDisabled={isPrevDisabled()}
          isNextDisabled={isNextDisabled()}
        />
        <form onSubmit={onSubmit}>
          {["data"].map((e) => {
            if (step.options[currentOption].index === 0) {
              return (
                <div>
                  <div class="sm:col-span-3 m-2">
                    <label for="first-name" class="block text-lg text-white font-medium text-gray-900">
                      Title
                    </label>
                    <div class="mt-2">
                      <input
                        type="text"
                        required
                        name="first-name"
                        id="first-name"
                        autocomplete="given-name"
                        class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                      />
                    </div>
                  </div>

                  <div class="col-span-full m-2">
                    <label for="about" class="block text-lg text-white font-medium text-gray-900">
                      About
                    </label>
                    <div class="mt-2">
                      <textarea
                        name="about"
                        required
                        id="about"
                        rows="3"
                        class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                      ></textarea>
                    </div>
                    <p class="mt-3 text-sm/6 text-white">Write a few sentences about your property.</p>
                  </div>
                </div>
              );
            }
            if (step.options[currentOption].index === 1) {
              return (
                <div className="text-white">
                  <FileUpload key={step.options[currentOption].value} />
                </div>
              );
            }
            if (step.options[currentOption].index === 2) {
              return <div> 
                <div class="sm:col-span-3 m-2">
                    <label for="first-name" class="block text-lg text-white font-medium text-gray-900">
                      Address
                    </label>
                    <div class="mt-2">
                      <input
                        type="text"
                        required
                        name="first-name"
                        id="first-name"
                        autocomplete="given-name"
                        class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                      />
                    </div>
                  </div>
                  <div class="sm:col-span-3 m-2">
                    <label for="first-name" class="block text-lg text-white font-medium text-gray-900">
                      Price
                    </label>
                    <div class="mt-2">
                      <input
                        type="text"
                        required
                        name="first-name"
                        id="first-name"
                        autocomplete="given-name"
                        class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                      />
                    </div>
                  </div>
              </div>;
            }
            if (step.options[currentOption].index === 3) {
              return <div> 4</div>;
            }
            <div> default</div>;
          })}
        </form>
      </div>
    </Steps>
  );
}
