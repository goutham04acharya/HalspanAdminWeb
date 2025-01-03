import React, { useRef, useState } from 'react'
import ErrorMessage from '../ErrorMessage/ErrorMessage'
import { DateCalendar } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import './Datepicker.css';
import useOnClickOutside from '../../CommonMethods/outSideClick';
import { formatDate } from '../../CommonMethods/FormatDate';

const DatePicker = ({
    autoComplete,
    label,
    id,
    type,
    value,
    className,
    testId,
    htmlFor,
    validationError,
    handleChange,
    mandatoryField,
    labelStyle,
    optional,
    prefixValue,
    mainIndex,
    subIndex,
    placeholder
}) => {


    const [open, setOpen] = useState(false)
    const calederRef = useRef()
    useOnClickOutside(calederRef, () => setOpen(false))
    return (
        <div className='w-full relative' ref={calederRef} >
            <div className='relative' onClick={() => setOpen(!open)}>
                <input
                    readOnly
                    autoComplete={autoComplete || 'off'}
                    htmlFor={htmlFor}
                    id={id}
                    type={type}
                    placeholder={placeholder || null}
                    value={value ? formatDate(value) : ''}
                    className={`placeholder:text-[#9FACB9] placeholder:font-normal placeholder:text-base cursor-pointer
                     py-[11px] ${type === 'password' ? 'pr-[62px]' : ''} ${prefixValue ? 'pl-[26%] pr-[10px]' : 'pl-[10px] pr-[10px]'}}
                    font-normal text-base leading-[22px] focus:outline-none border border-[#AEB3B7]
                    ${validationError ? 'border border-[#FFA318]' : 'border border-[#AEB3B7]'} ${className} rounded `}
                    data-testid={testId}
                />
                <img src="/Images/calendarField.svg" className='cursor pointer absolute top-2.5 right-3' alt="ggtgtg" data-testid={`${testId}-calendar`} />
            </div>
            {validationError && <ErrorMessage error={validationError} />}
            <div className='bg-white w-full'>
                {open && <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DateCalendar value={value} showDaysOutsideCurrentMonth onChange={e => handleChange(e, mainIndex, subIndex)} />
                </LocalizationProvider>}
            </div>
        </div>
    )
}

export default DatePicker