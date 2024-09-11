import React, { useEffect, useState } from 'react'

function GPSField({
    type,
    textId,
    value,
    className,
    handleChange,
    fieldSettingParameters,

}) {

    const [location, setLocation] = useState('');
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchLocation = () => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const formattedLocation = formatCoordinates(
                            position.coords.latitude,
                            position.coords.longitude
                        );
                        setLocation(formattedLocation);
                    },
                    (err) => {
                        setError(err.message);
                    }
                );
            } else {
                setError("Geolocation is not supported by this browser.");
            }
        };

        fetchLocation();
    }, []);

    const formatCoordinates = (lat, lon) => {
        const latDirection = lat >= 0 ? 'N' : 'S';
        const lonDirection = lon >= 0 ? 'E' : 'W';

        const formattedLat = `${Math.abs(lat).toFixed(4)}° ${latDirection}`;
        const formattedLon = `${Math.abs(lon).toFixed(4)}° ${lonDirection}`;

        return `${formattedLat}, ${formattedLon}`;
    };


    return (
        <div>
            <label
                data-testid="label-name"
                htmlFor={textId}
                title={fieldSettingParameters?.label}
                maxLength={100}
                className={`font-medium text-base text-[#000000] overflow-hidden break-all block w-full max-w-[85%] ${fieldSettingParameters?.label === '' ? 'h-[20px]' : 'h-auto'}`}>
                {fieldSettingParameters?.label}
            </label>
            <div className='mt-7 ml-4'>
                {error ? (
                    <p>Error: {error}</p>
                ) : (
                    <p className={className}>{location}</p>
                )}
            </div>
            <p
                data-testid="help-text"
                className='italic mt-2 font-normal text-sm text-[#2B333B] break-words max-w-[90%]'
                title={fieldSettingParameters?.helptext}
            >
                {fieldSettingParameters?.helptext}</p>
        </div>
    )
}

export default GPSField