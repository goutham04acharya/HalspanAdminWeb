import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { handleSliderValue } from '../RangeSliderDataSlice';


function NumberField({
    type,
    textId,
    value,
    className,
    handleChange,
    fieldSettingParameters,
    preview

}) {
    const dispatch = useDispatch();

    // Get slider value from Redux store
    const sliderValue = useSelector((state) => state.sliderConfig.sliderValue);

    // Get increment_by value from fieldSettingParameters with a fallback to 1
    const incrementByValue = fieldSettingParameters?.incrementby || 1;

    // Get min and max values from fieldSettingParameters or use defaults
    const minRange = parseInt(fieldSettingParameters?.min) || 0;
    const maxRange = parseInt(fieldSettingParameters?.max) || 100;

    // Calculate percentage for slider fill (relative to min/max range)
    const sliderPercentage = ((sliderValue - minRange) / (maxRange - minRange)) * 100;

    // Sync the fieldSettingParameters value with slider value
    useEffect(() => {
        if (fieldSettingParameters?.value !== undefined && fieldSettingParameters.value !== sliderValue) {
            dispatch(handleSliderValue({ sliderValue: fieldSettingParameters.value }));
        }
    }, [fieldSettingParameters?.value, sliderValue, dispatch]);

    // Handle range slider changes and snap to the nearest multiple of incrementByValue
    const handleRange = (event) => {
        const newValue = parseInt(event.target.value, 10);
        // Round to the nearest multiple of incrementByValue
        let nearestMultiple = Math.round(newValue / incrementByValue) * incrementByValue;

        // Ensure the nearest multiple doesn't exceed the maxRange
        if (nearestMultiple > maxRange) {
            nearestMultiple = Math.floor(maxRange / incrementByValue) * incrementByValue;
        }

        // Ensure it doesn't go below the minRange
        if (nearestMultiple < minRange) {
            nearestMultiple = minRange;
        }

        dispatch(handleSliderValue({ sliderValue: nearestMultiple }));

        // Call the handleChange prop if provided
        if (handleChange) {
            handleChange({ ...fieldSettingParameters, value: nearestMultiple });
        }
    };

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
                    value={`${fieldSettingParameters?.preField ? fieldSettingParameters.preField : ''}${fieldSettingParameters?.postField ? ` ${fieldSettingParameters.postField}` : ''}`}
                    className={`w-full h-auto break-words border border-[#AEB3B7] rounded-lg bg-white py-3 px-4 ${preview ? 'mt-1' : 'mt-5'} outline-0 font-normal text-base text-[#2B333B] placeholder:text-base placeholder:font-base placeholder:text-[#9FACB9] ${className}`}
                    placeholder={fieldSettingParameters?.placeholderContent}
                    onChange={() => handleChange(fieldSettingParameters)}
                />
            }
            {((fieldSettingParameters?.source === 'slider') || (fieldSettingParameters?.source === 'both')) &&
                <div data-testid="slider" className=''>
                    <div className='flex items-center w-full'>
                        {fieldSettingParameters?.preField &&
                            <p className={`w-auto max-w-[20%] break-all overflow-auto ${preview ? 'mt-1' : 'mt-5'} mr-2`}>{fieldSettingParameters?.preField}</p>
                        }
                        <p className={`w-auto max-w-[10%] break-all overflow-auto ${preview ? 'mt-1' : 'mt-5'} mr-2`}>{fieldSettingParameters?.min}</p>

                        <div className='w-[40%]'>
                            <input
                                type="range"
                                min={minRange}
                                max={maxRange}
                                value={sliderValue}
                                onChange={handleRange}
                                maxLength={50}
                                style={{
                                    '--percent': `${sliderPercentage}%`
                                }}
                                className='mt-6 custom-slider w-full'
                            />
                        </div>
                        <p className={`w-auto max-w-[10%] break-all overflow-auto ${preview ? 'mt-1' : 'mt-5'} ml-2`}>{fieldSettingParameters?.max}</p>
                        {fieldSettingParameters?.postField &&
                            <p className='w-auto max-w-[20%] break-all overflow-auto mt-5 ml-2'>{fieldSettingParameters?.postField}</p>}
                    </div>
                    <p className='font-normal text-sm text-[#2B333B] italic mt-4'>
                    Select Value: {fieldSettingParameters?.type === 'float' ? sliderValue.toFixed(2) : sliderValue}
                    </p>
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