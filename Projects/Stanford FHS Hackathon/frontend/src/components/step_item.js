import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import { MinusIcon, PlusIcon } from "@heroicons/react/24/outline";

export function StepItem({ step, isDisabled, isOpen, stepClass, updateOptionCheckedStatus }) {
  return (
    <Disclosure
      key={step.id}
      as="div"
      className={`border-b border-gray-200 pointer ${stepClass} py-6 ${
        isDisabled && "pointer-events-none"
      }`}
      defaultOpen={isOpen}
    >
      <h3 className="-my-3 flow-root">
        <DisclosureButton className="group flex w-full items-center justify-between py-3 text-sm text-white hover:text-white">
          <span className="font-medium text-left text-white">{step.name}</span>
          <span className="ml-6 flex items-center">
            <PlusIcon aria-hidden="true" className="size-5 group-data-[open]:hidden" />
            <MinusIcon
              aria-hidden="true"
              className="size-5 [.group:not([data-open])_&]:hidden"
            />
          </span>
        </DisclosureButton>
      </h3>
      <DisclosurePanel className="pt-6">
        <div className="space-y-4">
          {step.options.map((option, optionIdx) => (
            <div key={option.value} className="flex gap-3">
              <div className="flex h-5 shrink-0 items-center">
                <div className="group grid size-4 grid-cols-1">
                  <input
                    value={option.value}
                    checked={option.checked} // Use checked instead of defaultChecked
                    onChange={(e) =>
                      updateOptionCheckedStatus(step.id, optionIdx, e.target.checked)
                    }
                    id={`filter-${step.id}-${optionIdx}`}
                    name={`${step.id}[]`}
                    type="checkbox"
                    className="col-start-1 row-start-1 appearance-none rounded border border-gray-300 bg-white checked:border-indigo-600 checked:bg-indigo-600 indeterminate:border-indigo-600 indeterminate:bg-indigo-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:checked:bg-gray-100 forced-colors:appearance-auto"
                  />
                  <svg
                    fill="none"
                    viewBox="0 0 14 14"
                    className="pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-white group-has-[:disabled]:stroke-gray-950/25"
                  >
                    <path
                      d="M3 8L6 11L11 3.5"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="opacity-0 group-has-[:checked]:opacity-100"
                    />
                    <path
                      d="M3 7H11"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="opacity-0 group-has-[:indeterminate]:opacity-100"
                    />
                  </svg>
                </div>
              </div>
              <label htmlFor={`filter-${step.id}-${optionIdx}`} className="text-sm text-white">
                {option.label}
              </label>
            </div>
          ))}
        </div>
      </DisclosurePanel>
    </Disclosure>
  );
}