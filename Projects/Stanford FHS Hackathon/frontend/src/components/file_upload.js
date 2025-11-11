import { PhotoIcon } from "@heroicons/react/20/solid";

export function FileUpload({ file, onFileUploaded }) {
  const handleFileChange = (e) => {
    const uploadedFile = e.target.files[0];
    if (onFileUploaded) {
      onFileUploaded(uploadedFile);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const uploadedFile = e.dataTransfer.files[0];
    if (onFileUploaded) {
      onFileUploaded(uploadedFile);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div className="col-span-full m-2">
      <label htmlFor="cover-photo" className="block text-white text-sm/6 font-medium text-gray-900">
        Property Photo
      </label>
      <div
        className="mt-2 flex justify-center bg-white rounded-lg border border-dashed border-gray-900/25 px-6 py-10"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragEnter={handleDragOver}
      >
        <div className="text-center">
          <PhotoIcon aria-hidden="true" className="mx-auto size-12 text-gray-300" />
          <div className="mt-4 flex text-sm/6 text-gray-600">
            <label
              htmlFor="document"
              className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 
                         focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 
                         focus-within:ring-offset-2 hover:text-indigo-500"
            >
              <span>Upload a file</span>
              <input
                id="document"
                name="document"
                type="file"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>
            <p className="pl-1">or drag and drop</p>
          </div>
          <p className="text-xs/5 text-gray-600">PNG, JPG, GIF up to 10MB</p>
        </div>
      </div>

      {file && (
        <div className="mt-4 text-sm text-white">
          <p>Uploaded file: {file.name}</p>
        </div>
      )}
    </div>
  );
}