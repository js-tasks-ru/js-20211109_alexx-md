/**
 * sortStrings - sorts array of string by two criteria "asc" or "desc"
 * @param {string[]} arr - the array of strings
 * @param {string} [param="asc"] param - the sorting type "asc" or "desc"
 * @returns {string[]}
 */
export function sortStrings(arr, param = 'asc') {
  const copy = [...arr];
  const collator = new Intl.Collator(['ru', 'en'], { caseFirst: 'upper' });

  if (param === 'asc') {
    return copy.sort((a, b) => collator.compare(a, b));
  }

  return copy.sort((a, b) => -collator.compare(a, b));
}
