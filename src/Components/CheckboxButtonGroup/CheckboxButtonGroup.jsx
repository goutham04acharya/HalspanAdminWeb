import React, { useState } from 'react';

const CheckboxButtonGroup = ({ values, name, onChange, testId }) => {
    const [selectedValue, setSelectedValue] = useState(values[0]);

    // Handle radio button change
    const handleChange = (event) => {
        const newValue = event.target.value;
    };

    return (
        <div className="space-y-2">
            {values.map((value, index) => (
                <div key={index} className="relative checkbox py-2 z-[9]">
                    <input
                        id={`radio-${index}`}
                        type="checkbox"
                        value={value}
                        onChange={handleChange}
                        checked={selectedValue === value}
                        className="hidden"
                        maxLength={50}
                    />
                    <label
                        htmlFor={`radio-${index}`}
                        data-testid={`${testId}-choice-${index + 1}`}
                        className="h-5 flex items-center cursor-pointer relative pl-8 text-neutral-primary text-[16px] leading-[20px] font-normal break-words overflow-auto flex-wrap truncate"
                        maxLength={50}

                    >
                        {value}
                    </label>
                </div>
            ))}
        </div>
    );
};

export default CheckboxButtonGroup;
