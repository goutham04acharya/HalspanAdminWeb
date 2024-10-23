import React, { useRef, useState } from 'react';
import useOnClickOutside from '../../CommonMethods/outSideClick';

const TimePicker = ({ onChange, format, setErrorMessage }) => {
    const [time, setTime] = useState('hh:mm:ss');
    const [isDropdownOpen, setIsDropdown] = useState(false);
    const [hour, setHour] = useState('');
    const [minute, setMinute] = useState('');
    const [second, setSecond] = useState('');

    const hours = (format === "24" ? Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0')) : Array.from({ length: 12 }, (_, i) => i.toString().padStart(2, '0')));
    const minutes = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));
    const seconds = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));
    const dropdownRef = useRef()

    const handleTimeChange = (e) => {
        const selectedTime = e.target.value;
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
        if (hour && minute && second) {
            setTime(`${hour}:${minute}:${second}`);
            onChange(time);
        }
    };

    const handleMinuteChange = (minute) => {
        setMinute(minute);
        if (hour && minute && second) {
            setTime(`${hour}:${minute}:${second}`);
            onChange(time);
        }
    };

    const handleSecondChange = (second) => {
        setSecond(second);
        if (hour && minute && second) {
            setTime(`${hour}:${minute}:${second}`);
            onChange(time);
        }
    };

    // const outSideClick = (dropdownRef=()=>{
    //     setIsDropdown(false);
    // })
    useOnClickOutside(dropdownRef, () => {
        setIsDropdown(false);
    })
    return (
        <div className="time-picker flex flex-col text-[#2B333B] relative ">
            <input
                type="text"
                value={time}
                onBlur={handleTimeChange}
                // placeholder="hh:mm:ss"
                className="time-input w-full h-[40px] break-words border  border-[#AEB3B7] rounded-lg mt-1 px-4"
                onClick={(e) => setIsDropdown(!isDropdownOpen)}
            /><img src="/Images/clock-primary.svg" alt="clock" onClick={() => setIsDropdown(!isDropdownOpen)} className={`absolute text-[#2B333B] w-[15px] top-4 right-3 cursor-pointer`} />
            {isDropdownOpen && (
                <div ref={dropdownRef} className=" bg-white flex w-full border border-[#AEB3B7]  absolute mt-12">
                    <div className="flex flex-col w-1/3 h-[100px] items-center overflow-y-scroll border-r border-[#AEB3B7] overflow-x-hidden scrollHide">
                        {/* <p>hh</p> */}
                        <div className="flex flex-col">
                            {hours.map((hour, index) => (
                                <a
                                    key={index}
                                    href="#"
                                    onClick={() => handleHourChange(hour)}
                                    className={`${hour === hour ? 'bg-white text-black' : 'bg-[#AEB3B7] text-white'
                                        } py-2 px-2`}
                                >
                                    {hour}
                                </a>
                            ))}
                        </div>
                    </div>
                    <div className="flex flex-col w-1/3 h-[100px] items-center overflow-y-scroll border-r border-[#AEB3B7] overflow-x-hidden scrollHide">
                        {/* <p>mm</p> */}
                        <div className="flex flex-col">
                            {minutes.map((minute, index) => (
                                <a
                                    key={index}
                                    href="#"
                                    onClick={() => handleMinuteChange(minute)}
                                    className={`${minute === minute ? 'bg-white text-black' : 'bg-[#AEB3B7] text-white'
                                        } py-2 px-2`}
                                >
                                    {minute}
                                </a>
                            ))}
                        </div>
                    </div>
                    <div className="flex flex-col w-1/3 h-[100px] items-center overflow-y-scroll overflow-x-hidden scrollHide">
                        {/* <p>ss</p> */}
                        <div className="flex flex-col">
                            {seconds.map((second, index) => (
                                <a
                                    key={index}
                                    href="#"
                                    onClick={() => handleSecondChange(second)}
                                    className={`${second === second ? 'bg-white text-black' : 'bg-[#AEB3B7] text-white'
                                        } py-2 px-2`}
                                >
                                    {second}
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TimePicker;
