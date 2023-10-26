export function colorInRange(range, value) {
  const [min, max] = range;
  const hue = (value - min) / (max - min) * 100;
  return `hsla(${hue}, 100%, 50%, 1)`;
}
