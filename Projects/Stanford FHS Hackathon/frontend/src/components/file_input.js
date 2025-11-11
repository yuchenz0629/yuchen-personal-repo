import React from 'react';

const FileInput = () => {
  return (
    <div className="m-2 grid w-full max-w-xs items-center gap-1.5">
      <label className="text-sm text-white font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Picture</label>
      <input id="photo" type="file" name='photo' className="flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm text-gray-400 file:border-0 file:bg-transparent file:text-gray-600 file:text-sm file:font-medium" />
    </div>
  );
}

export default FileInput;
