function addZero(number) {
    return number < 10 ? '0' + number : number;
}

function lastActiveText(lastActive) {
    const lastActiveDate = new Date(lastActive);
    const now = new Date();
    const diff = now.getTime() - lastActiveDate.getTime();
    const minutes = Math.floor(diff / 1000 / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(months / 12);

    if (years > 0) {
        return `${years} years ago`;
    } else if (months > 0) {
        return `${months} months ago`;
    } else if (days > 0) {
        return `${days} days ago`;
    } else if (hours > 0) {
        return `${hours} hours ago`;
    } else if (minutes > 0) {
        return `${minutes} minutes ago`;
    } else {
        return 'less than a minute ago';
    }
}

function formatDate(date, format) {
    if (format === 0) {
        return `${addZero(date.getDate())}/${addZero(date.getMonth() + 1)}/${date.getFullYear()}`;
    } else if (format === 1) {
        return `${addZero(date.getDate())}/${addZero(date.getMonth() + 1)}/${date.getFullYear()} ${addZero(date.getHours())}:${addZero(date.getMinutes())}`;
    } else if (format === 2) {
        console.log(lastActiveText(date));
        return lastActiveText(date);
    } else if (format === 3) {
        // create array of months strings
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
    } else {
        return date.getFullYear() + '-' + addZero(date.getMonth() + 1) + '-' + addZero(date.getDate());
    }
}

module.exports = formatDate;
module.exports = lastActiveText;