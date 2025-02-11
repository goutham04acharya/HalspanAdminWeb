import React, { useState, useRef } from 'react';
import { ReactSketchCanvas } from 'react-sketch-canvas';
import { useDispatch } from 'react-redux';
import { setQuestionValue } from '../../Pages/QuestionnaryForm/Components/previewQuestionnaireValuesSlice';
import { useSelector } from 'react-redux';
import { findSectionAndPageName } from '../../CommonMethods/SectionPageFinder';


function ImageUploader({ maxImages, drawOnImage, sections, minImages, setIsModified, isModified, handleFileChange, setConditionalValues, setValue, handleRemoveImage, question, setFileState , handleBlur}) {
    const [images, setImages] = useState([]);
    const [currentImage, setCurrentImage] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const canvasRef = useRef(null);
    const [fileTypeError, setFileTypeError] = useState(false);
    const [strokeColor, setStrokeColor] = useState('black');
    const [colorPicker, setColorPicker] = useState(false);
    const dispatch = useDispatch();
    const questionValue = useSelector(state => state.questionValues.questions);
    const handleImageChange = (e) => {
        const files = Array.from(e.target.files); // Convert FileList to array
        let newImages = [...images]; // Copy existing images
        let isFileTypeError = false; // Track if there's any file type error
        handleFileChange(e)
        files.forEach((file) => {
            const fileType = file.type;
            if (fileType === 'image/png' || fileType === 'image/jpeg' || fileType === 'image/svg+xml') {
                if (newImages.length < maxImages) {
                    newImages.push(file);
                }
            } else {
                isFileTypeError = true; // Set the file type error only if file type is invalid
            }
        });
    
        if (newImages.length > maxImages) {
            newImages = newImages.slice(0, maxImages); // Limit to maxImages
        }
    
        setImages(newImages);
        setFileTypeError(isFileTypeError); // Show the error only if there's an invalid file type
    
        // Reset file input to allow the same file to be added again
        e.target.value = ''; 
    
        // Dispatch to Redux store
        dispatch(setQuestionValue({ 
            question_id: question?.question_id, 
            value: newImages 
        }));
        const { section_name, page_name, label } = findSectionAndPageName(sections, question?.question_id);
        setConditionalValues((prevValues) => ({
            ...prevValues,
            [section_name]: {
                ...prevValues[section_name],
                [page_name]: {
                    ...prevValues[section_name]?.[page_name],
                    [label]: newImages
                }
            }
        }));
        setIsModified(!isModified)
        
    
        // Optional: Set value for parent component
        setValue((prev) => ({ ...prev, [question?.question_id]: true }));
    };
    
    const handleImageRemove = (index) => {
        const newImages = [...questionValue?.[question?.question_id] ];
        newImages.splice(index, 1);
        setImages(newImages);
        handleRemoveImage(newImages)

        
        // Update Redux store with new image array
        // const imageUrls = newImages.map((image) => URL.createObjectURL(image));
        setValue((prev) => ({
            ...prev,
            [question?.question_id]: newImages
        }));
        const { section_name, page_name, label } = findSectionAndPageName(sections, question?.question_id);
        setConditionalValues((prevValues) => ({
            ...prevValues,
            [section_name]: {
                ...prevValues[section_name],
                [page_name]: {
                    ...prevValues[section_name]?.[page_name],
                    [label]: newImages
                }
            }
        }));
        dispatch(setQuestionValue({ 
            question_id: question?.question_id, 
            value: newImages 
        }));

        setFileState((prevState) => ({
            ...prevState,
            files: newImages,
        }));
    };

    const handleImageClick = (image) => {
        setCurrentImage(image);
        setModalOpen(true);
    };

    const handleModalClose = () => {
        setModalOpen(false);
        setStrokeColor('#000');
    };

    const handlePencilClick = () => {
        canvasRef.current.eraseMode(false);
        setColorPicker(!colorPicker);
    };

    const handleEraserClick = () => {
        canvasRef.current.eraseMode(true);
    };

    const handleColorPickerClick = (color) => {
        setStrokeColor(color);
        setColorPicker(true);
    };

    const handleResetClick = () => {
        canvasRef.current.resetCanvas();
    };

    return (
        <div>
            <label className="custom-file-label custom-file-input-wrapper w-fit h-auto mt-1 flex items-center bg-[#DFE0E2] border border-[#AEB3B7] p-0 rounded-md">
                <input
                    type="file"
                    multiple
                    onChange={handleImageChange}
                    accept="image/*"
                    onBlur={handleBlur}
                    data-testid="add-image"
                    className={`hidden-input ${!images?.length >= maxImages ? 'cursor-default' : 'cursor-pointer'}`}
                    disabled={images.length >= maxImages}
                />
                <span className={`text-[12px] my-2 items-center justify-center flex px-3 ${images.length >= maxImages ? 'disabled' : ''}`}>
                    <img src="/Images/add-media.svg" alt="" className="mx-2" /> Add Image ({maxImages - images.length || maxImages})
                </span>
            </label>

            {fileTypeError && (
                <p className="text-red-500 mt-2 text-sm">Only .png, .jpg, and .svg files are allowed</p>
            )}

            {questionValue?.[question?.question_id] && questionValue?.[question?.question_id]?.length > 0 && (
                <div className="w-full flex flex-wrap">
                    {questionValue?.[question?.question_id]?.map((image, index) => (
                        <div key={index} className="image-preview relative mt-2">
                            <span 
                                data-testid={`remove-${index}`} 
                                className="close-icon ml-[60px] absolute hover:bg-slate-800 transition-transform bg-slate-800 px-1 rounded-md text-white cursor-pointer" 
                                onClick={() => handleImageRemove(index)}
                            >
                                &#10005;
                            </span>
                            <img
                                src={URL.createObjectURL(image)}
                                alt="Selected Image"
                                className="w-[70px] h-[70px] rounded-lg mx-3"
                                onClick={() => handleImageClick(image)}
                            />
                        </div>
                    ))}
                </div>
            )}

            {modalOpen && (
                <div className="modal-overlay absolute rounded-[50px] top-0 flex-col z-20 left-0 w-[356px] h-full bg-white flex justify-center items-center">
                    <span 
                        className="close-icon delay-300 z-[2] items-end text-[20px] ml-[325px] top-10 relative hover:bg-slate-700 transition-transform bg-slate-800 px-1.5 rounded-lg text-white cursor-pointer" 
                        onClick={handleModalClose}
                    >
                        &#10005;
                    </span>

                    {drawOnImage ? (
                        <div className="modal-content w-[370px] h-[400px] p-2 rounded-2xl ">
                            <ReactSketchCanvas
                                ref={canvasRef}
                                strokeWidth={4}
                                strokeColor={strokeColor}
                                style={{ backgroundColor: 'white' }}
                                backgroundImage={URL.createObjectURL(currentImage)}
                            />
                            <div className='flex flex-col top-[-140px] mr-[650px] relative'>
                                <div className='flex w-[100px]'>
                                    <button onClick={handlePencilClick} className='m-[2px]'>
                                        <img src="/Images/pencil.svg" alt="" />
                                    </button>
                                    {colorPicker && (
                                        <span>
                                            <input
                                                id='color-picker'
                                                type='color'
                                                onChange={(e) => setStrokeColor(e.target.value)}
                                                value={strokeColor}
                                                className='top-[25%] w-[40px] h-[40px] left-0 bg-transparent'
                                            />
                                        </span>
                                    )}
                                </div>

                                <button onClick={handleEraserClick} className='m-[2px] w-[40px] h-[40px]'>
                                    <img src="/Images/eraser.svg" alt="" />
                                </button>
                                <button onClick={handleResetClick} className='m-[2px] w-[40px] h-[40px]'>
                                    <img src="/Images/reset.svg" alt="" />
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className='z-[1]'>
                            <img src={URL.createObjectURL(currentImage)} className='w-[374px] h-[600px] bg-white p-2 rounded-lg object-contain' alt="" />
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default ImageUploader;
