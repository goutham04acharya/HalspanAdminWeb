import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { handleSliderValue } from '../RangeSliderDataSlice';
import ErrorMessage from '../../../../../Components/ErrorMessage/ErrorMessage';
import { findSectionAndPageName } from '../../../../../CommonMethods/SectionPageFinder';
import { setQuestionValue } from '../../previewQuestionnaireValuesSlice';


function NumberField({
    type,
    textId,
    value,
    className,
    handleChange,
    fieldSettingParameters,
    preview,
    question,
    fieldValue,
    setValue,
    validationErrors,
    setValidationErrors,
    setConditionalValues,
    sections

}) {
    const dispatch = useDispatch();
    const [localSliderValue, setLocalSliderValue] = useState(0);
    const questionValue = useSelector(state => state.questionValues.questions);
    // Get slider value from Redux store
    const sliderValue = useSelector((state) => state.sliderConfig.sliderValue);
    console.log(sliderValue, 'slidervalue')
    // Get increment_by value from fieldSettingParameters with a fallback to 1
    const incrementByValue = fieldSettingParameters?.incrementby || 1;

    // Get min and max values from fieldSettingParameters or use defaults
    const minRange = parseInt(fieldSettingParameters?.min) || 0;
    const maxRange = parseInt(fieldSettingParameters?.max) || 100;

    // Calculate percentage for slider fill (relative to min/max range)
    const sliderPercentage = preview
        ? ((localSliderValue - (preview ? question?.field_range?.min : minRange)) / ((preview ? question?.field_range?.max : maxRange) - (preview ? question?.field_range?.min : minRange))) * 100
        : ((sliderValue - minRange) / (maxRange - minRange)) * 100;


    // Sync the fieldSettingParameters value with slider value
    useEffect(() => {
        if (fieldSettingParameters?.value !== undefined && fieldSettingParameters.value !== sliderValue) {
            dispatch(handleSliderValue({ sliderValue: fieldSettingParameters.value }));
            dispatch(setQuestionValue({ 
                question_id: question?.question_id, 
                value: fieldSettingParameters.value,
            }));
            setLocalSliderValue(fieldSettingParameters.value)
        }
    }, [fieldSettingParameters?.value, sliderValue, dispatch]);

    // Handle range slider changes and snap to the nearest multiple of incrementByValue
    const handleRange = (event) => {
        const newValue = parseInt(event.target.value, 10);

        // Round to the nearest multiple of incrementByValue
        let nearestMultiple = Math.round(newValue / incrementByValue) * incrementByValue;

        // Ensure the nearest multiple doesn't exceed the maxRange
        if (nearestMultiple > maxRange) {
            nearestMultiple = Math.floor(maxRange / incrementByValue) * incrementByValue;
        }

        // Ensure it doesn't go below the minRange
        if (nearestMultiple < minRange) {
            nearestMultiple = minRange;
        }

        // dispatch(handleSliderValue({ sliderValue: nearestMultiple }));
        if (preview) {
            setLocalSliderValue(newValue);
            dispatch(setQuestionValue({ 
                question_id: question?.question_id, 
                value: nearestMultiple 
            }));
        } else {
            dispatch(handleSliderValue({ sliderValue: nearestMultiple }));
        }

        // Call the handleChange prop if provided
        if (handleChange) {
            handleChange({ ...fieldSettingParameters, value: nearestMultiple });
        }
    };
    const handleInputChange = (e) => {
        const newValue = e.target.value
        const { section_name, page_name, label } = findSectionAndPageName(sections, question?.question_id)
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
        dispatch(setQuestionValue({ 
            question_id: question?.question_id, 
            value: newValue 
        }));
        setValue((prev) => ({
            ...prev,
            [question?.question_id]: newValue
        }))
        setValidationErrors((prevErrors) => ({
            ...prevErrors,
            preview_numberfield: '', // Or remove the key if you prefer  
        }))
    }
    console.log(value,'jjjjjj')
    return (
        <div>
            <label
                data-testid="label-name"
                htmlFor={textId}
                title={preview ? question?.label : fieldSettingParameters?.label}
                maxLength={100}
                className={`font-medium text-base text-[#000000] overflow-hidden break-all block w-full max-w-[85%]  ${fieldSettingParameters?.label === '' ? 'h-[20px]' : 'h-auto'}`}>
                {preview ? question?.label : fieldSettingParameters?.label}{(!question?.options?.optional && preview) && <span className='text-red-500'>*</span>}
            </label>
            {/* {((preview ? question?.source ==='entryfield' :fieldSettingParameters?.source === 'entryfield') || (preview ? question?.source === 'both' : fieldSettingParameters?.source === 'both')) &&
                <input
                    data-testid='input'
                    type={type}
                    id={textId}
                    value={`${fieldSettingParameters?.preField ? fieldSettingParameters.preField : ''}${fieldSettingParameters?.postField ? ` ${fieldSettingParameters.postField}` : ''}`}
                    className={`w-full h-auto break-words border border-[#AEB3B7] rounded-lg bg-white py-3 px-4 ${preview ? 'mt-1' : 'mt-5'} outline-0 font-normal text-base text-[#2B333B] placeholder:text-base placeholder:font-base placeholder:text-[#9FACB9] ${className}`}
                    placeholder={fieldSettingParameters?.placeholderContent}
                    onChange={() => handleChange(fieldSettingParameters)}
                />
            } */}
            {((!preview && fieldSettingParameters?.source === 'entryfield') || (!preview && fieldSettingParameters?.source === 'both')) ? <input
                data-testid='input'
                type={type}
                id={textId}
                value={`${fieldSettingParameters?.preField ? fieldSettingParameters.preField : ''}${fieldSettingParameters?.postField ? ` ${fieldSettingParameters.postField}` : ''}`}
                className={`w-full h-auto break-words border border-[#AEB3B7] rounded-lg bg-white py-3 px-4 ${preview ? 'mt-1' : 'mt-5'} outline-0 font-normal text-base text-[#2B333B] placeholder:text-base placeholder:font-base placeholder:text-[#9FACB9] ${className}`}
                placeholder={fieldSettingParameters?.placeholderContent}
                onChange={() => handleChange(fieldSettingParameters)}
            /> : ((preview && question?.source === 'entryfield') || (preview && question?.source === 'both')) ?
                <input
                    data-testid='input'
                    type={
                        question?.type === 'integer' ? 'number' :
                            question?.type === 'float' ? 'number' :
                                question?.type === 'rating' ? 'range' :
                                    'text'
                    }
                    step={question?.type === 'float' ? 'any' : ''}
                    value={questionValue[question?.question_id]}
                    className={`w-full h-auto break-words border border-[#AEB3B7] rounded-lg bg-white py-3 px-4 mt-1 outline-0 font-normal text-base text-[#2B333B] placeholder:text-base placeholder:font-base placeholder:text-[#9FACB9]`}
                    onChange={(e) => handleInputChange(e)}
                    placeholder={question?.placeholder_content}
                /> : ''}
            {((preview ? question?.source === 'slider' : fieldSettingParameters?.source === 'slider') || (preview ? question?.source === 'both' : fieldSettingParameters?.source === 'both')) &&
                <div data-testid="slider" className=''>
                    <div className='flex items-center w-full'>
                        <p className={`w-auto max-w-[20%] break-all overflow-auto mt-5 mr-2`}>{preview ? question?.field_texts?.pre_field_text : fieldSettingParameters?.preField}</p>
                        <p className={`w-auto max-w-[10%] break-all overflow-auto mt-5 mr-2`}>
                            {preview ? question?.field_range?.min : fieldSettingParameters?.min}
                        </p>

                        <div className='w-[60%]'>
                            <input
                                type="range"
                                min={preview ? question?.field_range?.min : minRange}
                                max={preview ? question?.field_range?.max : maxRange}
                                value={preview ? localSliderValue : sliderValue}
                                onChange={handleRange}
                                maxLength={50}
                                style={{
                                    '--percent': `${sliderPercentage}%`
                                }}
                                className='mt-6 custom-slider w-full'
                                data-testid="number-slider"
                            />
                        </div>
                        <p className={`w-auto max-w-[10%] break-all overflow-auto mt-5 ml-2`}>{preview ? question?.field_range?.max : fieldSettingParameters?.max}</p>
                        <p className={`w-auto max-w-[20%] break-all overflow-auto mt-5 ml-2`}>{preview ? question?.field_texts?.post_field_text : fieldSettingParameters?.postField}</p>
                    </div>
                    {!preview ? <p className='font-normal text-sm text-[#2B333B] italic mt-4'>
                        Select Value: {fieldSettingParameters?.type === 'float' ? sliderValue.toFixed(2) : sliderValue}
                    </p> : <p className='font-normal text-sm text-[#2B333B] italic mt-4'>
                        Select Value: {question?.type === 'float' ? localSliderValue.toFixed(2) : localSliderValue}
                    </p>}
                </div>
            }
            {(question?.question_id && validationErrors?.preview_numberfield && validationErrors.preview_numberfield[question.question_id]) && (
                <ErrorMessage error={validationErrors.preview_numberfield[question.question_id]} />
            )}
            <p
                data-testid="help-text"
                className='italic mt-2 font-normal text-sm text-[#2B333B] break-words max-w-[90%]'
                title={preview ? question?.help_text : fieldSettingParameters?.helptext}
            >
                {preview ? question?.help_text : fieldSettingParameters?.helptext}</p>
        </div>
    )
}

export default NumberField