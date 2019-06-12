const indentationChar = ' ';

const typeMapper = {
  added: '+',
  removed: '-',
  unchanged: ' ',
};

const complexFormatter = (ast, depth = 2) => {
  const result = ast
    .map(({
      type,
      key,
      value,
      children = [],
    }) => `${indentationChar.repeat(depth)}${typeMapper[type]} ${key}: ${(!children.length) ? value : complexFormatter(children, depth + 4)}`)
    .join('\n');

  return `{
${result}
${indentationChar.repeat((depth > 2) ? depth - 2 : 0)}}`;
};

export default complexFormatter;
