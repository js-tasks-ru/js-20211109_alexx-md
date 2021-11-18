/**
 * trimSymbols - removes consecutive identical symbols if they quantity bigger that size
 * @param {string} string - the initial string
 * @param {number} size - the allowed size of consecutive identical symbols
 * @returns {string} - the new string without extra symbols according passed size
 */
export function trimSymbols(string, size) {
  if (size === 0 && string) {
    return '';
  }

  if (size === undefined && string) {
    return string;
  }

  const stringArray = string.split('');
  const newStringArray = stringArray.reduce((accum, value, index, array) => {
    if (!accum.length) {
      return [...value];
    }

    if (size === 1) {
      const lastSymbol = accum[accum.length - 1];

      if (lastSymbol !== value) {
        return [...accum, value];
      }
    } else {
      let counter = 0;
      for (let i = index - 1, stop = index - 1 - size; i > stop; i--) {
        if (i >= 0 && value === array[i]) {
          counter++;
        }
      }

      if (counter < size) {
        return [...accum, value];
      }
    }

    return accum;
  }, []);

  return newStringArray.join('');
}
