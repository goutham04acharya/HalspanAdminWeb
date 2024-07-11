/* eslint-disable max-len */
import React, { useRef, useState } from 'react';
import Image from '../Image/Image';
import { Tooltip } from 'react-tooltip';
import { useOnClickOutside } from '../../CommonMethods/outsideClick';
import FilterCheckbox from '../FilterCheckbox/FilterCheckbox';
import SingleTickButton from '../SingleTickButton/SingleTickButton';

const FilterWithSingleOption = ({
    filterOptions,
    filterType,
    handleClearFilter,
    searchParams,
    setSearchParams,
    isLoading,
    filterActive,
    filterOptionOne,
    filterOptionTwo,
    filterOptionThree,
    handleSearchParamValue
}) => {
    const filterDiv = useRef();

    const [isFilterOpen, setIsFilterOpen] = useState(false);

    useOnClickOutside(filterDiv, () => {
        setIsFilterOpen(false);
    });
    return (
        <div ref={filterDiv} className="z-1">
            <Image
                src={`${filterActive ? 'active_' : ''}filter_icon`}
                testId='filter-tab'
                className={'filter_icon absolute top-1/2 -translate-y-1/2 right-6 cursor-pointer'}
                onClick={() => { setIsFilterOpen(prevState => !prevState); }}
            />
            <Tooltip
                className='my-tooltip'
                anchorSelect=".filter_icon"
                place="left"
                content="Filter"
            />
            {isFilterOpen && <div className='relative z-[12]'>
                <div data-testid='filter-modal' className="absolute top-[10px] right-2 rounded-[8px] z-[999] bg-white border border-neutral-outline text-[14px] leading-[24px] text-neutral-primary">
                    <div className='p-4 flex justify-between border-b border-neutral-outline'>
                        <div className='font-semibold'>
                            {filterType}
                        </div>
                        <button data-testid="clear-filter" onClick={() => { setIsFilterOpen(false); handleClearFilter(); } } className='font-[400]'>
                            Clear
                        </button>
                    </div>
                    <div className='p-4'>
                        {filterOptionOne && Object.keys(filterOptionOne).map((key) => ( // go through the number of keys  (for eg role, status)
                            <div key={key}>
                                <div className='font-semibold mb-2 capitalize'>
                                    {key}
                                </div>
                                <div className='flex gap-10'>
                                    {filterOptionOne[key].map((option) => ( // in a key number of options (active, inactive)
                                        <SingleTickButton
                                            singleCheckText={option} // active
                                            key={option} // active
                                            searchParams={searchParams}
                                            setSearchParams={setSearchParams}
                                            isSelected={searchParams.get('citizen') === option?.toLowerCase()}
                                            isLoading={isLoading}
                                            dataTestId={option}
                                        />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className='p-4'>
                        { Object.keys(filterOptionTwo).map((key) => ( // go through the number of keys  (for eg role, status)
                            <div key={key}>
                                <div className='font-semibold mb-2 capitalize'>
                                    {key === 'simplifiedkyc' ? 'Simplified KYC' : key === 'fullkyc' ? 'Full KYC' : key}
                                </div>
                                <div className='flex gap-10'>
                                    {filterOptionTwo[key].map((option) => ( // in a key number of options (active, inactive)
                                        <FilterCheckbox
                                            key={option} // active
                                            id={option} // active
                                            valueOf={key} // status
                                            checkboxText={option} // active
                                            handleSearchParams={handleSearchParamValue}
                                            searchParams={searchParams}
                                            isLoading={isLoading}

                                        />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                    { searchParams.get('citizen') !== 'non malawi citizen' && <div className='p-4'>
                        { Object.keys(filterOptionThree).map((key) => ( // go through the number of keys  (for eg role, status)
                            <div key={key}>
                                <div className='font-semibold mb-2 capitalize'>
                                    {key === 'simplifiedkyc' ? 'Simplified KYC' : key === 'fullkyc' ? 'Full KYC' : key}
                                </div>
                                <div className='flex gap-10'>
                                    {filterOptionThree[key].map((option) => ( // in a key number of options (active, inactive)
                                        <FilterCheckbox
                                            isLoading={isLoading}
                                            key={option} // active
                                            id={`Simplifiedkyc_${option}`} // active
                                            valueOf={key} // status
                                            checkboxText={option} // active
                                            handleSearchParams={handleSearchParamValue}
                                            searchParams={searchParams}
                                        />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                    }
                </div>
            </div>
            }
        </div>
    );
};

export default FilterWithSingleOption;
