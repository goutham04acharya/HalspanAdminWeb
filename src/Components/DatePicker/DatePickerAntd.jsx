import React from 'react';
import { DatePicker } from 'antd';
import Image from '../Image/Image';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import dayjs from 'dayjs';
dayjs.extend(customParseFormat);

const CustomDatePicker = ({ testID, label, handleStates, value, error, disabled, type }) => {
    const getDisabledDate = (current) => {
        return current && current > Date.now();
    };
    return (
        <div className=''>
            <p className='text-neutral-primary font-medium text-[14px] leading-4 mb-2'>{label}</p>
            <DatePicker
                disabled={disabled}
                className={`${disabled
                    ? 'custom-datepicker-disabled'
                    : error ? 'custom-datepicker-error' : 'custom-datepicker'} w-full`}
                autoComplete="off"
                data-testid={testID}
                placeholder="DD-MMM-YYYY"
                format={'DD-MMM-YYYY'}
                value={value && dayjs(value)}
                suffixIcon={<Image src='calendar'/>}
                disabledDate={type === 'dob' ? getDisabledDate : undefined}
                onChange={(date, dateString) => handleStates(date, type)}
            />
            {error && <div className='mt-2'><ErrorMessage error={error} /></div>}
        </div>
    );
};

export default CustomDatePicker;
