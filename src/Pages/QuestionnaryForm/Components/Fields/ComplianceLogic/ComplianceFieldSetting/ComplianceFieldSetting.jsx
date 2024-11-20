import React from 'react'
import { useSelector } from 'react-redux'
import { defaultContentConverter } from '../../../../../../CommonMethods/defaultContentConverter';
import { setSelectedQuestionId } from '../../../QuestionnaryFormSlice';
import { useDispatch } from 'react-redux';

function ComplianceFieldSetting({ complianceLogic, setComplianceLogic, setCompliancestate, formStatus }) {
    const { complianceLogicId } = useSelector(state => state?.questionnaryForm)
    const dispatch = useDispatch();

    const handleInputChange = (id, field, value) => {
        let arr = [...complianceLogic];
        arr[id][field] = value; // Dynamically update field
        setComplianceLogic(arr);
    };
    return (
        <div data-testid="field-settings" className='py-[34px] px-[32px] h-customh10'>
            <div>
                <p className='font-semibold text-[#2B333B] text-[22px]'>Field settings</p>
                <div className='mt-[14px] h-customh9 overflow-auto default-sidebar'>
                    <div className='flex flex-col justify-start'>
                        <label
                            // htmlFor={labelID}
                            className='font-semibold text-base text-[#2B333B]'>Label
                        </label>
                        <input
                            type="text"
                            data-testid="label-name-input"
                            disabled={formStatus !== 'Draft'}
                            className='mt-[11px] border border-[#AEB3B7] rounded py-[11px] px-4 font-normal text-base text-[#2B333B] placeholder:text-[#9FACB9] outline-0'
                            onChange={(e) => handleInputChange(complianceLogicId, 'label', e.target.value)}
                            value={complianceLogic[complianceLogicId]?.label}
                        />
                    </div>
                    <div className='flex flex-col justify-start mt-7 w-full relative'>
                        <label htmlFor="Label" className='font-semibold text-base text-[#2B333B]'>Default Content</label>
                        <div className='relative w-full'>
                            <input type="text" id='Label'
                                onChange={(e) => handleInputChange(complianceLogicId, 'default_content', e.target.value)}
                                value={complianceLogic[complianceLogicId]?.default_content
                                    ? defaultContentConverter(complianceLogic[complianceLogicId].default_content)
                                    : ''}
                                disabled={formStatus !== 'Draft'}
                                className='mt-[11px] w-full border border-[#AEB3B7] rounded py-[11px] pl-4 pr-11 font-normal text-base text-[#2B333B] placeholder:text-[#9FACB9] outline-0'
                                data-testid="default-value-input"
                                placeholder='Populates the content' />
                            <img src="/Images/setting.svg" 
                            alt="setting" 
                            disabled={formStatus!= 'Draft'}
                            onClick={formStatus === 'Draft' ? () => {
                                setCompliancestate(true)
                                dispatch(setSelectedQuestionId(''))}
                                : null}
                            className={`absolute top-5 right-3 cursor-pointer ${formStatus === 'Draft' ? 'cursor-pointer' : 'cursor-not-allowed'}`}
                                data-testid='default-value' />
                        </div>
                    </div>
                </div>
            </div>
        </div>)
}

export default ComplianceFieldSetting