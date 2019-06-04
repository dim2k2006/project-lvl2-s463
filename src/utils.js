const getKeys = (data1 = {}, data2 = {}) => [...Object.keys(data1), ...Object.keys(data2)]
  .reduce((accumulator, key) => {
    if (!accumulator.includes(key)) return [...accumulator, key];

    return accumulator;
  }, []);

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
