import React, { useState } from 'react';

function DateTimeInput({
    textId,
    className,
    value,
    onDateTimeChange,
    placeholderDate = 'dd/mm/yyyy',
    placeholderTime = 'hh:mm:ss',
    question
}) {
    const [date, setDate] = useState(value ? value.split(' ')[0] : ''); // Extracts date part
    const [time, setTime] = useState(value ? value.split(' ')[1] : ''); // Extracts time part

    const handleDateChange = (e) => {
        const newDate = e.target.value;
        setDate(newDate);
        onDateTimeChange(newDate, time); // Passes both date and time to parent
    };

    const handleTimeChange = (e) => {
        const newTime = e.target.value;
        setTime(newTime);
        onDateTimeChange(date, newTime); // Passes both date and time to parent
    };

    return (
        <div className="flex flex-wrap w-full">
            <input
                data-testid="input-date"
                type="date"
                id={textId}
                value={date}
                className={`w-full md:w-[60%] h-[40px] break-words border border-[#AEB3B7] rounded-md mt-2 bg-white py-3 px-4 outline-0 font-normal text-[14px] text-[#2B333B] placeholder:text-base placeholder:font-base placeholder:text-[#9FACB9] ${className}`}
                placeholder={placeholderDate}
                onChange={handleDateChange}
            />
            <input
                type="time"
                data-testid="input-time"
                className={`custom-time-input w-full md:w-[35%] ml-2 h-[40px] break-words border border-[#AEB3B7] rounded-md mt-2 py-3 px-[18px] font-normal text-[14px] text-[#2B333B] placeholder:text-base placeholder:font-base placeholder:text-[#9FACB9] ${className}`}
                value={time}
                placeholder={placeholderTime}
                onChange={handleTimeChange}
            />
        </div>
    );
}

export default DateTimeInput;
