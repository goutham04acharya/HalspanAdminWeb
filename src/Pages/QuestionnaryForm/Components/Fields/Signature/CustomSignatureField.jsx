import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addSignature, clearSignature } from './signatureSlice';
import { setQuestionValue } from '../../previewQuestionnaireValuesSlice';

const SignatureCanvas = ({ id, setConditionalValues, question_id }) => {
    const dispatch = useDispatch();
    const canvasRef = useRef(null);
    const questionValues = useSelector((state) => state.questionValues.questions);
    const currentSignature = questionValues?.[id] || null;
    // Initialize signature from questionValues if available
    useEffect(() => {
        if (questionValues[id]) {
            dispatch(addSignature({ id, signature: questionValues[id] }));
            setConditionalValues((prevValues) => ({
                ...prevValues,
                [question_id.replace(/-/g, '_')] : questionValues[id],
            }));
        }
    }, [dispatch, id, questionValues]);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        let isDrawing = false;

        const getMousePosition = (e) => {
            const rect = canvas.getBoundingClientRect();
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
            const signatureData = canvas.toDataURL();
            setConditionalValues((prevValues) => ({
                ...prevValues,
                [question_id.replace(/-/g, '_')] : signatureData,
            }));
            dispatch(addSignature({ id, signature: signatureData }));
            dispatch(setQuestionValue({ question_id: id, value: signatureData }));
        };

        canvas.addEventListener('mousedown', startDrawing);
        canvas.addEventListener('mousemove', draw);
        canvas.addEventListener('mouseup', endDrawing);
        canvas.addEventListener('mouseout', endDrawing);

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
            setConditionalValues((prevValues) => ({
                ...prevValues,
                [question_id.replace(/-/g, '_')] : currentSignature,
            }));
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            const img = new Image();
            img.src = currentSignature;
            img.onload = () => {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, 0, 0);
            };
        }
    }, [currentSignature]);

    const clearCanvas = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        setConditionalValues((prevValues) => ({
            ...prevValues,
            [question_id.replace(/-/g, '_')] : null,
        }));
        dispatch(clearSignature({ id }));
        dispatch(setQuestionValue({ question_id: id, value: '' }));
    };

    useEffect(() => {
        return () => {
            const canvas = canvasRef.current;
            if (canvas) {
                const ctx = canvas.getContext('2d');
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            }
            setConditionalValues((prevValues) => ({
                ...prevValues,
                [question_id.replace(/-/g, '_')] : null,
            }));
            dispatch(clearSignature({ id }));
        };
    }, [dispatch, id]);

    return (
        <div>
            <canvas
                ref={canvasRef}
                height={200}
                data-testid="signature"
                className='w-full bg-white rounded-lg border border-[#AEB3B7]'
            />
            <div>
                <button onClick={clearCanvas} className='bg-customTextColor w-full mt-1 py-1 rounded-lg text-white'>
                    Clear
                </button>
            </div>
        </div>
    );
};

export default SignatureCanvas;
