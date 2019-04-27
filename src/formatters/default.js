const indentationChar = ' ';

/**
 * Converts ast to string
 * @param {Array} ast
 * @param {Number} depth
 * @returns {String}
 */
const defaultFormatter = (ast, depth = 2) => {
  const result = ast
    .map(({
      action,
      key,
      value,
      children = [],
    }) => `${indentationChar.repeat(depth)}${action} ${key}: ${(!children.length) ? value : defaultFormatter(children, depth + 4)}`)
    .join('\n');

  return `{
${result}
${indentationChar.repeat((depth > 2) ? depth - 2 : 0)}}`;
};

export default defaultFormatter;
