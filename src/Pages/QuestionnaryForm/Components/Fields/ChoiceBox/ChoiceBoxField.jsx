import React, { useEffect, useRef, useState } from 'react';
import Image from '../../../../../Components/Image/Image';
import RadioButtonGroup from '../../../../../Components/RadioButtonGroup/RadioButtonGroup';
import CheckboxButtonGroup from '../../../../../Components/CheckboxButtonGroup/CheckboxButtonGroup';
import InfinateDropdown from '../../../../../Components/InputField/InfinateDropdown';
import ErrorMessage from '../../../../../Components/ErrorMessage/ErrorMessage';
import { findSectionAndPageName } from '../../../../../CommonMethods/SectionPageFinder';
import { setQuestionValue } from '../../previewQuestionnaireValuesSlice';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import useOnClickOutside from '../../../../../CommonMethods/outSideClick';

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
    const [choiceSelected, setChoiceSelected] = useState('')
    const dropdownRef = useRef();
    const dispatch = useDispatch()
    const questionValue = useSelector(state => state.questionValues.questions);
    const handleRadioChange = (selectedValue) => {
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
        dispatch(setQuestionValue({ question_id: question?.question_id, value: selectedValue }))
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
        setOptionSelected(questionValue[question?.question_id]);
    };
    const handleDropdownChange = (value) => {
        setChoiceSelected(questionValue[question?.question_id]);
        setOptionSelected(questionValue[question?.question_id]);
        dispatch(setQuestionValue({ question_id: question?.question_id, value: value.value }))
        setIsDropdownOpen(false)
        const { section_name, page_name, label } = findSectionAndPageName(sections, question?.question_id)
        setConditionalValues((prevValues) => ({
            ...prevValues,
            [section_name]: {
                ...prevValues[section_name], // Preserve existing entries for this section
                [page_name]: {
                    ...prevValues[section_name]?.[page_name], // Preserve existing entries for this page
                    [label]: value.value // Add or update the label key with newValue
                }
            }
        }))
        setValue((prev) => ({
            ...prev,
            [question?.question_id]: value.value,
        }));
        setValidationErrors((prevErrors) => ({
            ...prevErrors,
            preview_choiceboxfield: {
                ...prevErrors?.preview_choiceboxfield,
                [question?.question_id]: null,
            },
        }));

    }
    const handleCheckboxChange = (value) => {
        setChoiceSelected(questionValue[question?.question_id]);
        setOptionSelected(questionValue[question?.question_id]);
        dispatch(setQuestionValue({ question_id: question?.question_id, value: value }))
        setIsDropdownOpen(false)
        const { section_name, page_name, label } = findSectionAndPageName(sections, question?.question_id)
        setConditionalValues((prevValues) => ({
            ...prevValues,
            [section_name]: {
                ...prevValues[section_name], // Preserve existing entries for this section
                [page_name]: {
                    ...prevValues[section_name]?.[page_name], // Preserve existing entries for this page
                    [label]: value // Add or update the label key with newValue
                }
            }
        }))
        setValidationErrors((prevErrors) => ({
            ...prevErrors,
            preview_choiceboxfield: {
                ...prevErrors?.preview_choiceboxfield,
                [question?.question_id]: null,
            },
        }));
        setValue((prev) => ({
            ...prev,
            [question?.question_id]: value,
        }));
    };

    const renderInputGroup = () => {
        const { source, type, fixedChoiceArray, lookupOptionChoice, source_value } = fieldSettingParameters;
        let values = [];
        if (preview) {
            values = (question?.source === 'fixedList')
                ? question?.source_value?.map(choice => choice.value) || []
                : lookupOptionChoice || source_value || [];
        } else {
            values = (source === 'fixedList')
                ? fixedChoiceArray?.map(choice => choice.value) || []
                : lookupOptionChoice || source_value || [];
        }

        if (type === 'single_choice') {
            return <RadioButtonGroup testId={testId} questionValue={questionValue} setValue={setValue} setValidationErrors={setValidationErrors} preview values={values} question={question} name={source} onChange={handleRadioChange} />;
        } else if (type === 'multi_choice') {
            return <CheckboxButtonGroup testId={testId} questionValue={questionValue} setValue={setValue} setValidationErrors={setValidationErrors} preview values={values} question={question} name={source} onChange={handleCheckboxChange} />;
        }
    };

    // useEffect(() => {
    //     setOptionSelected(choiceValue?.value);
    // }, [choiceValue]);

    useOnClickOutside(dropdownRef, () => {
        setIsDropdownOpen(false);
    });

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
                        className='w-full truncate cursor-pointer placeholder:text-[#9FACB9] placeholder:w-[240px] h-[45px]'
                        testID='lookup-dropdown'
                        labeltestID='lookup-list'
                        isDropdownOpen={isDropdownOpen}
                        setDropdownOpen={setIsDropdownOpen}
                        handleOptionClick={handleDropdownChange}
                        top='20px'
                        options={question?.source_value ? question?.source_value : null}
                        selectedOption={questionValue[question?.question_id]}
                        preview
                        choiceBox
                        validationError={validationErrors?.preview_choiceboxfield?.[question.question_id]}
                        type={question?.type}
                        dropdownRef={dropdownRef}
                        readonly={question?.options?.read_only}
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
