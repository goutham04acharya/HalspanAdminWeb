import React from 'react';
import TimePicker from '../../../../../Components/TimePicker/TimePicker';
import ErrorMessage from '../../../../../Components/ErrorMessage/ErrorMessage';

function DateTimeField({
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
    choiceValue
}) {
    function handleFunction(e) {
        const newValue = e.target.value;
        if (type === 'date' || type === 'datetime') {
            setValue((prev) => ({
                ...prev,
                [question?.question_id]: newValue
            }));
        }
    }
    console.log(choiceValue, 'kscjscj')
    return (
        <div>
            <label
                data-testid="label-name"
                htmlFor={textId}
                title={preview ? question?.label : fieldSettingParameters?.label}
                className={`font-medium text-base text-[#000000] overflow-hidden break-all  break-words block w-full max-w-[85%] ${(preview ? question?.label : fieldSettingParameters?.label) === '' ? 'h-[20px]' : 'h-auto'
                    }`}
            >
                {preview ? question?.label : fieldSettingParameters?.label}
                {(!question?.options?.optional && preview) && <span className="text-red-500">*</span>}
            </label>
            <div className="relative">
                {preview && type === 'date' && (
                    <input
                        data-testid="input"
                        type="date"
                        id={textId}
                        value={value}
                        className={`w-full h-auto break-words border border-[#AEB3B7] rounded-lg ${preview ? 'mt-1' : 'mt-5'} bg-white py-3 px-4 outline-0 font-normal text-base text-[#2B333B] placeholder:text-base placeholder:font-base placeholder:text-[#9FACB9] ${className}`}
                        placeholder="dd/mm/yyyy"
                        onClick={(e) => handleFunction(e)}
                    />
                )}
                {preview && type === 'time' && (
                    <TimePicker
                        onChange={(timeValue) => {
                            setValue((prev) => ({
                                ...prev,
                                [question?.question_id]: timeValue
                            }));
                        }}
                    />
                )}

                {preview && type === 'datetime' && (
                    <div className='flex z-[-1]'>
                        <div className="flex">
                            <input
                                data-testid="input"
                                type="date"
                                id={textId}
                                value={value}
                                className={`w-[90%] h-[40px] break-words border border-[#AEB3B7] rounded-lg ${preview ? 'mt-1' : 'mt-5'} bg-white py-3 px-4 outline-0 font-normal text-[14px] text-[#2B333B] placeholder:text-base placeholder:font-base placeholder:text-[#9FACB9] ${className}`}
                                placeholder="dd/mm/yyyy"
                                onClick={(e) => handleFunction(e)}
                            />
                        </div>
                        <TimePicker
                            onChange={(timeValue) => {
                                setValue((prev) => ({
                                    ...prev,
                                    [question?.question_id]: `${prev[question?.question_id]} ${timeValue}`  
                                }));
                            }}
                        />
                    </div>
                )}

                {!preview && (
                    <input
                        data-testid="input"
                        type={type}
                        id={textId}
                        value={value}
                        className={`w-full h-auto break-words border border-[#AEB3B7] rounded-lg ${preview ? 'mt-1' : 'mt-5'} bg-white py-3 px-4 outline-0 font-normal text-base text-[#2B333B] placeholder:text-base placeholder:font-base placeholder:text-[#9FACB9] ${className}`}
                        placeholder={
                            fieldSettingParameters?.placeholderContent ||
                            ((preview ? question?.type : fieldSettingParameters?.type) === 'date'
                                ? 'dd/mm/yyyy'
                                : (preview ? question?.type : fieldSettingParameters?.type) === 'time'
                                    ? 'hh:mm:ss'
                                    : 'dd/mm/yyyy hh:mm:ss')
                        }
                        onClick={() => handleChange(fieldSettingParameters)}
                    />
                )}
                {(preview ? false : fieldSettingParameters?.type) === 'date' && (
                    <img src="/Images/calendar.svg" alt="calender" className={`absolute ${preview ? 'top-4' : 'top-8'} right-3 cursor-pointer`} />
                )}
                {(preview ? false : fieldSettingParameters?.type) === 'time' && (
                    <img src="/Images/clock.svg" alt="clock" className={`absolute ${preview ? 'top-4' : 'top-8'} right-3 cursor-pointer`} />
                )}
                {(preview ? false : fieldSettingParameters?.type) === 'datetime' && (
                    <img src="/Images/calendar-clock.svg" alt="calender-clock" className={`absolute ${preview ? 'top-4' : 'top-8'} right-3 cursor-pointer`} />
                )}
            </div>
            {(question?.question_id && validationErrors?.preview_datetimefield && validationErrors.preview_datetimefield[question.question_id]) && (
                <ErrorMessage error={validationErrors.preview_datetimefield[question.question_id]} />
            )}
            <p
                data-testid="help-text"
                className="italic mt-2 font-normal text-sm text-[#2B333B] break-words max-w-[90%]"
                title={preview ? question?.help_text : fieldSettingParameters?.helptext}
            >
                {preview ? question?.help_text : fieldSettingParameters?.helptext}
            </p>
        </div>
    );
}

export default DateTimeField;
