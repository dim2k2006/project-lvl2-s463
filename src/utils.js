/**
 * Retrieves keys from two objects
 * @param {Object} data1
 * @param {Object} data2
 * @returns {Array}
 */
const getKeys = (data1 = {}, data2 = {}) => [...Object.keys(data1), ...Object.keys(data2)]
  .reduce((accumulator, key) => {
    if (!accumulator.includes(key)) return [...accumulator, key];

    return accumulator;
  }, []);

/**
 * Adds path to ast nodes
 * @param {Array} ast
 * @param {String} path
 * @returns {Array}
 */
const withPath = (ast, path = '') => ast.map((item) => {
  const { key = '', children = [] } = item;
  const newPath = `${(path === '') ? key : `${path}.${key}`}`;

  return {
    ...item,
    path: newPath,
    children: withPath(children, newPath),
  };
});

export default { getKeys, withPath };
