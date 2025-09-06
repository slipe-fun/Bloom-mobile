export default function btoaToUint8Array(str) {
    if (!str) return new Uint8Array();
    const binary = atob(str);
    const len = binary.length;
    const arr = new Uint8Array(len);
    for (let i = 0; i < len; i++) arr[i] = binary.charCodeAt(i);
    return arr;
}
