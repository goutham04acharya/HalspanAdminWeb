import { useState } from 'react';

function useObjects (initialState) {
    const [objects, setObjects] = useState(initialState);

    const handleSetObjects = (key, value) => {
        if(typeof key === 'object'){
            setObjects(key);
            return;
        }
        setObjects(prevState => ({
            ...prevState,
            [key]: value
        }));
    };

    return [objects, handleSetObjects];
}

export default useObjects;
