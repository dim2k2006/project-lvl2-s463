const indentationChar = ' ';

const nodeTypes = {
  added: node => `+ ${node.key}: ${node.newValue}`,
  removed: node => `- ${node.key}: ${node.oldValue}`,
  unchanged: node => `  ${node.key}: ${node.newValue}`,
  changed: node => `+ ${node.key}: ${node.newValue}\n  - ${node.key}: ${node.oldValue}`,
};

const complexFormatter = (ast, depth = 2) => {
  const string = ast
    .map(node => `${indentationChar.repeat(depth)}${nodeTypes[node.type](node)}`)
    .join('\n');

  return `{
${string}
}`;
};

export default complexFormatter;
