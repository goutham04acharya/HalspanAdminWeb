/* eslint-disable security/detect-object-injection */
/* eslint-disable max-len */

import React from 'react';

export default function FilterCheckbox ({ id, filterValues, setFilterValues, valueOf, checkboxText }) {
    return (
        <div className="px-2 py-1 block min-h-[1.5rem] pl-[1.5rem]">
            <input
                className="checkbox"
                type="checkbox"
                value={id}
                id={id}
                checked={filterValues?.[valueOf]?.[checkboxText]}
                onClick={() => {
                    setFilterValues(prevState => ({
                        ...prevState,
                        [valueOf]: {
                            ...prevState?.[valueOf],
                            [checkboxText]: !prevState?.[valueOf]?.[checkboxText]
                        }
                    }));
                }}
            />
            <label
                for={id}
                className="inline-block pl-1 hover:cursor-pointer text-[14px] font-[400] text-neutral-primary">
                {checkboxText}
            </label>
        </div>
    );
}
