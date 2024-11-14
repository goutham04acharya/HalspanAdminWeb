// eslint-disable-next-line complexity
export default function isNotEmptyValidation(formData, setErrors) {
    let isValid = true;

    // Validate main fields in formData
    for (const key in formData) {
        if (key !== 'choices' && formData[key].trim() === '') {
            setErrors(key, 'This field is mandatory');
            isValid = false;
        }
    }

    // Handle choices validation
    if (formData.choices) {
        // Case 1: Choices is a string (comma-separated values)
        if (typeof formData.choices === 'string') {
            const values = formData.choices.split(',').map(val => val.trim());
            const hasEmptyValues = values.some(val => val === '');
            
            if (hasEmptyValues || formData.choices.trim() === '') {
                setErrors('choices', 'All values are mandatory');
                isValid = false;
            }
        }
        // Case 2: Choices is an array of objects with uuid and value
        else if (Array.isArray(formData.choices)) {
            formData.choices.forEach((choice, index) => {
                // If the choice has a uuid property, validate both uuid and value
                if ('uuid' in choice) {
                    if (choice.uuid?.trim() === '') {
                        setErrors(`choices[${index}].uuid`, 'UUID is mandatory');
                        isValid = false;
                    }
                    
                    // Handle comma-separated values within each choice object
                    if (choice.value) {
                        const values = choice.value.split(',').map(val => val.trim());
                        const hasEmptyValues = values.some(val => val === '');
                        
                        if (hasEmptyValues || choice.value.trim() === '') {
                            setErrors(`choices[${index}].value`, 'All values are mandatory');
                            isValid = false;
                        }
                    } else {
                        setErrors(`choices[${index}].value`, 'Value is mandatory');
                        isValid = false;
                    }
                }
                // If the choice is a simple value (no uuid)
                else if (typeof choice === 'string' && choice.trim() === '') {
                    setErrors(`choices[${index}]`, 'Value is mandatory');
                    isValid = false;
                }
            });
        }
        // Case 3: Choices exists but is empty
        else if (!formData.choices || 
                (Array.isArray(formData.choices) && formData.choices.length === 0)) {
            setErrors('choices', 'At least one choice is required');
            isValid = false;
        }
    }

    return isValid;
}

// Example usage:
/*
// Case 1: Comma-separated string
const formData1 = {
    name: "Test",
    choices: "value1, value2, value3"
};

// Case 2: Array of objects with uuid
const formData2 = {
    name: "Test",
    choices: [
        { uuid: "123", value: "value1, value2" },
        { uuid: "456", value: "value3, value4" }
    ]
};

// Case 3: Simple array
const formData3 = {
    name: "Test",
    choices: ["value1", "value2", "value3"]
};
*/