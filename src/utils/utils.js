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
        minutes: Number(minutes.toFixed(2)),
        hours: Number(hours.toFixed(2)),
        days: Number(days.toFixed(2)),
    };
}
