import React from 'react'

const AddFields = ({ buttons, testId , handleClick, formStatus, disableButtons}) => {
    return (
        <div className="p-[34px] w-full h-customh15 overflow-auto default-sidebar">
            <p data-testid="add-field" className='font-semibold text-[22px] text-[#2B333B] pb-[26px]'>Add Field</p>
            <div className='-mx-4 flex flex-wrap'>
                {buttons.map((button, index) => (
                    <div key={index} className='px-4 w-1/2'>
                        <button
                            data-testid={`${button?.testId}`}
                            disabled={formStatus !== 'Draft' || disableButtons.includes(button?.buttonName)}
                            className={`disabled:cursor-not-allowed cursor-pointer  border border-[#2B333B] bg-white hover:bg-[#EFF1F8] py-[14px] px-5 rounded text-base text-[#2B333B] font-semibold flex items-center w-full mb-[26px]`}
                            onClick={() => handleClick(button.onClick)}
                        >
                            <div className='mr-4'>
                                <img src={button?.buttonIcon} alt="" className='w-6 h-6' />
                            </div>
                            {button?.buttonName}
                        </button>
                    </div>
                ))}
            </div>
        </div>

    )
}

export default AddFields