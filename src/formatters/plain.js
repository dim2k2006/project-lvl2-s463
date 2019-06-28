const placeholder = '[complex value]';

const genFullPath = (path = '', key) => {
  if (!path) return key;

  return `${path}.${key}`;
};

const stringify = (value) => {
  if (!(value instanceof Object)) return value;

  return placeholder;
};

const nodeTypes = {
  nested: (node, path, fn) => fn(node.newValue, genFullPath(path, node.key)),

  added: (node, path) => `Property '${genFullPath(path, node.key)}' was added with value: ${stringify(node.newValue)}`,

  removed: (node, path) => `Property '${genFullPath(path, node.key)}' was removed`,

  changed: (node, path) => `Property '${genFullPath(path, node.key)}' was updated. From ${stringify(node.oldValue)} to ${stringify(node.newValue)}`,
};

const plainFormatter = (ast, path = '') => {
  const string = ast
    .filter(node => node.type !== 'unchanged')
    .map(node => `${nodeTypes[node.type](node, path, plainFormatter)}`)
    .join('\n');

  return string;
};

export default plainFormatter;
