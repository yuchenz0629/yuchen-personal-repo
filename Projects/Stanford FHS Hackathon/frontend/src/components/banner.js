import React from "react";
import ExploreButton from "./explore_button";

const Banner = ({ title, description, onClick }) => {
  return (
    <div className="cursor-pointer overflow-hidden relative transition-all duration-500 bg-neutral-300 rounded-xl shadow-sm flex flex-row  justify-evenly gap-2 p-5">
      <div>
        <img
          src="/images/seller.jpg"
          height={1200}
          width={1200}
          className="rounded-xl"
        />
      </div>
      <div className="pl-6 flex flex-col">
        <span className="font-bold text-6xl ">{title}</span>
        <p className="line-clamp-3 text-lg mt-6">{description}</p>

        <div className="mt-auto ml-auto">
          <ExploreButton title={"Sell your property"} onClick={onClick}/>
        </div>
      </div>
    </div>
  );
};

export default Banner;
