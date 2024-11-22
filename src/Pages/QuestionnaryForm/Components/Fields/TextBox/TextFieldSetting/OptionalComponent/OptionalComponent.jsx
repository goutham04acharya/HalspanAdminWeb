import React, { useEffect, useMemo, useState } from 'react';
import { setNewComponent } from '../../../fieldSettingParamsSlice';
import { useDispatch, useSelector } from 'react-redux';
import { setShouldAutoSave } from '../../../../QuestionnaryFormSlice';
import InfinateDropdown from '../../../../../../../Components/InputField/InfinateDropdown';
import useApi from '../../../../../../../services/CustomHook/useApi';
import objectToQueryString from '../../../../../../../CommonMethods/ObjectToQueryString';

function OptionsComponent({ selectedQuestionId, fieldSettingParameters, formStatus }) {

    const dispatch = useDispatch();
    const { getAPI } = useApi();
    const fieldSettingParams = useSelector(state => state.fieldSettingParams.currentData);
    const { assetType } = useSelector(state => state?.questionnaryForm)
    console.log(assetType, 'assetType')

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
            case 'filefield':
                return ['Visible', 'Optional', 'Remember allowed'];
            default:
                return ['Load from previously entered data', 'Read only', 'Visible', 'Optional', 'Remember allowed'];
        }
    };
    const [toggleStates, setToggleStates] = useState({});
    const [activeTab, setActiveTab] = useState('attributeData');
    const [isServiceRecordDropdownOpen, setServiceRecordDropdownOpen] = useState(false);
    const [isAttributeDropdownOpen, setIsAttributeDropdownOpen] = useState(false);
    const [isQuestionnariesDropdownOpen, setQuestionnariesDropdownOpen] = useState(false);
    const [attributeValue, setAttributeValue] = useState('')
    const [serviceValue, setServiceValue] = useState('')
    const [questionnairesList, setQuestionnairesList] = useState([])

    const fetchQuestionnaireList = async () => {
        const response = await getAPI(`questionnaires${objectToQueryString(assetType)}`);
        console.log(response?.data?.data?.items, 'response')
        setQuestionnairesList(response?.data?.data?.items);
    };

    const handleQuestionnarieList = useMemo(() => 
        questionnairesList.map(item => ({
            label: item.public_name,
            value: item.id, // or another unique identifier
        })), 
        [questionnairesList]
    );
    
    const handleServiceClick = (option) => {
        fetchQuestionnaireList()
        dispatch(setNewComponent({ id: 'service_record_lfp', value: option.value, questionId: selectedQuestionId }));
        setServiceRecordDropdownOpen(false);
        setServiceValue(option);

    };

    const handleAttributeClick = (option) => {
        dispatch(setNewComponent({ id: 'attribute_data_lfp', value: option.value, questionId: selectedQuestionId }));
        setIsAttributeDropdownOpen(false);
        // setAttributeValue(option)
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
        // fetchQuestionnaireList();
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
        // fetchQuestionnaireList();
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

    const handleTabClick = (tab) => {
        setActiveTab(tab)
        setServiceRecordDropdownOpen(false);
        setIsAttributeDropdownOpen(false);
        setServiceRecordDropdownOpen(false);
    };
    const componentType = fieldSettingParams?.[selectedQuestionId]?.componentType;

    const options = getOptions(componentType);
    return (
        <div className='mt-7 w-[97%]'>
            <p className='font-semibold text-base text-[#2B333B]'>Options</p>

            {/* Separate 'Load from previously entered data' toggle */}
            {options.includes('Load from previously entered data') && (
                <ToggleSwitch
                    key='Load from previously entered data'
                    checked={toggleStates['Load from previously entered data']}
                    label='Load from previously entered data'
                    testId='Load from previously entered data'
                    onChange={formStatus === 'Draft' ? () => handleToggleClick('Load from previously entered data') : null}
                />
            )}

            {/* Conditionally render the dropdown below the toggle */}
            {toggleStates['Load from previously entered data'] && options.includes('Load from previously entered data') && (
                <div className="mt-4">
                    <div className="flex justify-between border-b border-gray-300 mb-2">
                        <p
                            data-testid="attribute-data"
                            className={`font-semibold text-base cursor-pointer ${activeTab === 'attributeData' ? 'text-black border-b-2 border-[#000000] pb-2' : 'text-[#9FACB9]'}`}
                            onClick={formStatus === 'Draft' ? () => handleTabClick('attributeData') : null}
                        >
                            Attribute Data
                        </p>
                        <p
                            data-testid="service-record"
                            className={`font-semibold text-base cursor-pointer ${activeTab === 'serviceRecord' ? 'text-black border-b-2 border-[#000000] pb-2' : 'text-[#9FACB9]'}`}
                            onClick={formStatus === 'Draft' ? () => handleTabClick('serviceRecord') : null}
                        >
                            Service Record
                        </p>
                    </div>
                    {activeTab === 'attributeData' && (
                        <InfinateDropdown
                            id='format'
                            top='25px'
                            placeholder='Select'
                            className='w-full cursor-pointer placeholder:text-[#9FACB9] h-[45px] mt-2'
                            testID='select-attribute'
                            labeltestID='attribute'
                            selectedOption={attributes.find(option => option.value === fieldSettingParameters.attribute_data_lfp)}
                            handleOptionClick={handleAttributeClick}
                            isDropdownOpen={isAttributeDropdownOpen}
                            setDropdownOpen={setIsAttributeDropdownOpen}
                            options={attributes}
                            formStatus={formStatus}
                        />
                    )}
                    {activeTab === 'serviceRecord' && (
                        <InfinateDropdown
                            label='Service Record List'
                            labelStyle='font-semibold text-[#2B333B] text-base'
                            id='serviceRecord'
                            top='50px'
                            placeholder='Select'
                            className='w-full cursor-pointer placeholder:text-[#9FACB9] h-[45px] mt-2'
                            testID='select-service-record'
                            labeltestID='service-record'
                            selectedOption={serviceRecordOptions.find(option => option.value === fieldSettingParameters.service_record_lfp)}
                            handleOptionClick={formStatus === 'Draft' ? handleServiceClick : null}
                            isDropdownOpen={formStatus === 'Draft' ? isServiceRecordDropdownOpen : false}
                            setDropdownOpen={formStatus === 'Draft' ? setServiceRecordDropdownOpen : null}
                            options={serviceRecordOptions}
                            formStatus={formStatus}
                        />
                    )}
                    {(serviceValue !== '' && serviceValue !== undefined) && (
                        <InfinateDropdown
                            label='Questionnaire List'
                            labelStyle='font-semibold text-[#2B333B] text-base'
                            id='serviceRecord'
                            top='50px'
                            placeholder='Select'
                            className='w-full cursor-pointer placeholder:text-[#9FACB9] h-[45px] mt-2'
                            testID='select-service-record'
                            labeltestID='service-record'
                            selectedOption={handleQuestionnarieList.find(option => option.value === fieldSettingParameters.service_record_lfp)}
                            handleOptionClick={formStatus === 'Draft' ? handleServiceClick : null}
                            isDropdownOpen={formStatus === 'Draft' ? isQuestionnariesDropdownOpen : false}
                            setDropdownOpen={formStatus === 'Draft' ? setQuestionnariesDropdownOpen : null}
                            options={handleQuestionnarieList}
                            formStatus={formStatus}
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
                        onChange={formStatus === 'Draft' ? () => handleToggleClick(option) : null}
                    />
                ))}
        </div>
    );
}

export default OptionsComponent;

