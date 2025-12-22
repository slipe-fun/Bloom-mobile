import isValidDate from "./isValidDate";

export default function (d1, d2) {
    if (!isValidDate(d1) || !isValidDate(d2)) return false;
    const date1 = new Date(d1);
    const date2 = new Date(d2);
    return date1.getFullYear() === date2.getFullYear() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getDate() === date2.getDate();
};