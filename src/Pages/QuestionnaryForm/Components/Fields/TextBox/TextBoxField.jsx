import React from 'react'
import ErrorMessage from '../../../../../Components/ErrorMessage/ErrorMessage';

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
    question
}) => {
    const handleInputChange = (e) => {
        // console.log(validationErrors)
        const newValue = e.target.value;
        
        // Call the original handleChange function to update the value
        // handleChange(fieldSettingParameters, newValue);
        
        // Check for validation if the field is not optional
        if (!question?.options?.optional && newValue.trim() === '') {
            setValidationErrors((prevErrors) => ({
                ...prevErrors,
                preview_textboxfield: 'This is a mandatory field',
            }));
        } else {
            // Clear the error if the field is filled
            setValidationErrors((prevErrors) => ({
                ...prevErrors,
                preview_textboxfield: '', // Or remove the key if you prefer
            }));
        }
    };
    
    return (
        <div>
            <label
                data-testid="label-name"
                htmlFor={textId}
                maxLength={100}
                title={fieldSettingParameters?.label}
                className={`font-medium text-base text-[#000000] overflow-hidden break-all block w-full max-w-[85%] ${fieldSettingParameters?.label === '' ? 'h-[20px]' : 'h-auto'}`}>
                {preview ? question?.label : fieldSettingParameters?.label}
            </label>
            {(preview ? question?.type : fieldSettingParameters?.type )=== 'multi_line' ?
                <textarea
                    data-testid='input'
                    type={type}
                    id={textId}
                    value={value}
                    className={`h-[156px] resize-none w-full break-words border border-[#AEB3B7] rounded-lg bg-white ${preview ? 'mt-1' : 'mt-5'} py-3 px-4 outline-0 font-normal text-base text-[#2B333B] placeholder:text-base placeholder:font-base placeholder:text-[#9FACB9] ${className}`}
                    placeholder={preview ? question?.placeholder_content :fieldSettingParameters?.placeholderContent}
                    onClick={preview ? '' : () => handleChange(fieldSettingParameters)}
                    onBlur={(e)=>handleInputChange(e)}
                    required={question?.options?.optional === true ? true : false}
                />
                :
                <input
                    data-testid='input'
                    type={type}
                    id={textId}
                    value={value}
                    className={`w-full h-auto break-words border border-[#AEB3B7] rounded-lg bg-white py-3 px-4 ${preview ? 'mt-1' : 'mt-5'} outline-0 font-normal text-base text-[#2B333B] placeholder:text-base placeholder:font-base placeholder:text-[#9FACB9] ${className}`}
                    placeholder={preview ? question?.placeholder_content :fieldSettingParameters?.placeholderContent}
                    onClick={preview ? '' : () => handleChange(fieldSettingParameters)}
                    onBlur={(e)=>handleInputChange(e)}
                    required={question?.options?.optional === true ? true : false}
                />
            }
            {(question?.question_id && validationErrors?.preview_textboxfield) && (
              <ErrorMessage error={validationErrors.preview_textboxfield} />
            )}
            <p
                data-testid="help-text"
                className={`italic ${preview ? 'mb-2 text-xs' : 'mt-2 text-sm'} font-normal  text-[#2B333B] break-words max-w-[90%]`}
                title={preview ? question?.help_text :fieldSettingParameters?.helptext}
            >
                {preview ? question?.help_text :fieldSettingParameters?.helptext}</p>
        </div>
    )
}

export default TextBoxField