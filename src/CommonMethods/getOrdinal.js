export default function getOrdinal(index) {
    const baseOrdinals = [
        "Zeroth", "First", "Second", "Third", "Fourth", "Fifth", "Sixth", "Seventh", 
        "Eighth", "Ninth", "Tenth", "Eleventh", "Twelfth", "Thirteenth", "Fourteenth", 
        "Fifteenth", "Sixteenth", "Seventeenth", "Eighteenth", "Nineteenth",
        "Twentieth", "Twenty-First", "Twenty-Second", "Twenty-Third", "Twenty-Fourth", 
        "Twenty-Fifth", "Twenty-Sixth", "Twenty-Seventh", "Twenty-Eighth", "Twenty-Ninth",
        "Thirtieth", "Thirty-First", "Thirty-Second", "Thirty-Third", "Thirty-Fourth", 
        "Thirty-Fifth", "Thirty-Sixth", "Thirty-Seventh", "Thirty-Eighth", "Thirty-Ninth",
        "Fortieth", "Forty-First", "Forty-Second", "Forty-Third", "Forty-Fourth", 
        "Forty-Fifth", "Forty-Sixth", "Forty-Seventh", "Forty-Eighth", "Forty-Ninth",
        "Fiftieth", "Fifty-First", "Fifty-Second", "Fifty-Third", "Fifty-Fourth", 
        "Fifty-Fifth", "Fifty-Sixth", "Fifty-Seventh", "Fifty-Eighth", "Fifty-Ninth",
        "Sixtieth", "Sixty-First", "Sixty-Second", "Sixty-Third", "Sixty-Fourth", 
        "Sixty-Fifth", "Sixty-Sixth", "Sixty-Seventh", "Sixty-Eighth", "Sixty-Ninth",
        "Seventieth", "Seventy-First", "Seventy-Second", "Seventy-Third", "Seventy-Fourth", 
        "Seventy-Fifth", "Seventy-Sixth", "Seventy-Seventh", "Seventy-Eighth", "Seventy-Ninth",
        "Eightieth", "Eighty-First", "Eighty-Second", "Eighty-Third", "Eighty-Fourth", 
        "Eighty-Fifth", "Eighty-Sixth", "Eighty-Seventh", "Eighty-Eighth", "Eighty-Ninth",
        "Ninetieth", "Ninety-First", "Ninety-Second", "Ninety-Third", "Ninety-Fourth", 
        "Ninety-Fifth", "Ninety-Sixth", "Ninety-Seventh", "Ninety-Eighth", "Ninety-Ninth",
        "One Hundredth"
    ];

    if (index < 101) {
        return baseOrdinals[index];
    }

    const getSuffix = (num) => {
        const lastDigit = num % 10;
        const lastTwoDigits = num % 100;

        if (lastTwoDigits >= 11 && lastTwoDigits <= 13) {
            return "th";
        }

        switch (lastDigit) {
        case 1: return "st";
        case 2: return "nd";
        case 3: return "rd";
        default: return "th";
        }
    };

    const suffix = getSuffix(index);
    return `${index}${suffix}`;
};