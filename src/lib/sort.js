export function byRandom() {
  return Math.random()
}

export function by(get) {
  return (a, b) => get(b) - get(a);
}
