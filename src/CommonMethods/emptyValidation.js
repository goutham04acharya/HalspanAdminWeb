export default function isNotEmptyValidation (formData, setErrors) {
    let isValid = true;
    for (const key in formData) {
        if (formData[key].trim() === '') {
            setErrors(key, 'This field is mandatory');
            isValid = false;
        }
    }
    return isValid;
}