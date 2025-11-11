export function SecondaryBtn({title, disabled, onClick}) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      type="button"
      data-autofocus
      className={`mt-3 inline-flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold  sm:mt-0 sm:w-auto shadow-sm ring-1 ring-inset ring-gray-300 ${
        disabled ? "cursor-not-allowed text-black bg-[#f6f6f6]" : "bg-white text-gray-900  hover:bg-gray-50"
      }`}
    >
      {title}
    </button>
  );
}
