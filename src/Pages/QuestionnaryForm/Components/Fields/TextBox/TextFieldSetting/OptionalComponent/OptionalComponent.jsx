import React, { useEffect, useState } from 'react';
import { setNewComponent } from '../../../fieldSettingParamsSlice';
import { useDispatch, useSelector } from 'react-redux';

function OptionsComponent({ selectedQuestionId }) {

    const dispatch = useDispatch();

    // Get the current field settings from Redux
    const fieldSettingParams = useSelector(state => state.fieldSettingParams.currentData);

    // List of options
    const options = [
        'Load from previously entered data',
        'Read only',
        'Visible',
        'Optional',
        'Remember allowed',
        'Field Validation',
    ];

    // Initialize the state for the toggles
    const [toggleStates, setToggleStates] = useState({
        'Load from previously entered data': false,
        'Read only': false,
        'Visible': false,
        'Optional': false,
        'Remember allowed': false,
        'Field Validation': false,
    });

    // Sync local state with Redux state when the component mounts or fieldSettingParams change
    useEffect(() => {
        console.log('useEffect triggered:', fieldSettingParams);
        if (fieldSettingParams) {
            setToggleStates({
                'Load from previously entered data': fieldSettingParams.Load_from_previous || false,
                'Read only': fieldSettingParams.Read_only || false,
                'Visible': fieldSettingParams.Visible || false,
                'Optional': fieldSettingParams.Optional || false,
                'Remember allowed': fieldSettingParams.Remember_allowed || false,
                'Field Validation': fieldSettingParams.Field_Validation || false,
            });
        }
    }, []);

    // ToggleSwitch Component
    const ToggleSwitch = ({ label, onChange, checked }) => {
        console.log(`${label} checked:`, checked);
        return (
            <div className="status custom-toggle-switch flex items-center justify-between">
                <p className="text-sm font-normal text-[#000000] mr-4 mt-3">
                    {label}
                </p>
                <label className="switch" style={{ marginLeft: '1px' }}>
                    <input type="checkbox" checked={checked} onChange={onChange} />
                    <span className="slider round mr-5 mt-1"></span>
                </label>
            </div>
        );
    };


    // Handle toggle click logic
    const handleToggleClick = (label) => {
        const newToggleStates = {
            ...toggleStates,
            [label]: !toggleStates[label],
        };
        setToggleStates(newToggleStates);

        console.log(newToggleStates, 'newToggleStates');

        // Prepare the object for the backend request
        const payload = {
            Load_from_previous: newToggleStates['Load from previously entered data'],
            Read_only: newToggleStates['Read only'],
            Visible: newToggleStates['Visible'],
            Optional: newToggleStates['Optional'],
            Remember_allowed: newToggleStates['Remember allowed'],
            Field_Validation: newToggleStates['Field Validation'],
        };

        // Dispatch the updated state to the store or backend
        dispatch(setNewComponent({
            id: 'options',
            value: payload,
            questionId: selectedQuestionId
        }));
    };

    return (
        <div className='mt-7 w-[97%]'>
            <p className='font-semibold text-base text-[#2B333B]'>Options</p>
            {options.map((option) => (
                <ToggleSwitch
                    key={option}
                    checked={toggleStates[option]}
                    label={option}
                    data-testid = {`${option}`}
                    onChange={() => handleToggleClick(option)}
                />
            ))}
        </div>
    );
}

export default OptionsComponent;
