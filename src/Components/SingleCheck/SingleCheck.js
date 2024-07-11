import React from 'react';

export default function SingleCheck ({
    id,
    searchParams,
    valueOf,
    singleCheckText,
    handleSearchParams,
    isLoading
}) {
    /**
     * The function `handleOnChangeCheckbox` updates the state by toggling the boolean value of a
     * specific checkbox identified by `valueOf` and `id`.
     */
    // const handleOnChangeCheckbox = () => {
    //     handleSearchParams(valueOf, id);
    // };
    // const getCheckedValue = () => {
    //     const params = Object.fromEntries(searchParams);
    //     if (params[valueOf]) {
    //         if (params[valueOf].split(',').includes(id)) {
    //             return true;
    //         } else {
    //             return false;
    //         }
    //     } else {
    //         return false;
    //     }
    // };
    return (

        <button className='bg-primary-normal px-6 py-1 rounded-8 text-[#ffffff] font-400 text-[14px]'>
            {singleCheckText}
        </button>

    // <div className="filter-checkbox checkbox relative">
    //     <input
    //         className=''
    //         type="checkbox"
    //         value={id}
    //         id={id}
    //         disabled={isLoading}
    //         checked={getCheckedValue()}
    //         onChange={() => handleOnChangeCheckbox()}
    //     />
    //     <label
    //         htmlFor={id}
    //         className={`inline-block pl-4 hover:cursor-pointer text-base font-normal text-neutral-primary capitalize
    //         ${isLoading ? 'opacity-50' : ''}`}
    //     >
    //         {checkboxText}
    //     </label>
    // </div>
    );
}
