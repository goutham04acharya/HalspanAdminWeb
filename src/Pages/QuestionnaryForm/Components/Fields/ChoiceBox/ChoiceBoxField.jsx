import React from 'react';
import Image from '../../../../../Components/Image/Image';
import RadioButtonGroup from '../../../../../Components/RadioButtonGroup/RadioButtonGroup';
import CheckboxButtonGroup from '../../../../../Components/CheckboxButtonGroup/CheckboxButtonGroup';

const ChoiceBoxField = ({
    label,
    type,
    textId,
    HelpText,
    value,
    className,
    handleChange,
    // above are not sent
    fieldSettingParameters,
    testId,
    preview,
    question
}) => {

    const handleRadioChange = (selectedValue) => {
        console.log('Selected value:', selectedValue);
    };

    const renderInputGroup = () => {
        const { source, type, fixedChoiceArray, lookupOptionChoice } = fieldSettingParameters;

        const values = source === 'fixedList'
            ? fixedChoiceArray?.map(choice => choice.value) || []
            : lookupOptionChoice || [];

        if (type === 'single_choice') {
            return <RadioButtonGroup testId={testId} preview values={values} name={source} onChange={handleRadioChange} />;
        } else if (type === 'multi_choice') {
            return <CheckboxButtonGroup testId={testId} preview values={values} name={source} onChange={handleRadioChange} />;
        }
    };

    return (
        <div>
            <label
                data-testid="label-name"
                htmlFor={textId}
                title={preview ? question?.label : fieldSettingParameters?.label}
                className={`font-medium text-base text-[#000000] overflow-hidden break-all block w-full max-w-[85%] ${fieldSettingParameters?.label === '' ? 'h-[20px]' : 'h-auto'}`}
            >
                {preview ? question?.label : fieldSettingParameters?.label}
            </label>

            {['single_choice', 'multi_choice'].includes(fieldSettingParameters?.type) ? (
                <div className={`relative ${fieldSettingParameters?.type}`}>
                    {renderInputGroup()}
                </div>
            ) : (
                <div className='relative'>
                    <input
                        data-testid='input'
                        type={type}
                        id={textId}
                        value={value}
                        className={`w-full h-auto break-words border border-[#AEB3B7] ${preview ? 'mt-1' : 'mt-5'} rounded-lg bg-white py-3 pl-4 pr-12 outline-0 font-normal text-base text-[#2B333B] placeholder:text-base placeholder:font-base placeholder:text-[#9FACB9] ${className}`}
                        placeholder={preview ? question?.placeholder_content:fieldSettingParameters?.placeholderContent}
                        onClick={handleChange}
                    />
                    <div className='absolute right-4 top-[65%] -translate-y-1/2'>
                        <Image src='down' />
                    </div>
                </div>
            )}

            <p
                data-testid="help-text"
                className='italic mt-2 font-normal text-sm text-[#2B333B] break-words max-w-[90%]'
                title={preview ? question?.help_text :fieldSettingParameters?.helptext}
            >
                {preview ? question?.help_text :fieldSettingParameters?.helptext}
            </p>
        </div>
    );
};

export default ChoiceBoxField;
