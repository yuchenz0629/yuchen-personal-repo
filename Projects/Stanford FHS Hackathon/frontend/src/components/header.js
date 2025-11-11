import { Bars4Icon } from "@heroicons/react/20/solid";

export function Header({ title, onClickMenu }) {
  return (
    <div className="flex items-baseline justify-between border-b border-gray-200 pb-6 pt-24">
      <h1 className="text-4xl font-bold tracking-tight text-white">
        {title}
      </h1>

      <div className="flex items-center">
        <button
          type="button"
          onClick={onClickMenu}
          className="-m-2 ml-4 p-2 text-white hover:text-white sm:ml-6 lg:hidden"
        >
          <span className="sr-only">Menu</span>
          <Bars4Icon aria-hidden="true" className="size-5" />
        </button>
      </div>
    </div>
  );
}
