import React, { useRef, useState } from 'react';
import useOnClickOutside from '../../CommonMethods/outSideClick';

const TimePicker = ({ onChange, format, setErrorMessage, questionValue, validationErrors }) => {
    const [time, setTime] = useState('');
    const [isDropdownOpen, setIsDropdown] = useState(false);
    const [hour, setHour] = useState('');
    const [minute, setMinute] = useState('');
    const [second, setSecond] = useState('');
    const [meridian, setMeridian] = useState('AM');

    const hours = format === "24"
        ? Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'))
        : Array.from({ length: 12 }, (_, i) => (i === 0 ? 1 : i + 1).toString().padStart(2, '0'));
    const minutes = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));
    const seconds = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));
    const meridians = ['AM', 'PM'];
    const dropdownRef = useRef();

    const handleHourChange = (selectedHour) => {
        const updatedHour = selectedHour.padStart(2, '0');
        setHour(updatedHour);
        updateAndNotifyTime(updatedHour, minute, second, meridian);
    };

    const handleMinuteChange = (selectedMinute) => {
        const updatedMinute = selectedMinute.padStart(2, '0');
        setMinute(updatedMinute);
        updateAndNotifyTime(hour, updatedMinute, second, meridian);
    };

    const handleSecondChange = (selectedSecond) => {
        const updatedSecond = selectedSecond.padStart(2, '0');
        setSecond(updatedSecond);
        updateAndNotifyTime(hour, minute, updatedSecond, meridian);
    };

    const handleMeridianChange = (selectedMeridian) => {
        setMeridian(selectedMeridian);
        if (format === "12") {
            updateAndNotifyTime(hour, minute, second, selectedMeridian);
        }
    };

    const updateAndNotifyTime = (updatedHour, updatedMinute, updatedSecond, updatedMeridian) => {
        if (updatedHour && updatedMinute && updatedSecond) {
            const newTime =
                format === "24"
                    ? `${updatedHour}:${updatedMinute}:${updatedSecond}`
                    : `${updatedHour}:${updatedMinute}:${updatedSecond} ${updatedMeridian}`;
            setTime(newTime);
            onChange(newTime);
        }
    };
    const handleTimeChange = (e) => {
        const selectedTime = e.target.value.trim();

        // Split the input into parts
        const parts = selectedTime.split(/[:\s]/);
        const [inputHour, inputMinute, inputSecond, inputMeridian] = parts;

        // Validation functions for each part
        const isValidHour = inputHour === '' ||
            (format === "24"
                ? /^[0-1]?[0-9]$|^2[0-3]$/.test(inputHour)
                : /^[0]?[1-9]$|^1[0-2]$/.test(inputHour));
        const isValidMinute = inputMinute === '' || /^[0-5]?[0-9]$/.test(inputMinute);
        const isValidSecond = inputSecond === '' || /^[0-5]?[0-9]$/.test(inputSecond);
        const isValidMeridian = format === "12"
            ? (inputMeridian === '' || /^(AM|PM)$/i.test(inputMeridian))
            : true;

        // Check if all parts are valid
        if (isValidHour && isValidMinute && isValidSecond && isValidMeridian) {
            // Update state for each part
            setHour(inputHour || '');
            setMinute(inputMinute || '');
            setSecond(inputSecond || '');
            if (format === "12") {
                setMeridian(inputMeridian?.toUpperCase() || 'AM');
            }

            // Construct the updated time string
            const updatedTime = format === "24"
                ? `${inputHour || '00'}:${inputMinute || '00'}:${inputSecond || '00'}`
                : `${inputHour || '00'}:${inputMinute || '00'}:${inputSecond || '00'} ${inputMeridian?.toUpperCase() || 'AM'}`;

            setTime(updatedTime);
            onChange(updatedTime);
        }
    };



    const handleKeyDown = (e) => {
        // Allow control keys, numbers, and colon only
        const allowedKeys = ['Backspace', 'ArrowLeft', 'ArrowRight', 'Tab', ':'];
        const isNumberKey = /^[0-9]$/.test(e.key);
        if (!isNumberKey && !allowedKeys.includes(e.key)) {
            e.preventDefault();
        }
    };


    useOnClickOutside(dropdownRef, () => {
        setIsDropdown(false);
    });

    return (
        <div className="time-picker w-full flex flex-col text-[#2B333B] relative">
            <style>
                {`
                    .custom-time-input {
                        border: 1px solid ${validationErrors ? '#FFA318' : '#AEB3B7'};
                        border-radius: 0.375rem;
                        width: 100%;
                        outline: #AEB3B7;
                    }

                    .custom-time-input:focus {
                        border-color: #AEB3B7;
                        box-shadow: none;
                    }

                    .custom-time-input::-webkit-calendar-picker-indicator {
                        background: none;
                        display: none;
                    }

                    .time-icon {
                        position: absolute;
                        right: 1.1rem;
                        top: 50%;
                        transform: translateY(-50%);
                        width: 1rem;
                        height: 1rem;
                        color: #2B333B;
                        pointer-events: none;
                    }
                `}
            </style>
            <div className="relative w-full">
                <input
                    type="text"
                    className={`custom-time-input py-2 px-[18px] text-[#2B333B]`}
                    value={time || questionValue || (format === "24" ? "hh:mm:ss" : "hh:mm:ss AM/PM")}
                    // readOnly // Prevent direct editing
                    onChange={handleTimeChange}
                    data-testid='time-field'
                    onKeyDown={handleKeyDown}
                    onClick={() => setIsDropdown(!isDropdownOpen)}
                    placeholder={format === "24" ? "hh:mm:ss" : "hh:mm:ss AM/PM"}
                />
                <img
                    src="/Images/clock-primary.svg"
                    alt="clock"
                    className="time-icon"
                />
            </div>
            {isDropdownOpen && (
                <div ref={dropdownRef} className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg z-[99]">
                    <div className={`grid ${format === "24" ? "grid-cols-3" : "grid-cols-4"} divide-x divide-gray-200`}>
                        <div className="max-h-48 overflow-y-auto scrollBar">
                            {hours.map((h) => (
                                <div
                                    key={h}
                                    onClick={() => handleHourChange(h)}
                                    className={`px-4 py-2 cursor-pointer hover:bg-gray-300 
                                        ${h === hour ? 'bg-gray-200 text-[#2B333B]' : 'text-[#2B333B]'}`}
                                        data-testid={`h-${h}`}
                                >
                                    {h}
                                </div>
                            ))}
                        </div>
                        <div className="max-h-48 overflow-y-auto scrollBar">
                            {minutes.map((m) => (
                                <div
                                    key={m}
                                    onClick={() => handleMinuteChange(m)}
                                    className={`px-4 py-2 cursor-pointer hover:bg-gray-300
                                        ${m === minute ? 'bg-gray-200 text-[#2B333B]' : 'text-[#2B333B]'}`}
                                        data-testid={`m-${m}`}
                                >
                                    {m}
                                </div>
                            ))}
                        </div>
                        <div className="max-h-48 overflow-y-auto scrollBar">
                            {seconds.map((s) => (
                                <div
                                    key={s}
                                    onClick={() => handleSecondChange(s)}
                                    className={`px-4 py-2 cursor-pointer hover:bg-gray-300 
                                        ${s === second ? 'bg-gray-200 text-[#2B333B]' : 'text-[#2B333B]'}`}
                                        data-testid={`s-${s}`}
                                >
                                    {s}
                                </div>
                            ))}
                        </div>
                        {format === "12" && (
                            <div className="max-h-48 overflow-y-auto scrollBar">
                                {meridians.map((m) => (
                                    <div
                                        key={m}
                                        onClick={() => handleMeridianChange(m)}
                                        className={`px-4 py-2 cursor-pointer hover:bg-gray-300 
                                            ${m === meridian ? 'bg-gray-200 text-[#2B333B]' : 'text-[#2B333B]'}`}
                                            data-testid={`${m}`}
                                    >
                                        {m}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default TimePicker;
