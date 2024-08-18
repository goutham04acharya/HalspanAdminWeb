import React, { useState } from 'react';

const RadioButtonGroup = ({ values, name, onChange }) => {
    const [selectedValue, setSelectedValue] = useState(values[0]);

    // Handle radio button change
    const handleChange = (event) => {
        const newValue = event.target.value;
        console.log(newValue);
    };

    return (
        <div className="space-y-2">
            {values.map((value, index) => (
                <div key={index} className="relative custom-radioBlue py-2">
                    <input
                        id={`radio-${index}`}
                        type="radio"
                        name={name}
                        value={value}
                        onChange={handleChange}
                        checked={selectedValue === value}
                        className="hidden"
                    />
                    <label
                        htmlFor={`radio-${index}`}
                        className="flex items-center cursor-pointer relative pl-6 text-neutral-primary text-[16px] leading-[20px] font-normal"
                    >
                        {value}
                    </label>
                </div>
            ))}
        </div>
    );
};

export default RadioButtonGroup;
