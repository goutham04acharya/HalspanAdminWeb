import React, { useState } from 'react';

const VideoUploader = ({ fileSize, min, max, setValue, question, handleChange }) => {


    const [files, setFiles] = useState([]);
    const [error, setError] = useState('');

    const handleFileChange = (e) => {
        const uploadedFiles = e.target.files;

        if (uploadedFiles.length > 0) {
            const allowedTypes = ['video/mp4', 'video/webm', 'video/ogg'];
            const maxSizeInBytes = fileSize * 1024 * 1024;

            const newFiles = [...files];
            for (let i = 0; i < uploadedFiles.length; i++) {
                const file = uploadedFiles[i];

                if (!allowedTypes.includes(file.type)) {
                    setError('Invalid file type. Only video files are allowed');
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
                setValue((prev) => ({ ...prev, [question?.question_id]: true })); // Call setValue function here  
            }

            setFiles(newFiles);
        }
        handleChange(e)
    };

    const handleRemoveFile = (index) => {
        const newFiles = [...files];
        newFiles.splice(index, 1);
        setFiles(newFiles);
        setValue((prev) => ({ ...prev, [question?.question_id]: false })); // Call setValue function here  
    };


    return (
        <div className="w-full">
            <label className="custom-file-label custom-file-input-wrapper w-fit h-auto mt-1 flex items-center bg-[#DFE0E2] border border-[#AEB3B7] p-0 rounded-md">
                <input
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    accept="video/*"
                    className={`hidden-input ${files.length >= max && files.length > 0 ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                    disabled={files.length >= max && files.length > 0}
                />
                <span className={`text-[12px] my-2 items-center justify-center flex px-3 ${files.length >= max && files.length > 0 ? 'disabled' : ''}`}>
                    <img src="/Images/add-media.svg" alt="" className="mx-2" /> Add Video ({max})
                </span>
            </label>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            {files.length > 0 && (
                <ul>
                    {files.map((file, index) => (
                        <li key={index} className="bg-[#DFE0E2] my-2 p-2 rounded flex justify-between">
                            <span className="truncate w-[170px]">{file.name}</span>
                            <div className="flex gap-2">
                                <span className="text-[#2B333B]">
                                    {file.size < 1024 * 1024
                                        ? `${(file.size / 1024).toFixed(2)} KB`
                                        : `${(file.size / 1024 / 1024).toFixed(2)} MB`}
                                </span>
                                <button className="text-red-500 hover:text-red-700" onClick={() => handleRemoveFile(index)}>
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

export default VideoUploader;
