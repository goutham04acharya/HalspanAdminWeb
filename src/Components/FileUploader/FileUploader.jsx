import React, { useState } from 'react';
import { findSectionAndPageName } from '../../CommonMethods/SectionPageFinder';

const FileUploader = ({ fileType, fileSize, min, max, setValidationErrors, handleChange, handleRemove, setFileState, fileState, setConditionalValues, sections, question }) => {
    const [files, setFiles] = useState(fileState.files || []);
    const [error, setError] = useState('');

    const handleFileChange = (e) => {
        const uploadedFiles = e.target.files;

        if (uploadedFiles.length > 0) {
            const allowedTypes = (fileType ? fileType.split(',').map((type) => type.trim().toLowerCase()) : []);
            const maxSizeInBytes = fileSize * 1024 * 1024;

            const newFiles = [...files];
            console.log(newFiles, ' aeeaeaaee')

            for (let i = 0; i < uploadedFiles.length; i++) {
                const file = uploadedFiles[i];
                const fileExtension = file.name.split('.').pop().toLowerCase();

                if (allowedTypes.length > 0 && !allowedTypes.includes(fileExtension)) {
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
                setValidationErrors((prevErrors) => ({
                    ...prevErrors,
                    preview_filefield: '', // Or remove the key if you prefer     
                }));
            }
            setFiles(newFiles);
        }
        handleChange(e);
    };


    const handleRemoveFile = (index) => {
        const newFiles = [...files];
        newFiles.splice(index, 1);

        setFiles(newFiles);

        setFileState((prevState) => ({
            ...prevState,
            files: newFiles,
        }));

        handleRemove(index); 
    };


    return (
        <div className=' w-full '>
            <label className="custom-file-label custom-file-input-wrapper w-fit h-auto mt-1 flex items-center bg-[#DFE0E2] border border-[#AEB3B7] p-0 rounded-md">
                <input
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    accept={fileType ? fileType : '*'}
                    className={`hidden-input ${files.length >= max && files.length > 0 ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                    disabled={files.length >= max && files.length > 0}
                />
                <span className={` text-[12px] my-2 items-center justify-center flex px-3 ${files.length >= max && files.length > 0 ? 'disabled' : ''}`}>
                    <img src="/Images/add-media.svg" alt="" className="mx-2" /> Add File ({max})
                </span>
            </label>
            {error && <p className='text-red-500 text-sm'>{error}</p>}
            {files.length > 0 && (
                <ul>
                    {files.map((file, index) => (
                        <li key={index} className='bg-[#DFE0E2] my-2 p-2 rounded flex justify-between'>
                            <span className='truncate w-[190px]'>{file.name}</span>
                            <div className=' flex gap-2'>
                                <span className='text-[#2B333B]'>
                                    {file.size < 1024 * 1024
                                        ? `${(file.size / 1024).toFixed(2)} KB`
                                        : `${(file.size / 1024 / 1024).toFixed(2)} MB`}
                                </span>
                                <button className='text-red-500 hover:text-red-700' onClick={() => handleRemoveFile(index)}>
                                    <img src="/Images/close.svg" alt="" className="w-5 h-5" />
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default FileUploader;
