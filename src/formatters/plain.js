// const placeholder = '[complex value]';

const nodeTypes = {
  added: node => `Property '${node.key}' was added with value: ${node.newValue}`,
  removed: node => `Property '${node.key}' was removed`,
  changed: node => `Property '${node.key}' was updated. From ${node.oldValue} to ${node.newValue}`,
};

const plainFormatter = (ast) => {
  const string = ast
    .filter(node => node.type !== 'unchanged')
    .map(node => `${nodeTypes[node.type](node)}`)
    .join('\n');

  return string;
};

export default plainFormatter;
