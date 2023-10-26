/**
 * Prepares a string for usage in URLs
 * 
 * - makes lowercase,
 * - converts spaces to dashes, and
 * - removes anything but a-z, æøå & dash.
 */
export function urlify(name) {
  return name.toLowerCase()
    .replace(/\s/g, '-') // convert space to dash
    .replace(/[^0-9a-zæøå\s\-]/g, ''); // keep only letters and dashes
}