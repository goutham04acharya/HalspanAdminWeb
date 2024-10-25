import React from 'react'
import CommonComponents from '../../../CommonComponents/CommonComponents'
import { useSelector } from 'react-redux'

function ComplianceFieldSetting({ complianceLogic, setComplianceLogic, setCompliancestate }) {
    const { complianceLogicId } = useSelector(state => state?.questionnaryForm)

    const handleInputChange = (id, value) => {
        let arr = [...complianceLogic]
        arr[id].label = value;
        setComplianceLogic(arr)
    }
    return (
        <div data-testid="field-settings" className='py-[34px] px-[32px] h-customh10'>
            {/* {complianceLogic.length > 0 && */}
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
                                // id={labelID}
                                className='mt-[11px] border border-[#AEB3B7] rounded py-[11px] px-4 font-normal text-base text-[#2B333B] placeholder:text-[#9FACB9] outline-0'
                                // placeholder={labelPlaceholder}
                                onChange={(e) => handleInputChange(complianceLogicId, e.target.value)}
                                value={complianceLogic[complianceLogicId].label}
                            // id='label'
                            // onBlur={(e) => handleBlur(e)}
                            // data-testid="label-name-input"
                            // maxLength={100}
                            // onFocus={() => {
                            //     console.log('focus');
                            //     if (setFocusInput) {
                            //         setFocusInput('');
                            //     }
                            // }}
                            />
                        </div>
                        <div className='flex flex-col justify-start mt-7 w-full relative'>
                            <label htmlFor="Label" className='font-semibold text-base text-[#2B333B]'>Default Content</label>
                            <div className='relative w-full'>
                                <input type="text" id='Label' className='mt-[11px] w-full border border-[#AEB3B7] rounded py-[11px] pl-4 pr-11 font-normal text-base text-[#2B333B] placeholder:text-[#9FACB9] outline-0'
                                    placeholder='Populates the content' />
                                <img src="/Images/setting.svg" alt="setting" onClick={() => setCompliancestate(true)} className='absolute top-5 right-3 cursor-pointer' />
                            </div>
                        </div>
                    </div>
                </div>
            {/* } */}

        </div>)
}

export default ComplianceFieldSetting