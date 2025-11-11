import React from 'react';

const Loader = () => {
  return (
    <div className='flex items-center justify-center m-1'>
        <div className="flex flex-row gap-1">
        <div className="w-4 h-4 rounded-full bg-white animate-bounce [animation-delay:.7s]" />
        <div className="w-4 h-4 rounded-full bg-white animate-bounce [animation-delay:.3s]" />
        <div className="w-4 h-4 rounded-full bg-white animate-bounce [animation-delay:.7s]" />
        </div>
    </div>
    
  );
}

export default Loader;
