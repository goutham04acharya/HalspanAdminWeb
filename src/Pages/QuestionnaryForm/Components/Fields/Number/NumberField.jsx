import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { handleRangeSlider } from '../RangeSliderDataSlice';


function NumberField({
    type,
    textId,
    value,
    className,
    handleChange,
    fieldSettingParameters,

}) {
    const dispatch = useDispatch();
    // Safely access rangeData from the Redux store, ensuring it exists
    const rangeData = useSelector((state) => state.rangeData || {});

    // Fallback to default values if rangeData is not yet available
    const startValue = rangeData.startValue ?? 0;
    const endValue = rangeData.endValue ?? 100;

    // Use Redux value as initial state for RangeValue
    const [RangeValue, setRangeValue] = useState(value ?? endValue);
    const [incrementByValue, setIncrementByValue] = useState(fieldSettingParameters?.incrementby ?? 1);


    // Sync RangeValue with the value prop or Redux state when they change
    useEffect(() => {
        if (value !== undefined && value !== RangeValue) {
            setRangeValue(value);
        }
    }, [value]);

    useEffect(() => {
        if (endValue !== undefined && endValue !== RangeValue) {
            setRangeValue(endValue);
        }
    }, [endValue]);

    // Handle range slider change
    const handleRange = (event) => {
        const newValue = parseInt(event.target.value, 10);
        const nearestMultiple = Math.floor(newValue / incrementByValue) * incrementByValue;
        setRangeValue(nearestMultiple);

        // Dispatch the change to Redux store
        dispatch(handleRangeSlider({ endValue: nearestMultiple }));

        // Trigger the handleChange if passed as a prop
        if (handleChange) {
            handleChange({ ...fieldSettingParameters, value: nearestMultiple });
        }
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
                <div className='w-[30%]'>
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={RangeValue}
                        onChange={handleRange}
                        className='mt-6'
                    />
                    <p className='font-normal text-sm text-[#2B333B] italic mt-4'>Select Value: {RangeValue}</p>
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