export function byRandom(_, __) {
  return Math.random()
}

export function by(get) {
  return (a, b) => get(b) - get(a);
}
