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

export default withPath;
