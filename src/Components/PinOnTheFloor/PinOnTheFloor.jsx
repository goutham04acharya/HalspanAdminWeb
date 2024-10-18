import React, { useEffect, useRef, useState } from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { ReactSketchCanvas } from "react-sketch-canvas";

const ImageZoomPin = ({ imgSrc }) => {
    const [pins, setPins] = useState([]);
    const imageRef = useRef(null);
    const [activePinIndex, setActivePinIndex] = useState(null);
    const [currentZoom, setCurrentZoom] = useState(1);
    const [modalOpen, setModalOpen] = useState(false);
    const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
    const [isPinMode, setIsPinMode] = useState(false);
    const [isDrawMode, setIsDrawMode] = useState(false);
    const BASE_PIN_SIZE = 30;
    const sketchCanvasRef = useRef(null);

    useEffect(() => {
        const img = new Image();
        img.src = imgSrc || "/sample.jpeg";
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
    }, [imgSrc]);

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
    };

    const toggleDrawMode = () => {
        setIsDrawMode(!isDrawMode);
        setIsPinMode(false);
    };

    return (
        <div>
            <div
                style={{ width: "100px", height: "100px", position: "relative", cursor: "pointer" }}
                onClick={handleImageClick}
            >
                <img
                    src={imgSrc || "/sample.jpeg"}
                    alt="Thumbnail"
                    style={{
                        width: "100px",
                        height: "100px",
                        objectFit: "cover",
                    }}
                    className="rounded-lg"
                />
            </div>

            {modalOpen && (
                <div
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: "rgba(0, 0, 0, 0.7)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        zIndex: 1000,
                    }}
                >
                    <div
                        style={{
                            backgroundColor: "transparent",
                            padding: "20px",
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
                            disabled={isDrawMode}
                        >
                            <TransformComponent pointerEvents="none"  >
                                <div
                                    style={{
                                        width: imageSize.width,
                                        height: imageSize.height,
                                        position: "relative",
                                    }}
                                    onClick={handleModalImageClick}
                                    onMouseMove={handlePinMouseMove}
                                    onMouseUp={handlePinMouseUp}
                                    ref={imageRef}
                                >
                                    <img
                                        src={imgSrc || "/sample.jpeg"}
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
                                        strokeColor="red"
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
                                                onMouseDown={(e) => handlePinMouseDown(pin.id, e)}
                                            >
                                                <img
                                                    src="/Images/pin.svg"
                                                    alt="Pin"
                                                    style={{ width: "100%", height: "100%" }}
                                                />
                                                <div
                                                    style={{
                                                        position: "absolute",
                                                        top: "-10px",
                                                        right: "-10px",
                                                        width: "20px",
                                                        height: "20px",
                                                        borderRadius: "50%",
                                                        backgroundColor: "white",
                                                        display: "flex",
                                                        justifyContent: "center",
                                                        alignItems: "center",
                                                        cursor: "pointer",
                                                    }}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleRemovePin(pin.id);
                                                    }}
                                                >
                                                    ×
                                                </div>
                                            </div>
                                            <div
                                                style={{
                                                    position: "absolute",
                                                    top: `${pin.y * 100}%`,
                                                    left: `${pin.x * 100}%`,
                                                    backgroundColor: "rgba(255, 255, 255, 0.7)",
                                                    padding: "5px",
                                                    borderRadius: "3px",
                                                    transform: "translate(-50%, 10px)",
                                                }}
                                            >
                                                {`plan_x: ${pin.x.toFixed(2)}\nplan_y: ${pin.y.toFixed(2)}`}
                                            </div>
                                        </React.Fragment>
                                    ))}
                                </div>
                            </TransformComponent>
                        </TransformWrapper>
                        <button
                            style={{
                                position: "absolute",
                                top: "10px",
                                right: "10px",
                                padding: "5px 10px",
                                backgroundColor: "#2B333B",
                                color: "white",
                                border: "1px solid black",
                                borderRadius: "5px",
                                cursor: "pointer",
                            }}
                            onClick={() => setModalOpen(false)}
                        >
                            Close
                        </button>
                        <div
                            style={{
                                position: "absolute",
                                bottom: "10px",
                                left: "10px",
                                display: "flex",
                                gap: "10px",
                            }}
                        >
                            <button
                                style={{
                                    padding: "5px 10px",
                                    backgroundColor: isPinMode ? "#4CAF50" : "#2B333B",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "5px",
                                    cursor: "pointer",
                                }}
                                onClick={togglePinMode}
                            >
                                {isPinMode ? "Disable Pin" : "Enable Pin"}
                            </button>
                            <button
                                style={{
                                    padding: "5px 10px",
                                    backgroundColor: isDrawMode ? "#4CAF50" : "#2B333B",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "5px",
                                    cursor: "pointer",
                                }}
                                onClick={toggleDrawMode}
                            >
                                {isDrawMode ? "Disable Draw" : "Enable Draw"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ImageZoomPin;