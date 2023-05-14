export function getDatesBetween(date1, date2) {
    date2 = new Date(date2);
    let milliseconds = date1.getTime() - date2.getTime();
    let seconds = milliseconds / 1000;
    let minutes = seconds / 60;
    let hours = minutes / 60;
    let days = hours / 24;
    return {
        milliseconds,
        seconds,
        minutes: Math.floor(minutes),
        hours: Math.floor(hours),
        days: Math.floor(days),
    };
}

export function getPassedTime(date) {
    let {seconds, minutes, hours, days} = getDatesBetween(new Date(), new Date(date));
    if (days > 0) {
        if (days > 60) {
            return date.toString().replace(/\.\d+Z$/, '');
        }
        return `${days} Days`;
    }
    if (hours > 0) {
        return `${hours}H,${minutes % 60}Min`;
    }
    if (minutes > 0) {
        return `${minutes}Min,${Math.floor(seconds) % 60}sec`;
    }
    return `${seconds.toFixed(0)}Sec`;
}

export function getLeftTime(date) {
    let {seconds, minutes, hours, days} = getDatesBetween(new Date(date), new Date());
    if (days > 0) {
        if (days > 60) {
            return date.toString().replace(/\.\d+Z$/, '');
        }
        return `${days} Days`;
    }
    if (hours > 0) {
        return `${hours}H,${minutes % 60}Min`;
    }
    if (minutes > 0) {
        return `${minutes}Min,${Math.floor(seconds) % 60}sec`;
    }
    return `${seconds.toFixed(0)}Sec`;
}

export function addHourToDate(date, hours) {
    date = new Date(date);
    date.setHours(date.getHours() + hours);
    return date;
}