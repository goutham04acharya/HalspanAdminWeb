import React, { useEffect, useState } from 'react';
import Image from '../../../../../Components/Image/Image';
import RadioButtonGroup from '../../../../../Components/RadioButtonGroup/RadioButtonGroup';
import CheckboxButtonGroup from '../../../../../Components/CheckboxButtonGroup/CheckboxButtonGroup';
import InfinateDropdown from '../../../../../Components/InputField/InfinateDropdown';
import ErrorMessage from '../../../../../Components/ErrorMessage/ErrorMessage';
import { findSectionAndPageName } from '../../../../../CommonMethods/SectionPageFinder';

const ChoiceBoxField = ({
    label,
    type,
    textId,
    HelpText,
    value,
    className,
    handleChange,
    fieldSettingParameters,
    testId,
    preview,
    question,
    validationErrors,
    setValidationErrors,
    setValue,
    choiceValue,
    setConditionalValues,
    sections
}) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [optionSelected, setOptionSelected] = useState('');
    const [selectedValues, setSelectedValues] = useState([]);
    console.log(fieldSettingParameters, 'ggggggggggggggggg');

    const handleRadioChange = (selectedValue) => {
        console.log(selectedValue, 'selected radio value')
        const { section_name, page_name, label } = findSectionAndPageName(sections, question?.question_id)
        setConditionalValues((prevValues) => ({
            ...prevValues,
            [section_name]: {
                ...prevValues[section_name], // Preserve existing entries for this section
                [page_name]: {
                    ...prevValues[section_name]?.[page_name], // Preserve existing entries for this page
                    [label]: selectedValue // Add or update the label key with newValue
                }
            }
        }))
        // Update the selected value in the parent state for the specific question
        setValue((prev) => ({
            ...prev,
            [question?.question_id]: selectedValue,
        }));

        // Optionally reset validation errors for this question
        setValidationErrors((prevErrors) => ({
            ...prevErrors,
            preview_choiceboxfield: {
                ...prevErrors.preview_choiceboxfield,
                [question.question_id]: null,
            },
        }));

        // Set the selected value locally for dropdown purposes or other UI updates
        setOptionSelected(selectedValue);
    };

    const handleCheckboxChange = (value) => {
        setOptionSelected(value.value)
        console.log(value, 'dddddddddddddd')
        setIsDropdownOpen(false)
        setSelectedValues(prev => {
            let newSelected;
            if (prev.includes(value)) {
                newSelected = prev.filter(item => item !== value);
            } else {
                newSelected = [...prev, value];
            }
            console.log(newSelected, 'jsjsjs')
            const { section_name, page_name, label } = findSectionAndPageName(sections, question?.question_id)
            setConditionalValues((prevValues) => ({
                ...prevValues,
                [section_name]: {
                    ...prevValues[section_name], // Preserve existing entries for this section
                    [page_name]: {
                        ...prevValues[section_name]?.[page_name], // Preserve existing entries for this page
                        [label]: newSelected.length > 1 ? newSelected : value // Add or update the label key with newValue
                    }
                }
            }))
            // Update parent component state
            if (newSelected.length === 0) {
                setValue((prev) => ({
                    ...prev,
                    [question?.question_id]: '',
                }));
            } else {
                setValue((prev) => ({
                    ...prev,
                    [question?.question_id]: newSelected,
                }));
            }

            // Clear validation errors
            setValidationErrors((prevErrors) => ({
                ...prevErrors,
                preview_choiceboxfield: {
                    ...prevErrors?.preview_choiceboxfield,
                    [question?.question_id]: null,
                },
            }));

            return newSelected;
        });
    };

    const renderInputGroup = () => {
        const { source, type, fixedChoiceArray, lookupOptionChoice } = fieldSettingParameters;
        let values = [];

        if (preview) {
            values = (question?.source === 'fixedList')
                ? question?.source_value?.map(choice => choice.value) || []
                : lookupOptionChoice || [];
        } else {
            values = (source === 'fixedList')
                ? fixedChoiceArray?.map(choice => choice.value) || []
                : lookupOptionChoice || [];
        }

        if (type === 'single_choice') {
            return <RadioButtonGroup testId={testId} setValue={setValue} setValidationErrors={setValidationErrors} preview values={values} question={question} name={source} onChange={handleRadioChange} />;
        } else if (type === 'multi_choice') {
            return <CheckboxButtonGroup testId={testId} setValue={setValue} setValidationErrors={setValidationErrors} preview values={values} question={question} name={source} onChange={handleCheckboxChange} />;
        }
    };

    useEffect(() => {
        setOptionSelected(choiceValue?.value);
    }, [choiceValue]);

    return (
        <div>
            <label
                data-testid="label-name"
                htmlFor={textId}
                title={preview ? question?.label : fieldSettingParameters?.label}
                className={`font-medium text-base text-[#000000] overflow-hidden break-all block w-full max-w-[85%] ${fieldSettingParameters?.label === '' ? 'h-[20px]' : 'h-auto'}`}
            >
                {preview ? question?.label : fieldSettingParameters?.label}{(!question?.options?.optional && preview) && <span className='text-red-500'>*</span>}
            </label>

            {['single_choice', 'multi_choice'].includes(preview ? question?.type : fieldSettingParameters?.type) ? (
                <div className={`relative ${preview ? question?.type : fieldSettingParameters?.type}`}>
                    {renderInputGroup()}
                </div>
            ) : (
                <div className='relative'>
                    {!preview && <>
                        <input
                            data-testid='input'
                            type={type}
                            id={textId}
                            value={value}
                            className={`w-full h-auto break-words border border-[#AEB3B7] ${preview ? 'mt-1' : 'mt-5'} rounded-lg bg-white py-3 pl-4 pr-12 outline-0 font-normal text-base text-[#2B333B] placeholder:text-base placeholder:font-base placeholder:text-[#9FACB9] ${className}`}
                            placeholder={fieldSettingParameters?.placeholderContent}
                            onClick={handleChange} />
                        <div className='absolute right-4 top-[65%] -translate-y-1/2'>
                            <Image src='down' />
                        </div>
                    </>}
                    {(preview && question?.type === 'dropdown') && <InfinateDropdown
                        label=''
                        id='lookup'
                        placeholder={question?.placeholder_content}
                        className='w-full cursor-pointer placeholder:text-[#9FACB9] h-[45px]'
                        testID='lookup-dropdown'
                        labeltestID='lookup-list'
                        isDropdownOpen={isDropdownOpen}
                        setDropdownOpen={setIsDropdownOpen}
                        handleOptionClick={handleCheckboxChange}
                        top='20px'
                        options={question?.source_value ? question?.source_value : null}
                        selectedOption={optionSelected}
                        preview
                        type={question?.type}
                    />}
                </div>
            )}
            {(question?.question_id && validationErrors?.preview_choiceboxfield && validationErrors.preview_choiceboxfield[question.question_id]) && (
                <ErrorMessage error={validationErrors.preview_choiceboxfield[question.question_id]} />
            )}

            <p
                data-testid="help-text"
                className='italic mt-2 font-normal text-sm text-[#2B333B] break-words max-w-[90%]'
                title={preview ? question?.help_text : fieldSettingParameters?.helptext}
            >
                {preview ? question?.help_text : fieldSettingParameters?.helptext}
            </p>
        </div>
    );
};

export default ChoiceBoxField;
