export function PrimaryBtn({title, disabled, onClick}) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      type="submit"
      className={`rounded-md px-3 py-2 text-sm font-semibold shadow-sm ${
        disabled
          ? "cursor-not-allowed text-black bg-[#f6f6f6]"
          : "hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 text-white bg-indigo-600"
      }`}
    >
      {title}
    </button>
  );
}
