import React, { useMemo, useRef } from "react";
import SignatureCanvas from 'react-signature-canvas';

const CustomSignatureField = ({ value, setValue, setValidationErrors, question }) => {
    const memoizedValue = useMemo(() => value, [question?.question_id]);
    const signatureCanvasRef = useRef(null);

    const handleSignatureChange = () => {
        const signatureData = signatureCanvasRef.current.toDataURL();
        setValue((prev) => ({
            ...prev,
            [question?.question_id]: signatureData
        }));

        setValidationErrors((prevErrors) => ({
            ...prevErrors,
            preview_signaturefield: ''
        }));
    };

    const handleClear = () => {
        signatureCanvasRef.current.clear();
        setValue((prev) => ({
            ...prev,
            [question?.question_id]: ''
        }));
    };

    return (
        <>
            <SignatureCanvas
                ref={signatureCanvasRef}
                onEnd={handleSignatureChange}
                canvasProps={{
                    width: 400,
                    height: 200,
                    className: 'signature-canvas bg-white w-full'
                }}
            />
            <button onClick={handleClear} className="bg-customTextColor mt-3 w-full text-white px-2 py-1.5 rounded-lg">Clear</button>
        </>
    );
};

export default CustomSignatureField;
