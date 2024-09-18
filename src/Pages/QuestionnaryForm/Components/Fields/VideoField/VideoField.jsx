import React, { useState } from 'react'

function VideoField({ label,
    type,
    textId,
    HelpText,
    value,
    className,
    handleChange,
    fieldSettingParameters,
    testId

}) {

    const [fileName, setFileName] = useState('');

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setFileName(file ? file.name : '');
        handleChange(fieldSettingParameters);
    };

    return (
        <div>
            <label
                data-testid="label-name"
                htmlFor={textId}
                maxLength={100}
                title={fieldSettingParameters?.label}
                className={`font-medium text-base text-[#000000] overflow-hidden break-all  break-words block w-full max-w-[85%]  ${fieldSettingParameters?.label === '' ? 'h-[20px]' : 'h-auto'}`}>
                {fieldSettingParameters?.label}
            </label>
            <div className="custom-file-input-wrapper w-full h-auto mt-5 flex items-center bg-white border border-[#AEB3B7] p-2 rounded-lg">
                <label
                    htmlFor={textId}
                    className={`custom-file-label flex-1 py-3 px-4 bg-[#DFE0E2] rounded max-w-[30%] outline-0 font-semibold text-base text-[#505B66] cursor-pointer ${className}`}
                >
                    {fileName ? `Upload Video (${fileName})` : `${`Upload Video (${fieldSettingParameters?.max || '3'})`}`}

                </label>
                <input
                    data-testid="input"
                    type="file"
                    id={textId}
                    className="hidden-input"
                    onChange={handleFileChange}
                />
                <span className="placeholder ml-5 text-base font-normal text-[#9FACB9]">
                    {fileName || fieldSettingParameters?.placeholderContent || 'No file chosen'}
                </span>
            </div>
            <p
                data-testid="help-text"
                className='italic mt-2 font-normal text-sm text-[#2B333B] break-words max-w-[90%]'
                title={fieldSettingParameters?.helptext}
            >
                {fieldSettingParameters?.helptext}</p>
        </div>
    )
}

export default VideoField