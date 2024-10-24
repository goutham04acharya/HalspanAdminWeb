import React, { useEffect, useMemo, useState } from 'react'
import ErrorMessage from '../../../../../Components/ErrorMessage/ErrorMessage';

function GPSField({
    type,
    textId,
    value,
    className,
    handleChange,
    fieldSettingParameters,
    question,
    preview,
    setValue,
    setValidationErrors,
    validationErrors

}) {

    const [location, setLocation] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true); // Add loading states

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
                        setLoading(false); // Stop loading once location is fetched
                        setValue((prev) => ({
                            ...prev,
                            [question?.question_id]: true
                        }))
                        setValidationErrors((prevErrors) => ({
                            ...prevErrors,
                            preview_gpsfield: '', // Or remove the key if you prefer     
                        }))
                    },
                    (err) => {
                        setError(err.message);
                        setLoading(false); // Stop loading once location is fetched
                    }
                );

            } else {
                setError("Geolocation is not supported by this browser.");
                setLoading(false); // Stop loading once location is fetched
                setValue((prev) => ({
                    ...prev,
                    [question?.question_id]: false
                }))
            }
        };

        fetchLocation();
    }, []);

    // Memoize the formatted location to prevent unnecessary re-renders
    const memoizedLocation = useMemo(() => location, [location]);

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
                title={preview ? question?.label : fieldSettingParameters?.label}
                maxLength={100}
                className={`font-medium text-base text-[#000000] overflow-hidden break-all block w-full max-w-[85%] ${fieldSettingParameters?.label === '' ? 'h-[20px]' : 'h-auto'}`}>
                {preview ? question?.label : fieldSettingParameters?.label}
            </label>
            <div className={`${preview ? 'mt-3' : 'mt-7'} ml-4`}>
                {loading ? ( // Display a loading message while fetching location
                    <p>Loading location...</p>
                ) : error ? (
                    <p>Error: {error}</p>
                ) : (
                    <p className={className}>{memoizedLocation}</p>
                )}
            </div>
            {(question?.question_id && validationErrors?.preview_gpsfield && validationErrors.preview_gpsfield[question.question_id]) && (
                <ErrorMessage error={validationErrors.preview_gpsfield[question.question_id]} />
            )}
            <p
                data-testid="help-text"
                className='italic mt-2 font-normal text-sm text-[#2B333B] break-words max-w-[90%]'
                title={preview ? question?.help_text : fieldSettingParameters?.helptext}
            >
                {preview ? question?.help_text : fieldSettingParameters?.helptext}</p>
        </div>
    )
}

export default GPSField