import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { handleSliderValue } from "../RangeSliderDataSlice";
import ErrorMessage from "../../../../../Components/ErrorMessage/ErrorMessage";
import { findSectionAndPageName } from "../../../../../CommonMethods/SectionPageFinder";
import { setQuestionValue } from "../../previewQuestionnaireValuesSlice";
import { setFieldEditable } from "../../defaultContentPreviewSlice";

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
  sections,
  setIsModified,
  conditionalValues,
  isModified,
}) {
  const dispatch = useDispatch();
  const [localSliderValue, setLocalSliderValue] = useState(
    conditionalValues
      ? Number(conditionalValues[question.question_id.replaceAll("-", "_")])
      : ''
  );
  const [sliderPercentage, setSliderPercentage] = useState("");
  const questionValue = useSelector((state) => state.questionValues.questions);
  const sliderValue = useSelector((state) => state.sliderConfig.sliderValue);
  // Get increment_by value from fieldSettingParameters with a fallback to 1
  const incrementByValue = fieldSettingParameters?.incrementby || 1;

  // Get min and max values from fieldSettingParameters or use defaults
  const minRange = parseInt(fieldSettingParameters?.min) || 0;
  const maxRange = parseInt(fieldSettingParameters?.max) || 100;

  // Calculate percentage for slider fill (relative to min/max range)
  // const sliderPercentage = preview
  //     ? ((localSliderValue - (preview ? question?.field_range?.min : minRange)) / ((preview ? question?.field_range?.max : maxRange) - (preview ? question?.field_range?.min : minRange))) * 100
  //     : ((sliderValue - minRange) / (maxRange - minRange)) * 100;
  // if (preview) {
  //     setValue((prev) => ({
  //         ...prev,
  //         [question?.question_id]: sliderPercentage
  //     }))
  // }

  // Sync the fieldSettingParameters value with slider value
  useEffect(() => {
    if (
      fieldSettingParameters?.value !== undefined &&
      fieldSettingParameters.value !== sliderValue
    ) {
      dispatch(
        handleSliderValue({ sliderValue: fieldSettingParameters.value })
      );
      dispatch(
        setQuestionValue({
          question_id: question?.question_id,
          value: fieldSettingParameters.value,
        })
      );
      setLocalSliderValue(questionValue[question?.question_id]);
    }
    const percentage = preview
      ? (((conditionalValues
          ? Number(conditionalValues[question.question_id.replaceAll("-", "_")])
          : localSliderValue) -
          (question?.field_range?.min || 0)) /
          ((question?.field_range?.max || 100) -
            (question?.field_range?.min || 0))) *
        100
      : ((sliderValue - minRange) / (maxRange - minRange)) * 100;
    setSliderPercentage(percentage);

    if (preview) {
      setValue((prev) => ({
        ...prev,
        [question?.question_id]: percentage,
      }));
    }
  }, [
    fieldSettingParameters?.value,
    sliderValue,
    localSliderValue,
    minRange,
    maxRange,
    preview,
    question?.field_range,
    question?.question_id,
    dispatch,
    setValue,
  ]);

  // Handle range slider changes and snap to the nearest multiple of incrementByValue
  const handleRange = (event) => {
    const newValue = parseInt(event.target.value, 10);

    // Round to the nearest multiple of incrementByValue
    let nearestMultiple =
      Math.round(newValue / incrementByValue) * incrementByValue;

    // Ensure the nearest multiple doesn't exceed the maxRange
    if (nearestMultiple > maxRange) {
      nearestMultiple =
        Math.floor(maxRange / incrementByValue) * incrementByValue;
    }

    // Ensure it doesn't go below the minRange
    if (nearestMultiple < minRange) {
      nearestMultiple = minRange;
    }

    // dispatch(handleSliderValue({ sliderValue: nearestMultiple }));
    if (preview) {
      setLocalSliderValue(newValue);
      dispatch(
        setQuestionValue({
          question_id: question?.question_id,
          value: nearestMultiple,
        })
      );
      const { section_name, page_name, label } = findSectionAndPageName(
        sections,
        question?.question_id
      );
      setConditionalValues((prevValues) => ({
        ...prevValues,
        [question?.question_id.replace(/-/g, "_")]: Number(newValue), // Add or update the label key with newValue
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
    const newValue = e.target.value;
    const invalidKeys = ["e"];
    if (invalidKeys.includes(e.key)) {
      e.preventDefault();
    }
    setConditionalValues((prevValues) => ({
      ...prevValues,
      [question?.question_id.replace(/-/g, "_")]: Number(newValue), // Add or update the label key with newValue
    }));
    setLocalSliderValue(newValue);
    dispatch(
      setQuestionValue({
        question_id: question?.question_id,
        value: newValue,
      })
    );
    setIsModified(!isModified);
    setValue((prev) => ({
      ...prev,
      [question?.question_id]: newValue,
    }));
    setValidationErrors((prevErrors) => ({
      ...prevErrors,
      preview_numberfield: "", // Or remove the key if you prefer
    }));
    dispatch(
      setFieldEditable({
        fieldId: question?.question_id,
        isEditable: true,
      })
    );
  };
  return (
    <div>
      <label
        data-testid="label-name"
        htmlFor={textId}
        title={preview ? question?.label : fieldSettingParameters?.label}
        maxLength={100}
        className={`font-medium text-base text-[#000000] overflow-hidden break-all block w-full max-w-[85%]  ${
          fieldSettingParameters?.label === "" ? "h-[20px]" : "h-auto"
        }`}
      >
        {preview ? question?.label : fieldSettingParameters?.label}
        {!question?.options?.optional && preview && (
          <span className="text-red-500">*</span>
        )}
      </label>
      {(!preview && fieldSettingParameters?.source === "entryfield") ||
      (!preview && fieldSettingParameters?.source === "both") ? (
        <input
          data-testid="input"
          type={type}
          id={textId}
          disabled={!preview}
          value={preview ? localSliderValue : ''}
          className={`w-full h-auto break-words border border-[#AEB3B7] rounded-lg ${
            question?.options?.read_only ? "bg-gray-50" : "bg-white"
          } py-3 px-4 ${
            preview ? "mt-1" : "mt-5"
          } outline-0 font-normal text-base text-[#2B333B] placeholder:text-base placeholder:font-base placeholder:text-[#9FACB9] ${className}`}
          placeholder={fieldSettingParameters?.placeholderContent}
          onChange={(e) => handleInputChange(e)}
        />
      ) : (preview && question?.source === "entryfield") ||
        (preview && question?.source === "both") ? (
        <div
          className={`flex border ${
            validationErrors?.preview_numberfield?.[question.question_id]
              ? "border-[#FFA318]"
              : "border-[#AEB3B7]"
          } rounded-lg items-center`}
        >
          {(question?.field_texts?.pre_field_text ||
            fieldSettingParameters?.preField) && (
            <p className={`w-1/5 max-w-[20%] break-all overflow-auto ml-2`}>
              {preview
                ? question?.field_texts?.pre_field_text
                : fieldSettingParameters?.preField}
            </p>
          )}
          <input
            data-testid="input"
            type={
              question?.type === "integer"
                ? "number"
                : question?.type === "float"
                ? "number"
                : question?.type === "rating"
                ? "range"
                : "text"
            }
            step={question?.type === "float" ? "any" : ""}
            min={preview ? question?.field_range?.min : minRange}
            max={preview ? question?.field_range?.max : maxRange}
            value={
              conditionalValues
                ? Number(
                    conditionalValues[question.question_id.replaceAll("-", "_")]
                  )
                : sliderValue
            }
            className={`w-full h-auto break-words  ${
              question?.options?.read_only ? "bg-gray-50" : "bg-white"
            } py-3 px-4 rounded-lg outline-0 font-normal text-base text-[#2B333B] placeholder:text-base placeholder:font-base placeholder:text-[#9FACB9]`}
            // onChange={(e) => handleInputChange(e)}
            placeholder={question?.placeholder_content}
            disabled={question?.options?.read_only || !preview}
            onChange={(e) => {
              const value = e.target.value;
              const numValue = parseFloat(value);
              const min = preview ? question?.field_range?.min : minRange;
              const max = preview ? question?.field_range?.max : maxRange;
              if (
                min === undefined ||
                max === undefined ||
                (numValue >= min && numValue <= max)
              ) {
                handleInputChange(e);
              }
            }}
            onKeyDown={(e) => {
              if (e.key === "e" || e.key === "E") e.preventDefault();
            }}
          />
          {(question?.field_texts?.post_field_text ||
            fieldSettingParameters?.postField) && (
            <p className={`w-1/5 max-w-[20%] break-all overflow-auto mr-2`}>
              {preview
                ? question?.field_texts?.post_field_text
                : fieldSettingParameters?.postField}
            </p>
          )}
        </div>
      ) : (
        ""
      )}
      {((preview
        ? question?.source === "slider"
        : fieldSettingParameters?.source === "slider") ||
        (preview
          ? question?.source === "both"
          : fieldSettingParameters?.source === "both")) && (
        <div data-testid="slider" className="">
          <div className="flex items-center w-full">
            <p
              className={`w-auto max-w-[20%] break-all overflow-auto mt-5 mr-2`}
            >
              {preview
                ? question?.field_texts?.pre_field_text
                : fieldSettingParameters?.preField}
            </p>
            <p
              className={`w-auto max-w-[10%] break-all overflow-auto mt-5 mr-2`}
            >
              {preview
                ? question?.field_range?.min
                : fieldSettingParameters?.min}
            </p>

            <div className="w-[60%]">
              <input
                type="range"
                min={preview ? question?.field_range?.min : minRange}
                max={preview ? question?.field_range?.max : maxRange}
                value={
                  conditionalValues
                    ? Number(
                        conditionalValues[
                          question.question_id.replaceAll("-", "_")
                        ]
                      )
                    : sliderValue
                }
                onChange={handleRange}
                maxLength={50}
                style={{
                  "--percent": `${sliderPercentage}%`,
                  // 'backgroundColor' : ''
                }}
                className="mt-6  w-full"
                data-testid="number-slider"
                disabled={question?.options?.read_only || !preview}
              />
            </div>
            <p
              className={`w-auto max-w-[10%] break-all overflow-auto mt-5 ml-2`}
            >
              {preview
                ? question?.field_range?.max
                : fieldSettingParameters?.max}
            </p>
            <p
              className={`w-auto max-w-[20%] break-all overflow-auto mt-5 ml-2`}
            >
              {preview
                ? question?.field_texts?.post_field_text
                : fieldSettingParameters?.postField}
            </p>
          </div>
          {!preview ? (
            <p className="font-normal text-sm text-[#2B333B] italic mt-4">
              Select Value:{" "}
              {fieldSettingParameters?.type === "float"
                ? sliderValue.toFixed(2)
                : sliderValue}
            </p>
          ) : (
            <p className="font-normal text-sm text-[#2B333B] italic mt-4">
              Select Value:{" "}
              {conditionalValues
                ? Number(
                    conditionalValues[question.question_id.replaceAll("-", "_")]
                  )
                : sliderValue}
            </p>
          )}
        </div>
      )}
      {question?.question_id &&
        validationErrors?.preview_numberfield &&
        validationErrors.preview_numberfield[question.question_id] && (
          <ErrorMessage
            error={validationErrors.preview_numberfield[question.question_id]}
          />
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

export default NumberField;
