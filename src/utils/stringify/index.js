const indentationChar = ' ';

/**
 * Converts ast to string
 * @param {Array} ast
 * @param {Number} depth
 * @returns {String}
 */
const stringify = (ast, depth = 2) => {
  const result = ast
    .map(({
      action,
      key,
      value,
      children = [],
    }) => {

      return `${indentationChar.repeat(depth)}${action} ${key}: ${(!children.length) ? value : stringify(children, depth + 4)}`;
    })
    .join('\n');

  return `{
${result}
${indentationChar.repeat((depth > 2) ? depth - 2 : 0)}}`;
};

export default stringify;
