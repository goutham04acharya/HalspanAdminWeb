export const DateValidator = (ternaryStr) => {
    const regex = /(?:\?|\:)\s*["']([^"']+)["']/g;
    const results = [];
    let match;

    // Loop through all matches of the regex pattern
    while ((match = regex.exec(ternaryStr)) !== null) {
        results.push(match[1].trim()); // Extract the value between quotes after ? or :
    }

    // Function to validate date format (dd/mm/yyyy)
    const isValidDate = (str) => {
        const dateRegex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;
        return dateRegex.test(str);
    };

    // Filter out values that do not match the date pattern
    const invalidDates = results.filter(date => !isValidDate(date));

    // If there are invalid dates, return the invalid dates array
    if (invalidDates.length > 0) {
        return invalidDates;
    }

    // If all dates are valid, return false
    return false;
};