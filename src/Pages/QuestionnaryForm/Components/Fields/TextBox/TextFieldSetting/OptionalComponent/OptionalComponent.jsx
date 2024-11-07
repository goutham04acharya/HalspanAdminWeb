import React, { useEffect, useState } from 'react';
import { setNewComponent } from '../../../fieldSettingParamsSlice';
import { useDispatch, useSelector } from 'react-redux';
import { setShouldAutoSave } from '../../../../QuestionnaryFormSlice';
import InputWithDropDown from '../../../../../../../Components/InputField/InputWithDropDown';

function OptionsComponent({ selectedQuestionId, fieldSettingParameters }) {

    const dispatch = useDispatch();
    const fieldSettingParams = useSelector(state => state.fieldSettingParams.currentData);

    const getOptions = (componentType) => {
        switch (componentType) {
            case 'textboxfield':
                return ['Load from previously entered data', 'Read only', 'Visible', 'Optional', 'Remember allowed', 'Field validation'];
            case 'photofield':
            case 'tagScanfield':
                return ['Visible', 'Optional'];
            case 'displayfield':
                return ['Visible'];
            case 'videofield':
            case 'gpsfield':
                return ['Visible', 'Optional', 'Remember allowed'];
            default:
                return ['Load from previously entered data', 'Read only', 'Visible', 'Optional', 'Remember allowed'];
        }
    };

    const [toggleStates, setToggleStates] = useState({});
    const [activeTab, setActiveTab] = useState('attributeData');
    const [isServiceRecordDropdownOpen, setServiceRecordDropdownOpen] = useState(false);
    const [isAttributeDropdownOpen, setIsAttributeDropdownOpen] = useState(false);

    const handleServiceClick = (option) => {
        dispatch(setNewComponent({ id: 'service_record_lfp', value: option.value, questionId: selectedQuestionId }));
        setIsAttributeDropdownOpen(false);
    };

    const handleAttributeClick = (option) => {
        dispatch(setNewComponent({ id: 'attribute_data_lfp', value: option.value, questionId: selectedQuestionId }));
        setServiceRecordDropdownOpen(false);
    };

    const attributes = [
        { value: 'Height', label: 'Height' },
        { value: 'Width', label: 'Width' },
        { value: 'Finish', label: 'Finish' },
    ];

    const serviceRecordOptions = [
        { value: 'Last Inspection', label: 'Last Inspection' },
        { value: 'Maintenance Log', label: 'Maintenance Log' },
        { value: 'Repair History', label: 'Repair History' },
    ];

    useEffect(() => {
        if (fieldSettingParams[selectedQuestionId]) {
            setToggleStates({
                'Load from previously entered data': fieldSettingParams[selectedQuestionId]?.options?.load_from_previous || false,
                'Read only': fieldSettingParams[selectedQuestionId]?.options?.read_only || false,
                'Visible': fieldSettingParams[selectedQuestionId]?.options?.visible || false,
                'Optional': fieldSettingParams[selectedQuestionId]?.options?.optional || false,
                'Remember allowed': fieldSettingParams[selectedQuestionId]?.options?.remember_allowed || false,
                'Field validation': fieldSettingParams[selectedQuestionId]?.options?.field_validation || false,
            });
        }
    }, [fieldSettingParams, selectedQuestionId]);

    const ToggleSwitch = ({ label, onChange, checked, testId }) => (
        <div className="status custom-toggle-switch flex items-center justify-between mt-2">
            <p className="text-base font-normal text-[#000000] mr-4">
                {label}
            </p>
            <label className="switch" style={{ marginLeft: '1px' }}>
                <input type="checkbox" checked={checked} onChange={onChange} />
                <span data-testid={testId} className="slider round mr-5"></span>
            </label>
        </div>
    );

    const handleToggleClick = (label) => {
        const newToggleStates = {
            ...toggleStates,
            [label]: !toggleStates[label],
        };
        setToggleStates(newToggleStates);

        const payload = {
            load_from_previous: newToggleStates['Load from previously entered data'],
            read_only: newToggleStates['Read only'],
            visible: newToggleStates['Visible'],
            optional: newToggleStates['Optional'],
            remember_allowed: newToggleStates['Remember allowed'],
            field_validation: newToggleStates['Field validation'],
        };
        dispatch(setNewComponent({
            id: 'options',
            value: payload,
            questionId: selectedQuestionId,
        }));
        dispatch(setShouldAutoSave(true));
    };

    const handleTabClick = (tab) => setActiveTab(tab);
    const componentType = fieldSettingParams?.[selectedQuestionId]?.componentType;
    const options = getOptions(componentType);
    console.log(toggleStates,'lllll')
    return (
        <div className='mt-7 w-[97%]'>
            <p className='font-semibold text-base text-[#2B333B]'>Options</p>

            {/* Separate 'Load from previously entered data' toggle */}
            <ToggleSwitch
                key='Load from previously entered data'
                checked={toggleStates['Load from previously entered data']}
                label='Load from previously entered data'
                testId='Load from previously entered data'
                onChange={() => handleToggleClick('Load from previously entered data')}
            />

            {/* Conditionally render the dropdown below the toggle */}
            {toggleStates['Load from previously entered data'] && (
                <div className="mt-4">
                    <div className="flex justify-between border-b border-gray-300 mb-2">
                        <p
                            data-testid="attribute-data"
                            className={`font-semibold text-base cursor-pointer ${activeTab === 'attributeData' ? 'text-black border-b-2 border-[#000000] pb-2' : 'text-[#9FACB9]'}`}
                            onClick={() => handleTabClick('attributeData')}
                        >
                            Attribute Data
                        </p>
                        <p
                            data-testid="service-record"
                            className={`font-semibold text-base cursor-pointer ${activeTab === 'serviceRecord' ? 'text-black border-b-2 border-[#000000] pb-2' : 'text-[#9FACB9]'}`}
                            onClick={() => handleTabClick('serviceRecord')}
                        >
                            Service Record
                        </p>
                    </div>
                    {activeTab === 'attributeData' && (
                        <InputWithDropDown
                            id='format'
                            top='25px'
                            placeholder='Select'
                            className='w-full cursor-pointer placeholder:text-[#9FACB9] h-[45px] mt-2'
                            testID='select-attribute'
                            labeltestID='attribute'
                            selectedOption={attributes.find(option => attributes.value === fieldSettingParameters?.attribute_data_lfp)}
                            handleOptionClick={handleAttributeClick}
                            isDropdownOpen={isAttributeDropdownOpen}
                            setDropdownOpen={setIsAttributeDropdownOpen}
                            options={attributes}
                        />
                    )}
                    {activeTab === 'serviceRecord' && (
                        <InputWithDropDown
                            label='Service Record List'
                            labelStyle='font-semibold text-[#2B333B] text-base'
                            id='serviceRecord'
                            top='50px'
                            placeholder='Select'
                            className='w-full cursor-pointer placeholder:text-[#9FACB9] h-[45px] mt-2'
                            testID='select-service-record'
                            labeltestID='service-record'
                            selectedOption={serviceRecordOptions.find(option => serviceRecordOptions.value === fieldSettingParameters?.service_record_lfp)}
                            handleOptionClick={handleServiceClick}
                            isDropdownOpen={isServiceRecordDropdownOpen}
                            setDropdownOpen={setServiceRecordDropdownOpen}
                            options={serviceRecordOptions}
                        />
                    )}
                </div>
            )}

            {/* Render other toggles below the dropdown */}
            {options
                .filter(option => option !== 'Load from previously entered data')
                .map(option => (
                    <ToggleSwitch
                        key={option}
                        checked={toggleStates[option]}
                        label={option}
                        testId={option}
                        onChange={() => handleToggleClick(option)}
                    />
                ))}
        </div>
    );
}

export default OptionsComponent;

