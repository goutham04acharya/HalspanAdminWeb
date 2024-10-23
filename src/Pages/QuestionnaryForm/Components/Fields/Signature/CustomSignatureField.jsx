
// import SignatureCanvas from 'react-signature-canvas';

// const CustomSignatureField = ({ value, setValue, setValidationErrors, question }) => {
//     const memoizedValue = useMemo(() => value, [question?.question_id]);
//     const signatureCanvasRef = useRef(null);

//     const handleSignatureChange = () => {
//         const signatureData = signatureCanvasRef.current.toDataURL();
//         setValue((prev) => ({
//             ...prev,
//             [question?.question_id]: signatureData
//         }));

//         setValidationErrors((prevErrors) => ({
//             ...prevErrors,
//             preview_signaturefield: ''
//         }));
//     };

//     const handleClear = () => {
//         signatureCanvasRef.current.clear();
//         setValue((prev) => ({
//             ...prev,
//             [question?.question_id]: ''
//         }));
//     };

//     return (
//         <>
//             <SignatureCanvas
//                 ref={signatureCanvasRef}
//                 onEnd={handleSignatureChange}
//                 canvasProps={{
//                     width: 400,
//                     height: 200,
//                     className: 'signature-canvas bg-white w-full'
//                 }}
//             />
//             <button onClick={handleClear} className="bg-customTextColor mt-3 w-full text-white px-2 py-1.5 rounded-lg">Clear</button>
//         </>
//     );
// };

// export default CustomSignatureField;
// SignatureCanvas.js
// import React, { useEffect, useRef } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { addSignature, clearSignature } from './signatureSlice';

// const SignatureCanvas = ({ id }) => {
//     const dispatch = useDispatch();
//     const canvasRef = useRef(null);
//     const signatures = useSelector((state) => state?.signatures?.signatures);
//     console.log(id, 'olololo')
//     const currentSignature = signatures?.[id] || null;

//     // Get the signature for this specific canvas

//     useEffect(() => {
//         const canvas = canvasRef.current;
//         const ctx = canvas.getContext('2d');

//         let isDrawing = false;

//         const startDrawing = (e) => {
//             isDrawing = true;
//             ctx.beginPath();
//             ctx.moveTo(e.clientX, e.clientY);
//         };


//         const draw = (e) => {
//             if (!isDrawing) return;
//             ctx.lineTo(e.clientX, e.clientY);
//             ctx.stroke();
//         };


//         const endDrawing = () => {
//             isDrawing = false;
//             ctx.closePath();
//             // Save the signature data URL to the Redux state
//             const signatureData = canvas.toDataURL();
//             dispatch(addSignature({ id, signature: signatureData }));
//         };

//         canvas.addEventListener('mousedown', startDrawing);
//         canvas.addEventListener('mousemove', draw);
//         canvas.addEventListener('mouseup', endDrawing);
//         canvas.addEventListener('mouseout', endDrawing);

//         // Cleanup event listeners on component unmount
//         return () => {
//             canvas.removeEventListener('mousedown', startDrawing);
//             canvas.removeEventListener('mousemove', draw);
//             canvas.removeEventListener('mouseup', endDrawing);
//             canvas.removeEventListener('mouseout', endDrawing);
//         };
//     }, [dispatch, id]);

//     useEffect(() => {
//         if (currentSignature) {
//             const canvas = canvasRef.current;
//             const ctx = canvas.getContext('2d');
//             const img = new Image();
//             img.src = currentSignature;
//             img.onload = () => {
//                 ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear previous drawings
//                 ctx.drawImage(img, 0, 0); // Load saved signature
//             };
//         }
//     }, [currentSignature]);

//     const clearCanvas = () => {
//         const canvas = canvasRef.current;
//         const ctx = canvas.getContext('2d');
//         ctx.clearRect(0, 0, canvas.width, canvas.height);
//         dispatch(clearSignature({ id }));
//     };

//     return (
//         <div>
//             <canvas
//                 ref={canvasRef}
//                 width={400}
//                 height={200}
//                 style={{ border: '1px solid black' }}
//             />
//             <div>
//                 <button onClick={clearCanvas}>
//                     Clear Signature
//                 </button>
//             </div>
//         </div>
//     );
// };

// export default SignatureCanvas;


import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addSignature, clearSignature } from './signatureSlice';

const SignatureCanvas = ({ id }) => {
    const dispatch = useDispatch();
    const canvasRef = useRef(null);
    const signatures = useSelector((state) => state?.signature?.signatures);
    const currentSignature = signatures?.[id] || null;

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        let isDrawing = false;

        // Adjust coordinates to be relative to the canvas
        const getMousePosition = (e) => {
            const rect = canvas.getBoundingClientRect(); // Get canvas position
            return {
                x: e.clientX - rect.left,
                y: e.clientY - rect.top,
            };
        };

        const startDrawing = (e) => {
            isDrawing = true;
            ctx.beginPath();
            const { x, y } = getMousePosition(e);
            ctx.moveTo(x, y);
        };

        const draw = (e) => {
            if (!isDrawing) return;
            const { x, y } = getMousePosition(e);
            ctx.lineTo(x, y);
            ctx.stroke();
        };

        const endDrawing = () => {
            isDrawing = false;
            ctx.closePath();
            // Save the signature data URL to the Redux state
            const signatureData = canvas.toDataURL();
            dispatch(addSignature({ id, signature: signatureData }));
        };

        // Add event listeners
        canvas.addEventListener('mousedown', startDrawing);
        canvas.addEventListener('mousemove', draw);
        canvas.addEventListener('mouseup', endDrawing);
        canvas.addEventListener('mouseout', endDrawing);

        // Cleanup event listeners on component unmount
        return () => {
            canvas.removeEventListener('mousedown', startDrawing);
            canvas.removeEventListener('mousemove', draw);
            canvas.removeEventListener('mouseup', endDrawing);
            canvas.removeEventListener('mouseout', endDrawing);
        };
    }, [dispatch, id]);

    // Load the saved signature into the canvas
    useEffect(() => {
        if (currentSignature) {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            const img = new Image();
            img.src = currentSignature;
            img.onload = () => {
                ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear previous drawings
                ctx.drawImage(img, 0, 0); // Load saved signature
            };
        }
    }, [currentSignature]);

    const clearCanvas = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        dispatch(clearSignature({ id }));
    };

    return (
        <div>
            <canvas
                ref={canvasRef}
                // width={400}
                height={200}
                // style={{ border: '1px solid c' }}
                className='w-full bg-white rounded-lg border border-[#AEB3B7]'
            />
            <div>
                <button onClick={clearCanvas} className=' bg-customTextColor w-full mt-1 py-1 rounded-lg text-white'>
                    Clear
                </button>
            </div>
        </div>
    );
};

export default SignatureCanvas;


