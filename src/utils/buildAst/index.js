/**
 * Builds ast from data
 * @param {Object} data
 * @returns {Array}
 */
const buildAst = (data = {}) => Object.keys(data).map((key) => {
  const value = data[key];

  if (!(value instanceof Object)) {
    return {
      key,
      value,
    };
  }

  return {
    key,
    value: '',
    children: buildAst(value),
  };
});

export default buildAst;
