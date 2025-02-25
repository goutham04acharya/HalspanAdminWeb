import React, { useState } from 'react';
import TimePicker from '../../../../../Components/TimePicker/TimePicker';
import ErrorMessage from '../../../../../Components/ErrorMessage/ErrorMessage';
import { findSectionAndPageName } from '../../../../../CommonMethods/SectionPageFinder';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { setQuestionValue } from '../../previewQuestionnaireValuesSlice';
import DatePicker from 'react-date-picker';
import { setFieldEditable } from '../../defaultContentPreviewSlice';
import { formatDate } from '../../../../../CommonMethods/FormatDate';

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
    const handleDateTime = (date, time, type) => {
        if (type === 'date') {
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
        if (type === 'time') {
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
            const parsedDate = new Date(date); // Assuming date is in 'yyyy-mm-dd' format
            const combinedDateTime = new Date(
                parsedDate.getFullYear(),
                parsedDate.getMonth(),
                parsedDate.getDate(),
            );
            // Update conditional values
            setConditionalValues((prevValues) => ({
                ...prevValues,
                [question?.question_id.replace(/-/g, '_')]: `${date ? `${formatDate(date)} ` : ''}${time ? time : ''}`
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
    };


    function handleFunction(e) {
        console.log('type', type)
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
            const { hours, minutes, seconds } = splitTime(value);
            const currentDateTime = new Date();
            currentDateTime.setHours(hours, minutes, seconds, 0);
            setConditionalValues((prevValues) => ({
                ...prevValues,
                [question?.question_id.replace(/-/g, '_')]: currentDateTime
            }))
        } else if (type === 'date') {
            const value = e;
            const selectedDate = new Date(value);
            selectedDate.setHours(0, 0, 0, 0);
            setConditionalValues((prevValues) => ({
                ...prevValues,
                [question?.question_id.replace(/-/g, '_')]: selectedDate.toLocaleDateString()
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
                            onChange={(e) => handleDateTime(e.target.value, timeValue, 'date')} // Pass date and current time
                            pattern='\d{4}-\d{2}-\d{2}'
                            min="1000-01-01"
                            max="9999-12-31"
                            disabled={question?.options?.read_only}
                            onMouseDown={(e) => e.target.showPicker?.()} // Ensures the date picker appears on focus
                        />
                    </div>
                    <TimePicker
                        onChange={(time) => handleDateTime(dateVal, time, 'time')} // Pass current date and new time
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
