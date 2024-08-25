import React, { useState } from 'react';

const RadioButtonGroup = ({ values, name, onChange, testId }) => {
    const [selectedValue, setSelectedValue] = useState(values[0]);

    // Handle radio button change
    const handleChange = (event) => {
        const newValue = event.target.value;
    };

    return (
        <div className="space-y-2">
            {values.map((value, index) => (
                <div key={index} className="relative custom-radioBlue py-2">
                    <input
                        data-testid={`${testId}-choice-${index}`}
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
                        data-testid={`${testId}-choice-${index + 1}`}
                        className="h-5 flex items-center cursor-pointer relative pl-6 text-neutral-primary text-[16px] leading-[20px] font-normal"
                    >
                        {value}
                    </label>
                </div>
            ))}
        </div>
    );
};

export default RadioButtonGroup;
