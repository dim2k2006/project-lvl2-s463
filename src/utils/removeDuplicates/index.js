/**
 * Removes duplicated nodes in ast according to origin ast
 * @param {Array} origin ast
 * @returns {Function}
 */
const removeDuplicates = origin => ast => ast
  .filter(({ key: key2 }) => !origin.find(({ key: key1 }) => key1 === key2));

export default removeDuplicates;
