import React, { useEffect, useRef, useState } from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { ReactSketchCanvas } from "react-sketch-canvas";

const ImageZoomPin = ({ imageSrc, floorPlan, isPin, isDraw, readOnly }) => {
    const [pins, setPins] = useState([]);
    const imageRef = useRef(null);
    const [activePinIndex, setActivePinIndex] = useState(null);
    const [currentZoom, setCurrentZoom] = useState(1);
    const [modalOpen, setModalOpen] = useState(false);
    const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
    const [isPinMode, setIsPinMode] = useState(false);
    const [isDrawMode, setIsDrawMode] = useState(false);
    const [colorPicker, setColorPicker] = useState(false)
    const [strokeColor, setStrokeColor] = useState('black');
    const [eraserClick, setEraserClick] = useState(false)
    const [resetClick, setResetClick] = useState(false)
    const BASE_PIN_SIZE = 30;
    const sketchCanvasRef = useRef(null);

    useEffect(() => {
        const img = new Image();
        img.src = imageSrc || "/sample.jpeg";
        img.onload = () => {
            const { width, height } = img;
            const aspectRatio = width / height;
            let newWidth, newHeight;

            if (aspectRatio > 1) {
                newWidth = Math.min(width, window.innerWidth * 0.8);
                newHeight = newWidth / aspectRatio;
            } else {
                newHeight = Math.min(height, window.innerHeight * 0.8);
                newWidth = newHeight * aspectRatio;
            }

            setImageSize({ width: newWidth, height: newHeight });
        };
    }, [imageSrc]);

    const handleImageClick = () => {
        setModalOpen(true);
    };

    const handleModalImageClick = (event) => {
        if (isPinMode && activePinIndex === null) {
            const rect = event.target.getBoundingClientRect();
            const x = (event.clientX - rect.left) / rect.width;
            const y = (event.clientY - rect.top) / rect.height;

            const newPin = { id: pins.length, x, y };
            setPins((prevPins) => [...prevPins, newPin]);
        }
    };


    const handlePinMouseDown = (index, event) => {
        event.stopPropagation();
        setActivePinIndex(index);
    };

    const handlePinMouseMove = (event) => {
        if (activePinIndex !== null && imageRef.current) {
            const rect = imageRef.current.getBoundingClientRect();
            const x = (event.clientX - rect.left) / rect.width;
            const y = (event.clientY - rect.top) / rect.height;

            const newX = Math.max(0, Math.min(x, 1));
            const newY = Math.max(0, Math.min(y, 1));

            setPins((prevPins) =>
                prevPins.map((pin, index) =>
                    index === activePinIndex ? { ...pin, x: newX, y: newY } : pin
                )
            );
        }
    };

    const handlePinMouseUp = () => {
        setActivePinIndex(null);
    };

    const handleZoom = (ref) => {
        setCurrentZoom(ref.state.scale);

    };

    const handleRemovePin = (id) => {
        setPins((prevPins) => prevPins.filter(pin => pin.id !== id));
    };

    const togglePinMode = () => {
        setIsPinMode(!isPinMode);
        setIsDrawMode(false);
        setEraserClick(false)
        setResetClick(false)
        // setColorPicker(false)
    };

    const toggleDrawMode = () => {
        setIsDrawMode(!isDrawMode);
        setIsPinMode(false);
        setColorPicker(!colorPicker)
        setEraserClick(false)
        setResetClick(false)
    };

    const handleEraserClick = () => {
        sketchCanvasRef.current.eraseMode(true);
        setEraserClick(!eraserClick)
        setResetClick(false)
        setIsPinMode(false);
        setIsDrawMode(false);
        // setColorPicker(false)

    };

    const handleResetClick = () => {
        sketchCanvasRef.current.resetCanvas();
        setResetClick(!resetClick)
        setIsPinMode(false);
        setIsDrawMode(false);
        // setColorPicker(false)
        setEraserClick(false)
    };

    return (
        <div>
            <div
                className={`w-[100px] h-[100px] relative ${readOnly ? 'cursor-default' : 'cursor-pointer'}`}
                onClick={!readOnly && handleImageClick}
                data-testid="floorplan-image"
            >
                <img
                    src={floorPlan ? '/floorplan.png' : imageSrc}
                    alt="Thumbnail"
                    style={{
                        width: "100px",
                        height: "100px",
                        objectFit: "cover",
                        zIndex: "-9"
                    }}
                    className="rounded-lg"
                />
            </div>

            {modalOpen && (
                <div
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: "white",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        zIndex: 1000,
                        width: '358px',
                        borderRadius: '52px'
                    }}
                // className="mx-auto"
                >
                    <div
                        style={{
                            backgroundColor: "transparent",
                            // padding: "20px",
                            borderRadius: "10px",
                            maxWidth: "90vw",
                            maxHeight: "90vh",
                            overflow: "hidden",
                            position: "relative",
                        }}
                    >
                        <TransformWrapper
                            initialScale={1}
                            minScale={1}
                            maxScale={5}
                            onZoom={handleZoom}

                            disabled={isDrawMode || eraserClick || resetClick}
                        >
                            <TransformComponent pointerEvents="none"  >
                                <div
                                    style={{
                                        width: '380px',
                                        height: '600px',
                                        position: "relative",
                                        backgroundColor: "white"
                                    }}
                                    onClick={handleModalImageClick}
                                    onMouseMove={handlePinMouseMove}
                                    onMouseUp={handlePinMouseUp}
                                    ref={imageRef}
                                >
                                    <img
                                        src={floorPlan ? '/floorplan.png' : (imageSrc || "/sample.jpeg")}
                                        alt="Full Size"
                                        style={{
                                            width: "100%",
                                            height: "100%",
                                            objectFit: "contain",
                                        }}
                                        onMouseDown={(e) => e.preventDefault()}
                                    />
                                    <ReactSketchCanvas
                                        ref={sketchCanvasRef}
                                        width={`${imageSize.width}px`}
                                        height={`${imageSize.height}px`}
                                        strokeWidth={4}
                                        strokeColor={strokeColor}
                                        canvasColor="transparent"
                                        style={{
                                            position: "absolute",
                                            top: 0,
                                            left: 0,
                                            pointerEvents: isDrawMode ? "auto" : "none",
                                        }}
                                    />
                                    {pins.map((pin) => (
                                        <React.Fragment key={pin.id}>
                                            <div
                                                style={{
                                                    position: "absolute",
                                                    top: `${pin.y * 100}%`,
                                                    left: `${pin.x * 100}%`,
                                                    width: `${BASE_PIN_SIZE / currentZoom}px`,
                                                    height: `${BASE_PIN_SIZE / currentZoom}px`,
                                                    transform: `translate(-50%, -100%)`,
                                                    cursor: "move",
                                                }}
                                            >
                                                <img
                                                    src="/Images/pin.svg"
                                                    alt="Pin"
                                                    style={{ width: "100%", height: "100%" }}
                                                />

                                                <div
                                                    style={{
                                                        position: "absolute",
                                                        right: "-40%",
                                                        top: "50%",
                                                        transform: `translate(-50%, -150%) scale(${1 / currentZoom})`, // Adjust transform  
                                                        borderRadius: "50%",
                                                        display: "flex",
                                                        justifyContent: "center",
                                                        alignItems: "center",
                                                        cursor: "pointer",
                                                    }}
                                                    className="bg-transparent"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleRemovePin(pin.id);
                                                    }}
                                                >
                                                    <img
                                                        src="/Images/close.svg"
                                                        alt="Close"
                                                        style={{
                                                            width: "20px",
                                                            height: "20px",
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </React.Fragment>
                                    ))}


                                </div>
                            </TransformComponent>
                        </TransformWrapper>
                        <button
                            data-testid="close-floorplan"
                            className=" absolute top-0 right-0 py-[3px] px-[3px] bg-transparent hover:bg-[rgba(0,0,0,0.2)] rounded-lg cursor-pointer"
                            onClick={() => {
                                setModalOpen(false)
                                setStrokeColor('#000')
                                setEraserClick(false)
                                setResetClick(false)
                                setIsPinMode(false);
                                setIsDrawMode(false);
                                setColorPicker(false)
                            }}
                        >
                            <img src="/Images/close.svg" alt="" />
                        </button>
                        <div

                            className="absolute bottom-[10px] left-0 flex flex-col"
                        >
                            {isPin === "yes" &&<button
                                data-testid="floorplan-pin"
                                className={` px-3 text-white rounded-lg cursor-pointer `}
                                onClick={togglePinMode}
                            >
                                <img src="/Images/pin-icon.svg" alt="" width={40} className={` ${isPinMode ? 'border border-white rounded-sm' : ' border border-transparent'}`} />
                            </button>}
                            {isDraw === "yes" &&<><div className="flex flex-wrap">
                                <button
                                    data-testid="floorplan-draw"
                                    className={` px-3 text-white rounded-lg cursor-pointer `}
                                    onClick={toggleDrawMode}
                                >
                                    <img src="/Images/pencil.svg" alt="" className={`${isDrawMode ? 'border border-white rounded-sm' : ' border border-transparent'}`} />
                                </button>
                                {colorPicker && <span>
                                    <input
                                        id='color-picker'
                                        type='color'
                                        onChange={(e) => setStrokeColor(e.target.value)}
                                        value={strokeColor}
                                        // style={{ display: 'none' }}
                                        className=' top-[25%] w-[40px] h-[40px] left-0 bg-transparent ' />
                                </span>}
                            </div><button onClick={handleEraserClick} className='pb-[2px] px-3 text-white rounded-lg cursor-pointer'><img className={`${eraserClick ? 'border border-white rounded-sm' : ' border border-transparent'}`} src="/Images/eraser.svg" alt="" /></button><button onClick={handleResetClick} className='pb-3 px-3 text-white rounded-lg cursor-pointer'><img className={`${resetClick ? 'border border-white rounded-sm' : ' border border-transparent'}`} src="/Images/reset.svg" alt="" /></button></>}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ImageZoomPin;