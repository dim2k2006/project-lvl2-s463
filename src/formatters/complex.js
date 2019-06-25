import { keys } from 'lodash';

const indentationChar = ' ';
const indentSize = 4;
const serviceCharLength = 2;

const getBrackets = (indent, defaultIndent) => ({
  openingBracket: '{',
  closingBracket: `${(indent > defaultIndent) ? indentationChar.repeat(indent - defaultIndent) : ''}}`,
});

const stringify = (value, indent) => {
  if (!(value instanceof Object)) return value;

  const { openingBracket, closingBracket } = getBrackets(indent, indentSize);

  const indentString = indentationChar.repeat(indent - serviceCharLength);

  const key = keys(value)[0];
  const val = value[key];
  const output = `  ${key}: ${val}`;

  return `${openingBracket}\n${indentString}${output}\n${closingBracket}`;
};

const nodeTypes = {
  nested: (node, indent, indentString, fn) => `  ${node.key}: ${fn(node.newValue, indent + indentSize)}`,

  added: (node, indent) => `+ ${node.key}: ${stringify(node.newValue, indent + indentSize)}`,

  removed: (node, indent) => `- ${node.key}: ${stringify(node.oldValue, indent + indentSize)}`,

  unchanged: (node, indent) => `  ${node.key}: ${stringify(node.newValue, indent + indentSize)}`,

  changed: (node, indent, indentString) => {
    const addedValue = `+ ${node.key}: ${stringify(node.newValue, indent + indentSize)}`;
    const removedValue = `${indentString}- ${node.key}: ${stringify(node.oldValue, indent + indentSize)}`;

    return `${addedValue}\n${removedValue}`;
  },
};

const complexFormatter = (ast, indent = indentSize) => {
  const { openingBracket, closingBracket } = getBrackets(indent, indentSize);

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
