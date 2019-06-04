const placeholder = '[complex value]';

const withPath = (ast, path = '') => ast.map((item) => {
  const { key = '', children = [] } = item;
  const newPath = `${(path === '') ? key : `${path}.${key}`}`;

  return {
    ...item,
    path: newPath,
    children: withPath(children, newPath),
  };
});

const getValue = (children, value, holder) => {
  const result = (!children.length) ? value : holder;

  return result;
};

const iter = tree => tree
  .reduce((accumulator, {
    action,
    key,
    value,
    children = [],
    path = '',
  }) => {
    if (accumulator.find(item => item.key === key)) return accumulator;

    if (action === 'unchanged' && !children.length) return accumulator;

    const childrenAccumulator = iter(children);

    if (action === 'unchanged' && children.length) {
      return [...accumulator, ...childrenAccumulator];
    }

    const siblingItem = tree.find(item => item.key === key && item.action !== action);

    if (action === 'removed' && !siblingItem) {
      return [...accumulator, { key, message: `Property '${path}' was removed` }];
    }

    if (action === 'added' && !siblingItem) {
      return [...accumulator, { key, message: `Property '${path}' was added with value: ${getValue(children, value, placeholder)}` }, ...childrenAccumulator];
    }

    const siblingValue = getValue(siblingItem.children, siblingItem.value, placeholder);
    const currentValue = getValue(children, value, placeholder);

    const oldValue = (action === 'added') ? siblingValue : currentValue;
    const newValue = (action === 'added') ? currentValue : siblingValue;

    return [...accumulator, { key, message: `Property '${path}' was updated. From ${oldValue} to ${newValue}` }, ...childrenAccumulator];
  }, []);

const plainFormatter = ast => iter(withPath(ast))
  .map(item => item.message)
  .join('\n');

export default plainFormatter;
