import React from 'react';
import TimePicker from '../../../../../Components/TimePicker/TimePicker';
import ErrorMessage from '../../../../../Components/ErrorMessage/ErrorMessage';
import { findSectionAndPageName } from '../../../../../CommonMethods/SectionPageFinder';

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
    dateValue,
    setConditionalValues,
    sections
}) {
    const splitDate = (dateStr) => {
        if (!dateStr || typeof dateStr !== 'string') {
            return new Date().toISOString().split('T')[0];
        }
        const [day, month, year] = dateStr.split("/");
        return `${year}-${month}-${day}`;
    }

    const splitTime = (timeStr) => {
        if (!timeStr) {
            return { hours: 0, minutes: 0, seconds: 0 };
        }
        const [hours, minutes, seconds] = timeStr.split(":");
        return { 
            hours: parseInt(hours, 10) || 0, 
            minutes: parseInt(minutes, 10) || 0, 
            seconds: parseInt(seconds || "0", 10) || 0 
        };
    };
    const handleDateTime = (date, time) => {
        const { section_name, page_name, label } = findSectionAndPageName(sections, question?.question_id);
        
        // Handle the date
        const dateParts = new Date(splitDate(date));
        
        // Handle the time
        const { hours, minutes, seconds } = splitTime(time);
        const combinedDateTime = new Date(dateParts.getFullYear(), dateParts.getMonth(), dateParts.getDate(), hours, minutes, seconds, 0);

        setConditionalValues((prevValues) => ({
            ...prevValues,
            [section_name]: {
                ...prevValues[section_name],
                [page_name]: {
                    ...prevValues[section_name]?.[page_name],
                    [label]: combinedDateTime
                }
            }
        }));

        // Only include time in the value if it exists
        const dateTimeString = time ? `${date} ${time}` : date;
        setValue((prev) => ({
            ...prev,
            [question?.question_id]: dateTimeString
        }));

        setValidationErrors((prevErrors) => ({
            ...prevErrors,
            preview_datetimefield: {
                ...prevErrors.preview_datetimefield,
                [question?.question_id]: ''
            }
        }));
    };
    function handleFunction(e) {
        console.log(e, 'dddddddddd') // 03:02:01
        if (type === 'time') {
            const value = e
            console.log(e, 'seeeeeee')
            setValue((prev) => ({
                ...prev,
                [question?.question_id]: value || false
            }));
            setValidationErrors((prevErrors) => ({
                ...prevErrors,
                preview_datetimefield: {
                    ...prevErrors.preview_datetimefield,
                    [question?.question_id]: '' // Only clear the error message for the current question  
                }
            }));
            const { section_name, page_name, label } = findSectionAndPageName(sections, question?.question_id);
            const { hours, minutes, seconds } = splitTime(value);
            const currentDateTime = new Date();
            currentDateTime.setHours(hours, minutes, seconds, 0);
            setConditionalValues((prevValues) => ({
                ...prevValues,
                [section_name]: {
                    ...prevValues[section_name], // Preserve existing entries for this section
                    [page_name]: {
                        ...prevValues[section_name]?.[page_name], // Preserve existing entries for this page
                        [label]: currentDateTime // Thu Mar 01 2001 02:01:00 GMT+0530 (India Standard Time)
                    }
                }
            }))
        } else if (type === 'date'){
            const value = e.target.value;
            const { section_name, page_name, label } = findSectionAndPageName(sections, question?.question_id)
            setConditionalValues((prevValues) => ({
                ...prevValues,
                [section_name]: {
                    ...prevValues[section_name], // Preserve existing entries for this section
                    [page_name]: {
                        ...prevValues[section_name]?.[page_name], // Preserve existing entries for this page
                        [label]: new Date(splitDate(value)) // Add or update the label key with newValue
                    }
                }
            }));
            setValue((prev) => ({
                ...prev,
                [question?.question_id]: value
            }));
            setValidationErrors((prevErrors) => ({
                ...prevErrors,
                preview_datetimefield: {
                    ...prevErrors.preview_datetimefield,
                    [question?.question_id]: '' // Only clear the error message for the current question  
                }
            }));
        }
    }


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
                        className={`w-full h-auto break-words border border-[#AEB3B7] rounded-md ${preview ? 'mt-1' : 'mt-5'} bg-white py-3 px-4 outline-0 font-normal text-base text-[#2B333B] placeholder:text-base placeholder:font-base placeholder:text-[#9FACB9] ${className}`}
                        placeholder={question?.placeholder_content || fieldSettingParameters?.placeholderContent}
                        onChange={(e) => handleFunction(e)}
                    />
                )}
                {preview && type === 'time' && (
                    <TimePicker
                        onChange={handleFunction}
                        format={question?.format}
                        setErrorMessage={(errorMessage) => setValidationErrors((prevErrors) => ({
                            ...prevErrors,
                            preview_datetimefield: {
                                ...prevErrors.preview_datetimefield,
                                [question?.question_id]: errorMessage
                            }
                        }))}
                    />
                )}

                {preview && type === 'datetime' && (
                    <div className='flex flex-wrap z-[-1] w-full'>
                        <div className="flex w-full flex-wrap mb-2 flex-col">
                            <input
                                data-testid="input"
                                type="date"
                                id={textId}
                                value={value}
                                className={`w-full h-[40px] break-words border border-[#AEB3B7] rounded-md mt-2 bg-white py-3 px-4 outline-0 font-normal text-[14px] text-[#2B333B] placeholder:text-base placeholder:font-base placeholder:text-[#9FACB9] ${className}`}
                                placeholder={question?.placeholder_content}
                                onChange={(e) => handleDateTime(e.target.value, value)}
                            />
                        </div>
                        <TimePicker
                            onChange={(time) => handleDateTime(dateValue, time)}
                            format={question?.format}
                            setErrorMessage={(errorMessage) => setValidationErrors((prevErrors) => ({
                                ...prevErrors,
                                preview_datetimefield: {
                                    ...prevErrors.preview_datetimefield,
                                    [question?.question_id]: errorMessage
                                }
                            }))}
                        />
                    </div>
                )}
                {(question?.question_id && validationErrors?.preview_datetimefield && validationErrors?.preview_datetimefield[question?.question_id]) && (
                    <ErrorMessage error={validationErrors?.preview_datetimefield[question?.question_id]} />
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
