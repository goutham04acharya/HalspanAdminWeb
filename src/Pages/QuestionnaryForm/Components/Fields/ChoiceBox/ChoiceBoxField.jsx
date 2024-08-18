import React from 'react'
import Image from '../../../../../Components/Image/Image'
import RadioButtonGroup from '../../../../../Components/RadioButtonGroup/RadioButtonGroup'
import CheckboxButtonGroup from '../../../../../Components/CheckboxButtonGroup/CheckboxButtonGroup';

const ChoiceBoxField = ({
    label,
    testId,
    type,
    textId,
    HelpText,
    value,
    className,
    handleChange,
    fieldSettingParameters,


}) => {

    // Handle the change event
    const handleRadioChange = (selectedValue) => {
        console.log('Selected value:', selectedValue);
    };

    return (
        <div>
            <label htmlFor={textId} className='font-medium text-base text-[#000000] absolute top-5'>{fieldSettingParameters?.label || 'Question 1'}</label>
            {/* need to create mapping based on the source and  then based on type either radio button or checkbox */}
            {fieldSettingParameters?.type === 'single_choice' ?
                <div className='relative single_choice'>
                    {fieldSettingParameters?.source === 'fixedList' && <RadioButtonGroup
                        values={fieldSettingParameters?.fixedChoiceArray?.map(choice => choice.value) || []}
                        name="fixedChoice"
                        onChange={handleRadioChange}
                    />}
                    {fieldSettingParameters?.source === 'lookup' && <RadioButtonGroup
                        values={fieldSettingParameters?.lookupOptionChoice || []}
                        name="lookupChoice"
                        onChange={handleRadioChange}
                    />}
                </div>
            : fieldSettingParameters?.type === 'multi_choice' ?
                <div className='relative multi_choice'>
                    {fieldSettingParameters?.source === 'fixedList' && <CheckboxButtonGroup
                        values={fieldSettingParameters?.fixedChoiceArray?.map(choice => choice.value) || []}
                        name="fixedChoice"
                        onChange={handleRadioChange}
                    />}
                    {fieldSettingParameters?.source === 'lookup' && <CheckboxButtonGroup
                        values={fieldSettingParameters?.lookupOptionChoice || []}
                        name="lookupChoice"
                        onChange={handleRadioChange}
                    />}
                </div>
                :
                <div className='relative'>
                    <input
                        data-testid={testId}
                        type={type}
                        id={textId}
                        value={value}
                        className={`w-full h-auto break-words border border-[#AEB3B7] rounded-lg bg-white py-3 px-4 outline-0 font-normal text-base text-[#2B333B] placeholder:text-base placeholder:font-base placeholder:text-[#9FACB9] ${className}`}
                        placeholder={fieldSettingParameters?.placeholderContent}
                        onClick={() => handleChange()}
                    />
                    <div className='absolute right-4 top-1/2 -translate-y-1/2'>
                        <Image src='down' />
                    </div>
                </div>
            }
            <p className='mt-2 font-normal text-sm text-[#2B333B]'>{fieldSettingParameters?.helptext}</p>
        </div>
    )
}

export default ChoiceBoxField