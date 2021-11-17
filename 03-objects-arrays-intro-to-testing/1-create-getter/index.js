/**
 * createGetter - creates function getter which allows select value from object
 * @param {string} path - the strings path separated by dot
 * @returns {function} - function-getter which allow get value from object by set path
 */
export function createGetter(path) {
  const pathArray = path.split('.');
  const pathArrayLength = pathArray.length;

  return (obj) => {
    if (pathArrayLength === 1) {
      return obj[path];
    }

    let tempObj = {};
    let result;

    pathArray.forEach((key, index) => {
      if (index === 0) {
        tempObj = {...obj[key]};
      }

      if (index === pathArrayLength - 1) {
        result = tempObj[key];
      }

      if (index !== 0) {
        tempObj = {...tempObj[key]};
      }
    });

    return result;
  };
}
