export function daysInPast(s) {
  //get date from string
  var b = s.split(/\D+/);
  const date = new Date(Date.UTC(b[0], --b[1], b[2], b[3], b[4], b[5], b[6]))
  const today = new Date()
  const timeDifference = today - date;

  const daysInPast = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

  return daysInPast
}

export function dateText(stringDate) {
  const d = daysInPast(stringDate)
  if (d == 0) {
    return "Set i dag"
  } else if (d == 1) {
    return "Set i går"
  } else {
    return "Set for {d} dage siden"
  }
}