import { keys } from 'lodash';

const indentationChar = ' ';
const indentSize = 4;
const serviceCharLength = 2;

const stringify = (value, indent) => {
  if (!(value instanceof Object)) return value;

  const newIndent = indent + indentSize; // если это объект то все его свойства будут на один уровень отступа правее

  const openingBracket = '{';
  const closingBracket = (newIndent > indentSize) ? `${indentationChar.repeat(newIndent - indentSize)}}` : '}';
  const indentString = indentationChar.repeat(newIndent - serviceCharLength);

  const key = keys(value)[0];
  const val = value[key];
  const output = `  ${key}: ${val}`;

  return `${openingBracket}\n${indentString}${output}\n${closingBracket}`;
};

const nodeTypes = {
  nested: (node, indent, indentString, fn) => `  ${node.key}: ${fn(node.newValue, indent + indentSize)}`,
  added: (node, indent) => `+ ${node.key}: ${stringify(node.newValue, indent)}`,
  removed: (node, indent) => `- ${node.key}: ${stringify(node.oldValue, indent)}`,
  unchanged: (node, indent) => `  ${node.key}: ${stringify(node.newValue, indent)}`,
  changed: (node, indent, indentString) => `+ ${node.key}: ${stringify(node.newValue, indent)}\n${indentString}- ${node.key}: ${stringify(node.oldValue, indent)}`,
};

const complexFormatter = (ast, indent = indentSize) => {
  const openingBracket = '{';
  const closingBracket = (indent > indentSize) ? `${indentationChar.repeat(indent - indentSize)}}` : '}';

  const output = ast
    .map((node) => {
      const indentString = indentationChar.repeat(indent - serviceCharLength);
      const value = nodeTypes[node.type](node, indent, indentString, complexFormatter);

      return `${indentString}${value}`;
    })
    .join('\n');

  return `${openingBracket}\n${output}\n${closingBracket}`;
};

export default complexFormatter;
