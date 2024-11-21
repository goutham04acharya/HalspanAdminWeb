/* eslint-disable complexity */
export default function isNotEmptyValidation(formData, setErrors) {
    // debugger
    console.log(formData, 'form datatdtatdtajwdknwadm cajnca')
    let isValid = true;

    // Validate main fields in formData
    for (const key in formData) {
        if (key !== 'choices' && typeof formData[key] === 'string' && formData[key].trim() === '') {
            setErrors(key, 'This field is mandatory');
            isValid = false;
        }
    }

    // Handle choices validation
    if (formData?.choices?.length > 0 && isValid) {
        if (typeof formData.choices === 'string') {
            const values = formData.choices.split(',').map(val => val.trim());
            const hasEmptyValues = values.some(val => val === '');
            if (hasEmptyValues || formData.choices.trim() === '') {
                setErrors('choices', 'All values are mandatory');
                isValid = false;
            }
        } else if (Array.isArray(formData.choices) && formData.choices.length > 0) {
            // eslint-disable-next-line complexity
            formData.choices.forEach((choice, index) => {
                if (choice && typeof choice === 'object') {
                    // Validate uuid and value if they exist
                    if ('uuid' in choice && typeof choice.uuid === 'string' && choice.uuid.trim() === '') {
                        setErrors(`choices[${index}].uuid`, 'UUID is mandatory');
                        isValid = false;
                    }

                    if ('value' in choice && typeof choice.value === 'string') {
                        const values = choice.value.split(',').map(val => val.trim());
                        const hasEmptyValues = values.some(val => val === '');
                        
                        if (hasEmptyValues || choice.value.trim() === '') {
                            setErrors(`choices[${index}].value`, 'All values are mandatory');
                            isValid = false;
                        }
                    } else if (!('value' in choice) || choice.value === undefined) {
                        setErrors(`choices[${index}].value`, 'Value is mandatory');
                        isValid = false;
                    }
                } else if (typeof choice === 'string' && choice.trim() === '') {
                    setErrors(`choices[${index}]`, 'Value is mandatory');
                    isValid = false;
                }
            });
        } 
    }else if (formData.choices.length < 1) {
        // debugger
        setErrors('choices', 'This field is mandatory');
        isValid = false;
    }

    return isValid;
}
