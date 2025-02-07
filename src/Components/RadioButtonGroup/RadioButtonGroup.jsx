import React, { useState } from 'react';
import { setQuestionValue } from '../../Pages/QuestionnaryForm/Components/previewQuestionnaireValuesSlice';
import { useDispatch } from 'react-redux';

const RadioButtonGroup = ({ values, onChange, question, questionValue }) => {
    const dispatch = useDispatch();

    const handleChange = (event, uniqueKey) => {
        const newValue = {
            key: uniqueKey,
            value: event.target.value,
        };
        dispatch(setQuestionValue({ question_id: question?.question_id, value: newValue }));
        onChange(newValue);
    };

    return (
        <div className="space-y-2 mt-4">
            <div className="space-y-2 mt-4 flex flex-col relative">
                {values?.map((option, index) => {
                    const uniqueKey = option?.id || option?.uuid || option?.index || index; // Determine unique key
                    const isChecked = questionValue?.[question?.question_id]?.key === uniqueKey; // Check based on uniqueKey
                    return (
                        <label
                            key={uniqueKey}
                            className="flex items-center cursor-pointer group space-x-2"
                        >
                            <div className="relative flex items-center">
                                <input
                                    type="radio"
                                    value={option?.value}
                                    checked={isChecked}
                                    onChange={(e) => handleChange(e, uniqueKey)}
                                    className="absolute w-0 h-0 opacity-0"
                                />
                                <div className="w-5 h-5 border-2 border-[#2B333B] rounded-full">
                                    {isChecked && (
                                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-[#2B333B] rounded-full" />
                                    )}
                                </div>
                            </div>
                            <span data-testid={`choices-${index}`} className="text-sm text-gray-700">{option?.value}</span>
                        </label>
                    );
                })}
            </div>
        </div>
    );
};

export default RadioButtonGroup;
