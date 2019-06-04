const indentationChar = ' ';

const actionMapper = {
  addition: '+',
  subtraction: '-',
  notChanged: ' ',
};

const complexFormatter = (ast, depth = 2) => {
  const result = ast
    .map(({
      action,
      key,
      value,
      children = [],
    }) => `${indentationChar.repeat(depth)}${actionMapper[action]} ${key}: ${(!children.length) ? value : complexFormatter(children, depth + 4)}`)
    .join('\n');

  return `{
${result}
${indentationChar.repeat((depth > 2) ? depth - 2 : 0)}}`;
};

export default complexFormatter;
