import React, { useState } from 'react';

const CustomCheckboxGroup = ({ values, onChange }) => {
    // Initialize with the first value selected by default
    const [selectedValues, setSelectedValues] = useState([]);
    const handleCheckboxChange = (value) => {
        setSelectedValues(prev => {
            if (prev.includes(value)) {
                return prev.filter(item => item !== value);
            } else {
                return [...prev, value];
            }
        });
        if(selectedValues){
            onChange(value)
        }
    };

    return (
        <div className="space-y-4 mt-4">
            {values.map((value, index) => (
                <label
                    key={index}
                    className="flex items-center cursor-pointer group space-x-2"
                >
                    <div className="relative flex items-center">
                        <input
                            type="checkbox"
                            checked={selectedValues.includes(value)}
                            onChange={() => handleCheckboxChange(value)}
                            className="absolute w-0 h-0 opacity-0"
                        />
                        <div className={`w-5 h-5 border-2 border-[#2B333B] transition-colors`}>
                            {selectedValues.includes(value) && (
                                <svg
                                    className="w-full h-full text-white bg-[#2B333B]"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <polyline points="20 6 9 17 4 12" />
                                </svg>
                            )}
                        </div>
                    </div>
                    <span data-testid={`choices-${index}`} className="text-sm text-gray-700">{value}</span>
                </label>
            ))}
        </div>
    );
};

export default CustomCheckboxGroup;