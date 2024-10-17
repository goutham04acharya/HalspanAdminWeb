import React, { useMemo, useRef } from "react";
import Signature from '@uiw/react-signature';

const CustomSignatureField = ({value, setValue, setValidationErrors, question }) => {
    const memoizedValue = useMemo(() => value, [question?.question_id]);
    const $svg = useRef(null);
    console.log($svg, 'svg svg')

    const handlePointer = (points) => {
        setValue((prev) => ({
            ...prev,
            [question?.question_id]: true
        }));

        setValidationErrors((prevErrors) => ({
            ...prevErrors,
            preview_signaturefield: ''
        }));
    };


    const handleClear = () => {
        setValue((prev) => ({
            ...prev,
            [question?.question_id]: false
        }));
    };


    return (
        <>
            <Signature ref={$svg} onPointer={handlePointer} />
            <button onClick={handleClear}>Clear</button>
        </>
    );
};

export default CustomSignatureField;
