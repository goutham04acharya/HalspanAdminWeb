export function isAllObjectValuesEqual(obj1, obj2) {
    if (!obj1 || !obj2) {
        return false;
    }
    // Helper function to compare two arrays
    const areArraysEqual = (arr1, arr2) => {
        if (!Array.isArray(arr1) || !Array.isArray(arr2)) return false;
        if (arr1.length !== arr2.length) return false;
        for (let i = 0; i < arr1.length; i++) {
            if (!isAllObjectValuesEqual(arr1[i], arr2[i])) return false;
        }
        return true;
    };

    // Check if both arguments are objects and not null
    if (typeof obj1 !== 'object' || obj1 === null || typeof obj2 !== 'object' || obj2 === null) {
        return obj1 === obj2;
    }

    // Get the keys of both objects
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    // If the number of keys is not equal, objects are not equal
    if (keys1.length !== keys2.length) {
        return false;
    }

    // Check if all keys and values are equal
    return keys1.every(key => {
        // Check if the key exists in the second object
        if (!obj2.hasOwnProperty(key)) {
            return false;
        }

        const value1 = obj1[key];
        const value2 = obj2[key];

        // If both values are objects, recursively compare them
        if (Array.isArray(value1) && Array.isArray(value2)) {
            return areArraysEqual(value1, value2);
        } else if (typeof value1 === 'object' && typeof value2 === 'object') {
            return isAllObjectValuesEqual(value1, value2);
        }

        // Otherwise, check if values are equal
        return value1 === value2;
    });
}

export function isArrayEqual(array1, array2) {
    console.log(array1, 'arr1')
    console.log(array2, 'arr2')
    if (array1?.length !== array2.length) {
        return false;
    }

    return array1.every((obj1, index) => {
        const obj2 = array2[index];
        return Object.keys(obj1).every(key => obj1[key] === obj2[key]);
    });
};