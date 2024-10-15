import React, { useRef, useState } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import ErrorMessage from '../../../../../Components/ErrorMessage/ErrorMessage';

const SignatureField = ({
    label,
    type,
    textId,
    HelpText,
    className,
    handleChange,
    fieldSettingParameters,
    testId,
    preview,
    question,
    validationErrors,
    setValidationErrors,
    setValue,
    choiceValue
}) => {
    const signatureRef = useRef(null); // Reference for SignatureCanvas
    const [isSignatureEmpty, setIsSignatureEmpty] = useState(true); // State to track if the signature is empty

    const handleSignatureEnd = () => {
        if (signatureRef.current) {
            const isEmpty = signatureRef.current.isEmpty();
            console.log(isEmpty, 'isempty')
            setIsSignatureEmpty(isEmpty); // Update state based on the canvas content
            setValue((prev) => ({
                ...prev,
                [question?.question_id]: isEmpty
            }))
            setValidationErrors((prevErrors) => ({
                ...prevErrors,
                preview_signaturefield: ''
            }));
        }
    };

    return (
        <div>
            <label
                data-testid="label-name"
                htmlFor={textId}
                maxLength={100}
                title={preview ? question?.label : fieldSettingParameters?.label}
                className={`font-medium text-base text-[#000000] overflow-hidden break-all block w-full max-w-[85%] ${fieldSettingParameters?.label === '' ? 'h-[20px]' : 'h-auto'}`}>
                {preview ? question?.label : fieldSettingParameters?.label}
            </label>

            {preview ? (
                <div>
                    <SignatureCanvas
                        ref={signatureRef}
                        penColor="black"
                        canvasProps={{ width: 300, height: 200, className: 'signature-canvas bg-white rounded-lg border border-[#AEB3B7]' }}
                        onEnd={handleSignatureEnd} // Check if the signature is empty on change
                    />
                    {/* Optionally, display a message if the signature is empty */}
                    {(question?.question_id && validationErrors?.preview_signaturefield && validationErrors.preview_signaturefield[question.question_id]) && (
                        <ErrorMessage error={validationErrors.preview_signaturefield[question.question_id]} />
                    )}
                </div>
            ) : (
                <textarea
                    data-testid='input'
                    type={type}
                    id={textId}
                    className={`h-[156px] resize-none w-full break-words border border-[#AEB3B7] rounded-lg bg-white ${preview ? 'mt-1' : 'mt-5'} py-3 px-4 outline-0 font-normal text-base text-[#2B333B] placeholder:text-base placeholder:font-base placeholder:text-[#9FACB9] ${className}`}
                    placeholder={preview ? question?.placeholder_content : fieldSettingParameters?.placeholderContent || 'Sign here'}
                    onClick={() => handleChange(fieldSettingParameters)}
                />
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

export default SignatureField;
