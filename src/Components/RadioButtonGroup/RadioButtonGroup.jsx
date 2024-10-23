import React, { useState } from 'react';

const RadioButtonGroup = ({ values, name, onChange, testId, preview, question }) => {
    const [selectedValue, setSelectedValue] = useState(values[0]);
    // console.log(values[0],'assaasasasassssssssssssssssssssssssssssssssssssssssssss')
    const handleChange = (event) => {

        console.log(event, 'event')
        const newValue = event.target.value;
        setSelectedValue(event.target.value);
        console.log(newValue, 'new value')
        // onChange(newValue)
    };
    console.log(selectedValue,'ddsdsdsdsdsds')


    return (
        <div className="space-y-2 mt-4">
            {values.map((value, index) => (
                <div key={index} className="relative custom-radioBlue py-2">
                    <input
                        data-testid={`${testId}-choice-${index}`}
                        id={`radio-${index}`}
                        type="radio"
                        name={'name'}
                        value={value}
                        onChange={(event)=>handleChange(event)}
                        checked // Ensure checked is correctly tied to selectedValue
                        className="hidden"
                        // maxLength={100}
                    />
                    <label
                        htmlFor={`radio-${index}`}
                        data-testid={`${testId}-choice-${index + 1}`}
                        maxLength={50}
                        
                        className="h-5 flex items-center cursor-pointer relative pl-6 text-neutral-primary text-[16px] leading-[20px] font-normal break-words flex-wrap overflow-hidden"
                    >
                        {value}
                    </label>
                </div>
            ))}
        </div>
    );
};

export default RadioButtonGroup;
