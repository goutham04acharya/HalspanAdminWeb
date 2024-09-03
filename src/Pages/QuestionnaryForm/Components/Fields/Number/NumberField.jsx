import React, { useEffect, useState } from 'react'
import RangeSlider from './Components/RangeSlider'

function NumberField({
    type,
    textId,
    value,
    className,
    handleChange,
    fieldSettingParameters,

}) {

    const [RangeValue, setRangeValue] = useState(value ?? 0);

    // Sync RangeValue with the value prop when it changes, with a check for undefined
    useEffect(() => {
        if (value !== undefined && value !== RangeValue) {
            setRangeValue(value);
        }
    }, [value]);

    const handleRange = (event) => {
        const newValue = event.target.value;
        setRangeValue(newValue);
        handleChange({ ...fieldSettingParameters, value: newValue });
    };

    console.log(RangeValue, 'RangeValue'); // This should now print the correct value


    return (
        <div>
            <label
                data-testid="label-name"
                htmlFor={textId}
                title={fieldSettingParameters?.label}
                maxLength={100}
                className={`font-medium text-base text-[#000000] overflow-hidden break-all block w-full max-w-[85%]  ${fieldSettingParameters?.label === '' ? 'h-[20px]' : 'h-auto'}`}>
                {fieldSettingParameters?.label}
            </label>
            {((fieldSettingParameters?.source === 'entryfield') || (fieldSettingParameters?.source === 'both')) &&
                <input
                    data-testid='input'
                    type={type}
                    id={textId}
                    value={value}
                    className={`w-full h-auto break-words border border-[#AEB3B7] rounded-lg bg-white py-3 px-4 mt-5 outline-0 font-normal text-base text-[#2B333B] placeholder:text-base placeholder:font-base placeholder:text-[#9FACB9] ${className}`}
                    placeholder={fieldSettingParameters?.placeholderContent}
                    onClick={() => handleChange(fieldSettingParameters)}
                />
            }
            {((fieldSettingParameters?.source === 'slider') || (fieldSettingParameters?.source === 'both')) &&
                <div>
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={RangeValue}
                        onChange={handleRange}
                    />
                    <p>Select Value: {RangeValue}</p>
                </div>
            }
            <p
                data-testid="help-text"
                className='italic mt-2 font-normal text-sm text-[#2B333B] break-words max-w-[90%]'
                title={fieldSettingParameters?.helptext}
            >
                {fieldSettingParameters?.helptext}</p>
        </div>
    )
}

export default NumberField