import React, { useState } from 'react';
import TimePicker from '../../../../../Components/TimePicker/TimePicker';
import ErrorMessage from '../../../../../Components/ErrorMessage/ErrorMessage';
import { findSectionAndPageName } from '../../../../../CommonMethods/SectionPageFinder';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { setQuestionValue } from '../../previewQuestionnaireValuesSlice';
import DatePicker from 'react-date-picker';
import { setFieldEditable } from '../../defaultContentPreviewSlice';

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
    conditionalValues,
    sections
}) {
    const [dateVal, setDateVal] = useState('');
    const [timeValue, setTimeValue] = useState('');
    const dispatch = useDispatch();
    const questionValue = useSelector(state => state.questionValues.questions);
    // const [date, setDate] = useState(questionValue[question?.question_id]?.split(' ')[0] ? new Date(questionValue[question?.question_id]?.split(' ')[0]) : '');
    const splitDate = (dateStr) => {
        if (!dateStr || typeof dateStr !== 'string') {
            return new Date().toISOString().split('T')[0];
        }
        const [day, month, year] = dateStr.split("/");
        return `${year}-${month}-${day}`;
    }

    const handleDatwChange = (selectedDate) => {
        if (selectedDate) {
            const formattedDate = selectedDate.toLocaleDateString('en-GB'); // Converts to DD/MM/YYYY
            setDate(selectedDate);
            handleDateTime(formattedDate, timeValue);
        }
    };
    const splitTime = (timeStr) => {
        if (!timeStr) {
            return { hours: 0, minutes: 0, seconds: 0 };
        }
        const [hours, minutes, seconds] = timeStr.split(":");
        return {
            hours: parseInt(hours, 10) || 0,
            minutes: parseInt(minutes, 10) || 0,
            seconds: parseInt(seconds || "0", 10) || 0,
            milliseconds: new Date().getMilliseconds()
        };
    };
    const handleDateTime = (date, time) => {
        console.log('hiiii')
        if (date) {
            setDateVal(date)
            dispatch(setQuestionValue({ question_id: question?.question_id, value: date }))
            setValue((prev) => ({
                ...prev,
                [question?.question_id]: date, // Ensure this stores the correct string value
            }));
            setValidationErrors((prevErrors) => ({
                ...prevErrors,
                preview_datetimefield: {
                    ...prevErrors.preview_datetimefield,
                    [question?.question_id]: '', // Clear errors for this field
                },
            }));
        }
        if (time) {
            setTimeValue(time)
            dispatch(setQuestionValue({ question_id: question?.question_id, value: time }))
            setValue((prev) => ({
                ...prev,
                [question?.question_id]: time, // Ensure this stores the correct string value
            }));
            setValidationErrors((prevErrors) => ({
                ...prevErrors,
                preview_datetimefield: {
                    ...prevErrors.preview_datetimefield,
                    [question?.question_id]: '', // Clear errors for this field
                },
            }));
        };

        // Combine date and time if both are available
        if (date && time) {
            const parsedDate = new Date(date); // Assuming date is in 'yyyy-mm-dd' format
            const { hours, minutes, seconds, milliseconds } = splitTime(time);

            const combinedDateTime = new Date(
                parsedDate.getFullYear(),
                parsedDate.getMonth(),
                parsedDate.getDate(),
                hours,
                minutes,
                seconds,
                milliseconds
            );

            const { section_name, page_name, label } = findSectionAndPageName(sections, question?.question_id);

            // Update conditional values

            setConditionalValues((prevValues) => ({
                ...prevValues,
                [section_name]: {
                    ...prevValues[section_name],
                    [page_name]: {
                        ...prevValues[section_name]?.[page_name],
                        [label]: Math.round(combinedDateTime.getTime() / 1000), // Ensure this holds the correct combined value
                    },
                },
            }));

            // Combine date and time into a string for setValue
            const dateTimeString = `${date} ${time}`;
            setValue((prev) => ({
                ...prev,
                [question?.question_id]: dateTimeString, // Ensure this stores the correct string value
            }));
            dispatch(setQuestionValue({ question_id: question?.question_id, value: dateTimeString }))

            // Clear validation errors for the current field
            setValidationErrors((prevErrors) => ({
                ...prevErrors,
                preview_datetimefield: {
                    ...prevErrors.preview_datetimefield,
                    [question?.question_id]: '', // Clear errors for this field
                },
            }));
        }
    };


    function handleFunction(e) {
        if (type === 'time') {
            const value = e
            setValue((prev) => ({
                ...prev,
                [question?.question_id]: value || false
            }));
            dispatch(setQuestionValue({ question_id: question?.question_id, value: value }))

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
        } else if (type === 'date') {
            const value = e;
            console.log(value)
            // Extract current time
            const currentHours = new Date().getHours();
            const currentMinutes = new Date().getMinutes();
            const currentSeconds = new Date().getSeconds();
            const currentMilliSeconds = new Date().getMilliseconds();
            const selectedDate = new Date(value);
            selectedDate.setHours(0, 0, 0, 0);
            console.log(selectedDate.toLocaleDateString(), 'selectedDate')
            // const systemTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
            const { section_name, page_name, label } = findSectionAndPageName(sections, question?.question_id);
            setConditionalValues((prevValues) => ({
                ...prevValues,
                [section_name]: {
                    ...prevValues[section_name],
                    [page_name]: {
                        ...prevValues[section_name]?.[page_name],
                        [label]: selectedDate.toLocaleDateString() // Add or update the label key with the selectedDate
                    }
                }
            }));

            dispatch(setQuestionValue({ question_id: question?.question_id, value: value }));

            setValue((prev) => ({
                ...prev,
                [question?.question_id]: selectedDate
            }));

            setValidationErrors((prevErrors) => ({
                ...prevErrors,
                preview_datetimefield: {
                    ...prevErrors.preview_datetimefield,
                    [question?.question_id]: '' // Only clear the error message for the current question  
                }
            }));
            dispatch(setFieldEditable({
                fieldId: question?.question_id,
                isEditable: true
            }
            ))
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
                        value={questionValue?.[question?.question_id] ? questionValue?.[question?.question_id] : ''}
                        className={`w-full h-[40px] break-words border ${validationErrors?.preview_datetimefield?.[question.question_id] ? 'border-[#FFA318]' : 'border-[#AEB3B7]'} rounded-md mt-2 ${question?.options?.read_only ? 'bg-gray-50' : 'bg-white'} py-3 px-4 outline-0 font-normal text-[14px] text-[#2B333B] placeholder:text-base placeholder:font-base placeholder:text-[#9FACB9] ${className}`}
                        placeholder={question?.placeholder_content}
                        onChange={(e) => handleFunction(e.target.value)}
                        pattern='\d{4}-\d{2}-\d{2}'
                        min="1000-01-01"
                        max="9999-12-31"
                        onMouseDown={(e) => e.target.showPicker?.()} // Ensures the date picker appears on focus
                        disabled={question?.options?.read_only}
                    />
                )}
                {preview && type === 'time' && (
                    <TimePicker
                        onChange={handleFunction}
                        format={question?.format}
                        validationErrors={validationErrors?.preview_datetimefield?.[question.question_id]}
                        questionValue={questionValue?.[question?.question_id] ? questionValue?.[question?.question_id] : ''}
                    />
                )}

                {(preview && type === 'datetime') && <div className='flex flex-wrap z-[-1] w-full'>
                    <div className="flex w-full flex-wrap mb-2 flex-col">
                        <input
                            data-testid="input"
                            type="date"
                            id={textId}
                            value={questionValue?.[question?.question_id] ? questionValue?.[question?.question_id]?.split(' ')[0] : ''} // Use state to manage date value
                            className={`w-full h-[40px] break-words border ${validationErrors?.preview_datetimefield?.[question.question_id] ? 'border-[#FFA318]' : 'border-[#AEB3B7]'} rounded-md mt-2 ${question?.options?.read_only ? 'bg-gray-50' : 'bg-white'} py-3 px-4 outline-0 font-normal text-[14px] text-[#2B333B] placeholder:text-base placeholder:font-base placeholder:text-[#9FACB9] ${className}`}
                            placeholder={question?.placeholder_content}
                            onChange={(e) => handleDateTime(e.target.value, timeValue)} // Pass date and current time
                            pattern='\d{4}-\d{2}-\d{2}'
                            min="1000-01-01"
                            max="9999-12-31"
                            disabled={question?.options?.read_only}
                            onMouseDown={(e) => e.target.showPicker?.()} // Ensures the date picker appears on focus
                        />
                    </div>
                    <TimePicker
                        onChange={(time) => handleDateTime(dateVal, time)} // Pass current date and new time
                        format={question?.format}
                        validationErrors={validationErrors?.preview_datetimefield?.[question.question_id]}
                        questionValue={questionValue?.[question?.question_id] ? questionValue[question?.question_id]?.split(' ')[1] : ''}
                        readOnly={question?.options?.read_only}
                    />
                </div>}

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
            {(question?.question_id && validationErrors?.preview_datetimefield && validationErrors?.preview_datetimefield[question?.question_id]) && (
                <ErrorMessage error={validationErrors?.preview_datetimefield[question?.question_id]} />
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
