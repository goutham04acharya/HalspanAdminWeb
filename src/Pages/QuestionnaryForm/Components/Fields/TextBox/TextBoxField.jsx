import React from 'react'
import ErrorMessage from '../../../../../Components/ErrorMessage/ErrorMessage';
import { findSectionAndPageName } from '../../../../../CommonMethods/SectionPageFinder';
import { useDispatch } from 'react-redux';
import { setFieldEditable } from '../../defaultContentPreviewSlice';
import { setQuestionValue } from '../../previewQuestionnaireValuesSlice';
import { useSelector } from 'react-redux';

const TextBoxField = ({
    label,
    type,
    formStatus,
    textId,
    HelpText,
    value,
    className,
    handleChange,
    fieldSettingParameters,
    testId,
    preview,
    options,
    setValidationErrors,
    validationErrors,
    question_id,
    question,
    setIsFormatError,
    setValue,
    setConditionalValues,
    sections,
    isEditable,
    onStartEdit,
    // setFieldEditable,
    setFieldValue,
    values,
    setIsModified,
    isModified
}) => {
    const dispatch = useDispatch();
    const questionValue = useSelector(state => state.questionValues.questions);
    const validateFormat = (value, format, regex) => {
        switch (format) {
            case 'Alpha':
                return /^[a-zA-Z]+$/.test(value);
            case 'Alphanumeric':
                return /^[a-zA-Z0-9]+$/.test(value);
            case 'Numeric':
                return /^[0-9]+$/.test(value);
            case 'Custom Regular Expression':
                return new RegExp(regex).test(value);
            default:
                return true; // Allow any format if not specified  
        }
    };

    const handleInputChange = (e) => {
        setValidationErrors((prevErrors) => ({
            ...prevErrors,
            preview_textboxfield: {
                ...prevErrors.preview_textboxfield,
                [question?.question_id]: null,
            },
        }))
        const keyValue = e.key;
        const newValue = e.target.value;
        const formatError = question?.format_error;
        const format = question?.format;
        const regex = question?.regular_expression;
        const { section_name, page_name, label } = findSectionAndPageName(sections, question_id)
        setConditionalValues((prevValues) => ({
            ...prevValues,
            [section_name]: {
                ...prevValues[section_name], // Preserve existing entries for this section
                [page_name]: {
                    ...prevValues[section_name]?.[page_name], // Preserve existing entries for this page
                    [label]: newValue // Add or update the label key with newValue
                }
            }
        }));
        let obj = {
            'fieldId': question_id,
            isEditable: true
        }
        setIsModified(!isModified);
        dispatch(setFieldEditable(obj));
        dispatch(setQuestionValue({ question_id: question_id, value: newValue }))
        setValue((prev) => ({
            ...prev,
            [question_id]: newValue
        }))
        if (format === 'Alpha' && /[^a-zA-Z ]+|^(Backspace|Tab|Enter|Shift|Control|Alt|ArrowLeft|ArrowRight|ArrowUp|ArrowDown|CapsLock|\s)$/
            .test(newValue)) {
            displayValidationError('Only alphabets are allowed.');
        } else if (format === 'Alphanumeric' && /[^a-zA-Z0-9 ]+|^(Backspace|Tab|Enter|Shift|Control|Alt|ArrowLeft|ArrowRight|ArrowUp|ArrowDown|CapsLock|\s)$/.test(newValue)) {
            displayValidationError('Only alphabets and numbers are allowed.');
        } else if (format === 'Numeric' && /[^0-9 ]+|^(Backspace|Tab|Enter|Shift|Control|Alt|ArrowLeft|ArrowRight|ArrowUp|ArrowDown|CapsLock|\s)$/.test(newValue)) {
            displayValidationError('Only numbers are allowed.');
        } else if (format === 'Custom Regular Expression' && !new RegExp(regex).test(newValue)) {
            displayValidationError(formatError);
        } else {
            // Clear the error if the field is filled and format is valid 
            setIsFormatError(false)
            displayValidationError(null);
        }
    };

    const displayValidationError = (message) => {
        setValidationErrors((prevErrors) => ({
            ...prevErrors,
            preview_textboxfield: {
                ...prevErrors.preview_textboxfield,
                [question.question_id]: message,
            },
        }));
    }

    const handleKeyDown = (e) => {
        const keyValue = e.key;
        if (['Backspace', 'Tab', 'Enter', 'Shift', 'Control', 'Alt', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', ' ', 'CapsLock'].includes(keyValue)) {
            return;
        }
    };
    return (
        <div className=''>
            <label
                data-testid="label-name"
                htmlFor={textId}
                maxLength={100}
                title={preview ? question?.label : fieldSettingParameters?.label}
                className={`font-medium text-base text-[#000000] overflow-hidden break-all block w-full max-w-[85%] ${preview ? question?.label : fieldSettingParameters?.label === '' ? 'h-[20px]' : 'h-auto'}`}>
                {preview ? question?.label : fieldSettingParameters?.label}{(!question?.options?.optional && preview) && <span className='text-red-500'>*</span>}
            </label>

            {(preview ? question?.type : fieldSettingParameters?.type) === 'multi_line' ?
                <textarea
                    data-testid='input'
                    type={type}
                    id={textId}
                    value={questionValue[question?.question_id] !== true ? questionValue[question?.question_id] : ''}
                    className={`h-[156px] resize-none w-full break-words border ${validationErrors?.preview_textboxfield?.[question.question_id] ? 'border-[#FFA318]' : 'border-[#AEB3B7]'} rounded-lg ${question?.options?.read_only ? 'bg-gray-50' : 'bg-white'} ${preview ? 'mt-1' : 'mt-5'} py-3 px-4 outline-0 font-normal text-base text-[#2B333B] placeholder:text-base placeholder:font-base placeholder:text-[#9FACB9] ${className}`}
                    placeholder={preview ? question?.placeholder_content : fieldSettingParameters?.placeholderContent}
                    // onClick={preview ? () => handleFunction() : () => handleChange(fieldSettingParameters)}
                    // onKeyDown={(e) => handleKeyDown(e, question?.format, question?.regular_expression)}
                    onKeyDown={(e) => handleKeyDown(e)}
                    onChange={(e) => handleInputChange(e)}
                    maxLength={question?.field_range?.max}
                    required={question?.options?.optional === true ? true : false}
                    disabled={question?.options?.read_only}
                />
                :
                <input
                    data-testid='input'
                    type={type}
                    id={textId}
                    value={questionValue[question?.question_id] !== true ? questionValue[question?.question_id] : ''}
                    disabled={question?.options?.read_only}
                    className={`w-full h-auto break-words border ${validationErrors?.preview_textboxfield?.[question.question_id] ? 'border-[#FFA318]' : 'border-[#AEB3B7]'}  rounded-lg ${question?.options?.read_only ? 'bg-gray-50' : 'bg-white'} py-3 px-4 ${preview ? 'mt-1' : 'mt-5'} outline-0 font-normal text-base text-[#2B333B] placeholder:text-base placeholder:font-base placeholder:text-[#9FACB9] ${className}`}
                    placeholder={preview ? question?.placeholder_content : fieldSettingParameters?.placeholderContent}
                    // onClick={preview && () => handleFunction()}
                    // onKeyDown={(e) => handleKeyDown(e, question?.format, question?.regular_expression)}
                    onKeyDown={(e) => handleKeyDown(e)}
                    onChange={(e) => handleInputChange(e)}
                    maxLength={question?.field_range?.max}
                    required={question?.options?.optional === true ? true : false}
                />
            }
            {(question?.question_id && validationErrors?.preview_textboxfield && validationErrors.preview_textboxfield[question.question_id]) && (
                <ErrorMessage error={validationErrors.preview_textboxfield[question.question_id]} />
            )}


            <p
                data-testid="help-text"
                className={`italic ${preview ? 'mb-2 mt-1 text-xs' : 'mt-2 text-sm'} font-normal  text-[#2B333B] break-words max-w-[90%]`}
                title={preview ? question?.help_text : fieldSettingParameters?.helptext}
            >
                {preview ? question?.help_text : fieldSettingParameters?.helptext}</p>
        </div>
    )
}

export default TextBoxField