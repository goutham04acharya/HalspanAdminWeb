import React, { useRef, useState } from 'react';
import useOnClickOutside from '../../CommonMethods/outSideClick';

const TimePicker = ({ onChange, format, setErrorMessage }) => {
    const [time, setTime] = useState('');
    const [isDropdownOpen, setIsDropdown] = useState(false);
    const [hour, setHour] = useState('');
    const [minute, setMinute] = useState('');
    const [second, setSecond] = useState('');

    const hours = format === "24" 
        ? Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0')) 
        : Array.from({ length: 12 }, (_, i) => i.toString().padStart(2, '0'));
    const minutes = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));
    const seconds = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));
    const dropdownRef = useRef();

    const handleTimeChange = (e) => {
        const selectedTime = e.target.value;
        console.log(selectedTime, 'selected time')
        const [hour, minute, second] = selectedTime.split(':');
        setHour(hour);
        setMinute(minute);
        setSecond(second);
        if (hour && minute && second) {
            setTime(`${hour}:${minute}:${second}`);
            onChange(time);
        }
    };

    const handleHourChange = (hour) => {
        setHour(hour);
        updateAndNotifyTime(hour, minute, second);
    };

    const handleMinuteChange = (minute) => {
        setMinute(minute);
        updateAndNotifyTime(hour, minute, second);
    };

    const handleSecondChange = (second) => {
        setSecond(second);
        updateAndNotifyTime(hour, minute, second);
    };

    const updateAndNotifyTime = (hour, minute, second) => {
        if (hour && minute && second) {
            const newTime = `${hour}:${minute}:${second}`;
            setTime(newTime);
            console.log(newTime, 'new time')
            onChange(newTime);
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
                       
                        border: 1px solid #AEB3B7;
                        border-radius: 0.375rem;
                        width: 100%;
                        outline: #AEB3B7;
                        
                    }

                    .custom-time-input:focus {
                        border-color: transparent;
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
                    className="custom-time-input py-2 px-[18px] text-[#2B333B]"
                    value={time || 'hh:mm:ss'}
                    onChange={handleTimeChange}
                    onClick={() => setIsDropdown(!isDropdownOpen)}
                />
                <img 
                    src="/Images/clock-primary.svg" 
                    alt="clock" 
                    className="time-icon"
                />
            </div>
            {isDropdownOpen && (
                <div ref={dropdownRef} className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg z-[99]">
                    <div className="grid grid-cols-3 divide-x divide-gray-200">
                        <div className="max-h-48 overflow-y-auto scrollBar">
                            {hours.map((h) => (
                                <div
                                    key={h}
                                    onClick={() => handleHourChange(h)}
                                    className={`px-4 py-2 cursor-pointer hover:bg-gray-300 
                                        ${h === hour ? 'bg-gray-200 text-[#2B333B]' : 'text-[#2B333B]'}`}
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
                                >
                                    {s}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TimePicker;
