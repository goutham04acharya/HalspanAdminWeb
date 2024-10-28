import React from 'react'
import ErrorMessage from '../../../../../Components/ErrorMessage/ErrorMessage';
import { findSectionAndPageName } from '../../../../../CommonMethods/SectionPageFinder';

const TextBoxField = ({
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
    options,
    setValidationErrors,
    validationErrors,
    question_id,
    question,
    setIsFormatError,
    setValue,
    setConditionalValues,
    sections
}) => {
    console.log(sections, 'sections sections')
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
                [question.question_id]: null,
            },
        }))
        const newValue = e.target.value;
        const format = question.format;
        const regex = question.regular_expression;
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
        
        setValue((prev) => ({
            ...prev,
            [question_id]: newValue
        }))
        // Check for validation if the field is not optional   
        if (!question?.options?.optional && newValue.trim() === '') {
            setIsFormatError(false)
            setValidationErrors((prevErrors) => ({
                ...prevErrors,
                preview_textboxfield: {
                    ...prevErrors.preview_textboxfield,
                    [question.question_id]: 'This is a mandatory field',
                },
            }));
        } else if (!validateFormat(newValue, format, regex)) {
            setIsFormatError(true)
            setValidationErrors((prevErrors) => ({
                ...prevErrors,
                preview_textboxfield: {
                    ...prevErrors.preview_textboxfield,
                    [question.question_id]: question?.format_error ? question?.format_error : `Invalid format. Please enter a value in the correct format.`,
                },
            }));
        } else {
            // Clear the error if the field is filled and format is valid 
            setIsFormatError(false)
            setValidationErrors((prevErrors) => ({
                ...prevErrors,
                preview_textboxfield: {
                    ...prevErrors.preview_textboxfield,
                    [question.question_id]: null,
                },
            }));
        }
    };
    function handleFunction() {

    }


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
                    value={value}
                    className={`h-[156px] resize-none w-full break-words border border-[#AEB3B7] rounded-lg bg-white ${preview ? 'mt-1' : 'mt-5'} py-3 px-4 outline-0 font-normal text-base text-[#2B333B] placeholder:text-base placeholder:font-base placeholder:text-[#9FACB9] ${className}`}
                    placeholder={preview ? question?.placeholder_content : fieldSettingParameters?.placeholderContent}
                    onClick={preview ? handleFunction() : () => handleChange(fieldSettingParameters)}
                    // onBlur={(e) => handleInputChange(e)}
                    onKeyDown={(e) => {
                        const format = question.format;
                        const regex = question.regular_expression;
                        const keyValue = e.key;

                        if (format === 'Alpha' && !/^[a-zA-Z]$/.test(keyValue)) {
                            setValidationErrors((prevErrors) => ({
                                ...prevErrors,
                                preview_textboxfield: {
                                    ...prevErrors.preview_textboxfield,
                                    [question.question_id]: `Only alphabets are allowed.`,
                                },
                            }));
                        } else if (format === 'Alphanumeric' && !/^[a-zA-Z0-9]$/.test(keyValue)) {
                            setValidationErrors((prevErrors) => ({
                                ...prevErrors,
                                preview_textboxfield: {
                                    ...prevErrors.preview_textboxfield,
                                    [question.question_id]: `Only alphabets and numbers are allowed.`,
                                },
                            }));
                        } else if (format === 'Numeric' && !/^[0-9]$/.test(keyValue)) {
                            setValidationErrors((prevErrors) => ({
                                ...prevErrors,
                                preview_textboxfield: {
                                    ...prevErrors.preview_textboxfield,
                                    [question.question_id]: `Only numbers are allowed.`,
                                },
                            }));
                        } else if (format === 'Custom Regular Expression' && !new RegExp(regex).test(keyValue)) {
                            setIsFormatError(true)
                            setValidationErrors((prevErrors) => ({
                                ...prevErrors,
                                preview_textboxfield: {
                                    ...prevErrors.preview_textboxfield,
                                    [question.question_id]: question?.format_error ? question?.format_error : `Invalid format. Please enter a value in the correct format.`,
                                },
                            }));
                        }
                    }}
                    onChange={(e) => handleInputChange(e)}
                    maxLength={question?.field_range?.max}
                    required={question?.options?.optional === true ? true : false}
                />
                :
                <input
                    data-testid='input'
                    type={type}
                    id={textId}
                    value={value ? value : ''}
                    className={`w-full h-auto break-words border border-[#AEB3B7] rounded-lg bg-white py-3 px-4 ${preview ? 'mt-1' : 'mt-5'} outline-0 font-normal text-base text-[#2B333B] placeholder:text-base placeholder:font-base placeholder:text-[#9FACB9] ${className}`}
                    placeholder={preview ? question?.placeholder_content : fieldSettingParameters?.placeholderContent}
                    onClick={preview ? '' : () => handleChange(fieldSettingParameters)}
                    // onBlur={(e) => handleInputChange(e)}
                    onKeyDown={(e) => {
                        const format = question.format;
                        const regex = question.regular_expression;
                        const keyValue = e.key;

                        if (format === 'Alpha' && !/^[a-zA-Z]$/.test(keyValue)) {
                            setValidationErrors((prevErrors) => ({
                                ...prevErrors,
                                preview_textboxfield: {
                                    ...prevErrors.preview_textboxfield,
                                    [question.question_id]: `Only alphabets are allowed.`,
                                },
                            }));
                        } else if (format === 'Alphanumeric' && !/^[a-zA-Z0-9]$/.test(keyValue)) {
                            setValidationErrors((prevErrors) => ({
                                ...prevErrors,
                                preview_textboxfield: {
                                    ...prevErrors.preview_textboxfield,
                                    [question.question_id]: `Only alphabets and numbers are allowed.`,
                                },
                            }));
                        } else if (format === 'Numeric' && !/^[0-9]$/.test(keyValue)) {
                            setValidationErrors((prevErrors) => ({
                                ...prevErrors,
                                preview_textboxfield: {
                                    ...prevErrors.preview_textboxfield,
                                    [question.question_id]: `Only numbers are allowed.`,
                                },
                            }));
                        } else if (format === 'Custom Regular Expression' && !new RegExp(regex).test(keyValue)) {
                            setIsFormatError(true)
                            setValidationErrors((prevErrors) => ({
                                ...prevErrors,
                                preview_textboxfield: {
                                    ...prevErrors.preview_textboxfield,
                                    [question.question_id]: question?.format_error ? question?.format_error : `Invalid format. Please enter a value in the correct format.`,
                                },
                            }));
                        }
                    }}
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