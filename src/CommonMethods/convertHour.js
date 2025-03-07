// Helper function to convert 24-hour format to 12-hour format
export const convertTo12Hour = (time) => {
    if (!time) return '';

    const [hours, minutes, seconds] = time.split(':');
    const hourNum = parseInt(hours, 10);

    if (hourNum === 0) {
        return `12:${minutes}:${seconds} AM`;
    } else if (hourNum < 12) {
        return `${hourNum.toString().padStart(2, '0')}:${minutes}:${seconds} AM`;
    } else if (hourNum === 12) {
        return `12:${minutes}:${seconds} PM`;
    } else {
        return `${(hourNum - 12).toString().padStart(2, '0')}:${minutes}:${seconds} PM`;
    }
}

// Helper function to convert 12-hour format to 24-hour format
export const convertTo24Hour = (time) => {
    if (!time) return '';

    const [timePart, ampm] = time.split(' ');
    if (!timePart || !ampm) return '';

    const [hours, minutes, seconds] = timePart.split(':');
    if (!hours || !minutes || !seconds) return '';

    const hourNum = parseInt(hours, 10);

    if (ampm.toUpperCase() === 'AM') {
        if (hourNum === 12) {
            return `00:${minutes}:${seconds}`;
        } else {
            return `${hourNum.toString().padStart(2, '0')}:${minutes}:${seconds}`;
        }
    } else { // PM
        if (hourNum === 12) {
            return `12:${minutes}:${seconds}`;
        } else {
            return `${(hourNum + 12).toString().padStart(2, '0')}:${minutes}:${seconds}`;
        }
    }
}