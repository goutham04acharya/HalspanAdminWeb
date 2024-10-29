import React, { useState } from 'react';
import ImageMarker from 'react-image-marker';

const MyImageMarker = ({ imageSrc }) => {
    const [markers, setMarkers] = useState([]);

    const handleAddMarker = (marker) => {
        setMarkers((prevMarkers) => [...prevMarkers, marker]);
    };

    const handleRemoveMarker = (markerId) => {
        setMarkers((prevMarkers) => prevMarkers.filter(marker => marker.id !== markerId));
    };

    return (
        <div>
            {/* <h1>Image Marker Example</h1> */}
            <ImageMarker
                src={imageSrc}
                markers={markers}
                onAddMarker={handleAddMarker}
                onRemoveMarker={handleRemoveMarker}
            />
            <ul>


                <button onClick={() => handleRemoveMarker()} className='bg-[#2B333B] mt-3 rounded-lg text-white text-[12px] px-3 py-2'>Remove</button>


            </ul>
        </div>
    );
};

export default MyImageMarker;