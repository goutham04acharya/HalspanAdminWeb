export default function formatTime (seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    const formattedTime = `${minutes}:${
        remainingSeconds < 10 ? '0' : ''
    }${remainingSeconds}`;
    return formattedTime;
};
