import React, { useState } from 'react';

const FileUploader = ({ fileType, fileSize, min, max }) => {
    const [files, setFiles] = useState([]);
    const [error, setError] = useState('');

    const handleFileChange = (e) => {
        const uploadedFiles = e.target.files;

        if (uploadedFiles.length > 0) {
            const allowedTypes = fileType.split(',').map((type) => type.trim().toLowerCase());
            const maxSizeInBytes = fileSize * 1024 * 1024;

            const newFiles = [...files];
            for (let i = 0; i < uploadedFiles.length; i++) {
                const file = uploadedFiles[i];
                const fileExtension = file.name.split('.').pop().toLowerCase();

                if (!allowedTypes.includes(fileExtension)) {
                    setError(`Invalid file type. Allowed types: ${allowedTypes.join(', ')}`);
                    return;
                }

                if (file.size > maxSizeInBytes) {
                    setError(`File size exceeds ${fileSize}MB limit`);
                    return;
                }

                newFiles.push(file);
            }

            if (newFiles.length < min) {
                setError(`Minimum ${min} files required`);
            } else if (newFiles.length > max) {
                setError(`Maximum ${max} files allowed`);
            } else {
                setError('');
            }

            setFiles(newFiles);
        }
    };

    return (
        <div className=' w-full '>
            <label className="custom-file-label custom-file-input-wrapper w-fit h-auto mt-1 flex items-center bg-[#DFE0E2] border border-[#AEB3B7] p-0 rounded-md">
                <input
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    accept={fileType}
                    className={`hidden-input ${files.length >= max ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                    disabled={files.length >= max}
                />
                <span className={` text-[12px] my-2 items-center justify-center flex px-3 ${files.length >= max ? 'disabled' : ''}`}>
                    <img src="/Images/add-media.svg" alt="" className="mx-2" /> Add File ({max})
                </span>
            </label>
            {error && <p className='text-red-500 text-sm'>{error}</p>}
            {files.length > 0 && (
                <ul>
                    {files.map((file, index) => (
                        <li key={index} className='bg-[#DFE0E2] my-2 p-2 rounded '>{file.name}</li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default FileUploader;
