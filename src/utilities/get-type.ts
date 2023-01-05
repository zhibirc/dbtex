export default function getType ( value: unknown ) {
    return Object.prototype.toString.call(value).slice(8, -1);
}
