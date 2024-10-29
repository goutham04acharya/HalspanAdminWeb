import React, { useState, useRef } from 'react';
import { ReactSketchCanvas } from 'react-sketch-canvas';
import { ColorPicker } from 'antd';

function ImageUploader({ maxImages, drawOnImage, minImages, handleFileChange, setValue, handleRemoveImage , question, setFileState}) {
    const [images, setImages] = useState([]);
    const [currentImage, setCurrentImage] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const canvasRef = useRef(null);
    const [fileTypeError, setFileTypeError] = useState(false);
    const [strokeColor, setStrokeColor] = useState('black');
    const [colorPicker, setColorPicker] = useState(false)
    console.log(images, 'ffff images')
    const handleImageChange = (e) => {
        const files = e.target.files;
        const newImages = [...images];
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const fileType = file.type;
            if (fileType === 'image/png' || fileType === 'image/jpeg' || fileType === 'image/svg+xml') {
                newImages.push(file);
                setFileTypeError(false)
            } else {
                setFileTypeError(true);
            }
        }
        setImages(newImages);
        handleFileChange(e)
        // setValue((prev) => ({ ...prev, [question?.question_id]: true })); // Call setValue function here  
    };


    const handleImageRemove = (index) => {
        const newImages = [...images];
        newImages.splice(index, 1);
        setImages(newImages);
        // setValue((prev) => ({ ...prev, [question?.question_id]: false })); // Call setValue function here  
        setFileState((prevState) => ({
            ...prevState,
            files: newImages,
        }));
        handleRemoveImage(newImages, index)
    };

    const handleImageClick = (image) => {
        setCurrentImage(image);
        setModalOpen(true);
    };

    const handleModalClose = () => {
        setModalOpen(false);
        setStrokeColor('#000')
    };

    const handlePencilClick = () => {
        canvasRef.current.eraseMode(false);
        setColorPicker(!colorPicker)
    };

    const handleEraserClick = () => {
        canvasRef.current.eraseMode(true);
    };

    const handleColorPickerClick = (color) => {
        setStrokeColor(color);
        setColorPicker(true)
    };

    const handleResetClick = () => {
        canvasRef.current.resetCanvas();
    };

    // const handleExportClick = () => {
    //     canvasRef.current.exportImage('png').then((data) => {
    //         console.log(data);
    //     });
    // };
    console.log(strokeColor, 'sssss')
    return (
        <div>
            <label className="custom-file-label custom-file-input-wrapper w-fit h-auto mt-1 flex items-center bg-[#DFE0E2] border border-[#AEB3B7] p-0 rounded-md">
                <input
                    type="file"
                    multiple
                    onChange={handleImageChange}
                    accept="image/*"
                    data-testid="add-image"
                    className={`hidden-input ${!images?.length >= maxImages ? 'cursor-default' : 'cursor-pointer'}`}
                    disabled={images.length >= maxImages}
                />
                <span className={` text-[12px] my-2 items-center justify-center flex px-3 ${images.length >= maxImages ? 'disabled' : ''}`}>
                    <img src="/Images/add-media.svg" alt="" className="mx-2" /> Add Image ({maxImages})
                </span>

            </label>
            {fileTypeError && (
                <p className="text-red-500 mt-2 text-sm">Only .png, .jpg, and .svg files are allowed</p>
            )}

            {images.length > 0 && (
                <div className="w-full flex flex-wrap">
                    {images.map((image, index) => (
                        <div key={index} className="image-preview relative mt-2">
                            <span data-testid={`remove-${index}`} className="close-icon ml-[60px] absolute hover:bg-slate-800 px-1 rounded-md text-white cursor-pointer" onClick={() => handleImageRemove(index)}>
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
                <div
                    className="modal-overlay absolute rounded-[50px] top-0 flex-col left-0 w-[356px] h-full bg-white flex justify-center items-center"
                >
                    <span className="close-icon delay-300 z-[2] items-end text-[20px] ml-[325px] top-10 relative hover:bg-slate-800 px-1.5 rounded-lg text-white cursor-pointer" onClick={handleModalClose}>
                        &#10005;
                    </span>
                    {drawOnImage === true ? <div className="modal-content w-[370px] h-[400px] p-2 rounded-2xl">
                        <ReactSketchCanvas
                            ref={canvasRef}
                            // width="600"
                            // height="400"
                            strokeWidth={4}
                            strokeColor={strokeColor}
                            style={{ backgroundColor: 'none'}}
                            backgroundImage={URL.createObjectURL(currentImage)}
                        />
                        <div className=' flex flex-col top-[-140px] mr-[650px] relative '>
                            <div className=' flex w-[100px] '>
                                <button onClick={handlePencilClick} className='m-[2px]'><img src="/Images/pencil.svg" alt="" /></button>
                                {colorPicker && <span>
                                    <input
                                        id='color-picker'
                                        type='color'
                                        onChange={(e) => setStrokeColor(e.target.value)}
                                        value={strokeColor}
                                        // style={{ display: 'none' }}
                                        className=' top-[25%] w-[40px] h-[40px] left-0 bg-transparent '
                                    />
                                </span>}
                            </div>

                            <button onClick={handleEraserClick} className='m-[2px] w-[40px] h-[40px]'><img src="/Images/eraser.svg" alt="" /></button>
                            <button onClick={handleResetClick} className='m-[2px] w-[40px] h-[40px]'><img src="/Images/reset.svg" alt="" /></button>
                            {/* <button onClick={handleExportClick}>Export</button> */}
                        </div>
                    </div> : <div className='z-[1]'>
                        <img src={URL.createObjectURL(currentImage)} className='w-[374px] h-[500px] p-2 rounded-lg' alt="" />
                    </div>}
                </div>
            )}

        </div>
    );
}

export default ImageUploader;
