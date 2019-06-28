import { keys, flatten } from 'lodash';

const indentationChar = ' ';
const indentSize = 4;
const serviceCharLength = 2;

const getBrackets = (depth, indent) => ({
  openingBracket: '{',
  closingBracket: `${(depth > 1) ? indentationChar.repeat(depth * indent - indent) : ''}}`,
});

const stringify = (value, depth) => {
  if (!(value instanceof Object)) return value;

  const { openingBracket, closingBracket } = getBrackets(depth, indentSize);
  const indentString = indentationChar.repeat(depth * indentSize - serviceCharLength);

  const key = keys(value)[0];
  const val = value[key];
  const output = `  ${key}: ${val}`;

  return `${openingBracket}\n${indentString}${output}\n${closingBracket}`;
};

const nodeTypes = {
  nested: (node, depth, fn) => `  ${node.key}: ${fn(node.newValue, depth + 1)}`,

  added: (node, depth) => `+ ${node.key}: ${stringify(node.newValue, depth + 1)}`,

  removed: (node, depth) => `- ${node.key}: ${stringify(node.oldValue, depth + 1)}`,

  unchanged: (node, depth) => `  ${node.key}: ${stringify(node.newValue, depth + 1)}`,

  changed: (node, depth) => ([
    `+ ${node.key}: ${stringify(node.newValue, depth + 1)}`,
    `- ${node.key}: ${stringify(node.oldValue, depth + 1)}`,
  ]),
};

const complexFormatter = (ast, depth = 1) => {
  const { openingBracket, closingBracket } = getBrackets(depth, indentSize);
  const indentString = indentationChar.repeat(depth * indentSize - serviceCharLength);

  const values = ast.map(node => nodeTypes[node.type](node, depth, complexFormatter));
  const flattenedValues = flatten(values);
  const output = flattenedValues
    .map((value => `${indentString}${value}`))
    .join('\n');

  return `${openingBracket}\n${output}\n${closingBracket}`;
};

export default complexFormatter;
