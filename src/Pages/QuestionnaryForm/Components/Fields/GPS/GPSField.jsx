import React, { useEffect, useMemo, useState } from 'react'

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
    const [loading, setLoading] = useState(true);

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
                        setLoading(false);

                        // Set value to true when location is successfully obtained
                        if (question?.question_id) {
                            setValue((prev) => ({
                                ...prev,
                                [question.question_id]: true
                            }));
                        }

                        // Clear validation errors
                        setValidationErrors((prevErrors) => ({
                            ...prevErrors,
                            preview_gpsfield: {
                                ...prevErrors?.preview_gpsfield,
                                [question?.question_id]: ''
                            }
                        }));
                    },
                    (err) => {
                        setError(err.message);
                        setLoading(false);

                        // Set value to false when location access fails
                        if (question?.question_id) {
                            setValue((prev) => ({
                                ...prev,
                                [question.question_id]: false
                            }));
                        }

                        // Set validation error message
                        setValidationErrors((prevErrors) => ({
                            ...prevErrors,
                            preview_gpsfield: {
                                ...prevErrors?.preview_gpsfield,
                                [question?.question_id]: 'Location access denied'
                            }
                        }));
                    }
                );
            } else {
                setError("Geolocation is not supported by this browser.");
                setLoading(false);

                // Set value to false when geolocation is not supported
                if (question?.question_id) {
                    setValue((prev) => ({
                        ...prev,
                        [question.question_id]: false
                    }));
                }

                // Set validation error message
                setValidationErrors((prevErrors) => ({
                    ...prevErrors,
                    preview_gpsfield: {
                        ...prevErrors?.preview_gpsfield,
                        [question?.question_id]: 'Geolocation not supported'
                    }
                }));
            }
        };

        fetchLocation();
    }, [question?.question_id, setValue, setValidationErrors]);

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
                {loading ? (
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