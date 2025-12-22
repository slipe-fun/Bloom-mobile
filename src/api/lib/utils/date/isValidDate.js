export default function (d) {
    if (d === null || d === undefined) return false;
    const date = new Date(d);
    return !isNaN(date.getTime());
};