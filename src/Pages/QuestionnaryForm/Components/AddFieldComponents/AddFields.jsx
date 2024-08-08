import React from 'react'

const AddFields = ({ buttons, testId }) => {
    return (
        <div className="p-[34px] w-full">
            <p className='font-semibold text-[22px] text-[#2B333B] pb-[26px]'>Add Field</p>
            <div className='-mx-4 flex flex-wrap'>
                {buttons.map((button, index) => (
                    <div key={index} className='px-4 w-1/2'>
                        <button
                            data-testid={`${button?.testId}`}
                            className={`border border-[#2B333B] py-[14px] px-5 rounded text-base text-[#2B333B] font-semibold flex items-center w-full mb-[26px]`}
                        >
                            <div className='mr-4'>
                                <img src={button?.buttonIcon} alt="" />
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