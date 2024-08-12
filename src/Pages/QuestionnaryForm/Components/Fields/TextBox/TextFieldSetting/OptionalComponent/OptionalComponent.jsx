import React from 'react';

function OptionsComponent() {
    // List of options
    const options = [
        'Load from previously entered data',
        'Read only',
        'Visible',
        'Optional',
        'Remember allowed',
        'Field Validation',
    ];

    // ToggleSwitch Component
    const ToggleSwitch = ({ label, onClick }) => (
        <div className="status custom-toggle-switch flex items-center justify-between" onClick={onClick}>
            <p className="text-sm font-normal text-[#000000] mr-4 mt-3">
                {label}
            </p>
            <label className="switch" style={{ marginLeft: '1px' }}>
                <input type="checkbox" /><span className="slider round mr-5 mt-1"></span>
            </label>
        </div>
    );

    // Handle toggle click logic
    const handleToggleClick = (label) => {
        console.log(`${label} clicked`);
        // Add specific logic here
    };

    return (
        <div className='mt-7 w-[97%]'>
            <p className='font-semibold text-base text-[#2B333B]'>Options</p>
            {options.map((option) => (
                <ToggleSwitch key={option} label={option} onClick={() => handleToggleClick(option)} />
            ))}
        </div>
    );
}

export default OptionsComponent;
