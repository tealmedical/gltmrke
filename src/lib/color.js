/**
 * Takes advantage of the fact that red-yellow-green is next to each other
 * on the hue part of the hsl scale
 */
export function colorInRange(range, value) {
  const [min, max] = range;
  const hue = (value - min) / (max - min) * 100;
  return `hsla(${hue}, 100%, 50%, 1)`;
}
