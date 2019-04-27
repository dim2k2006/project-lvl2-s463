import actionTypes from '../types/actionTypes';

const placeholder = '[complex value]';

/**
 * Returns value or placeholder
 * @param {Array} children
 * @param {String} value
 * @returns {string}
 */
const getValue = (children, value) => {
  const result = (!children.length) ? value : placeholder;

  return result;
};

/**
 * Converts ast to string
 * @param {Array} ast
 * @param {Number} depth
 * @returns {String}
 */
const plainFormatter = (ast) => {
  const iter = (tree) => {
    return tree.reduce((accumulator, {
      action,
      key,
      value,
      children = [],
      path = '',
    }) => {
      if (accumulator.find(item => item.key === key)) return accumulator;

      if (action === actionTypes.DEFAULT && !children.length) return accumulator;

      const childrenAccumulator = iter(children);

      if (action === actionTypes.DEFAULT && children.length) return [...accumulator, ...childrenAccumulator];

      const siblingItem = tree.find(item => item.key === key && item.action !== action);

      if (action === actionTypes.SUBTRACTION && !siblingItem) return [...accumulator, { key, message: `Property '${path}' was removed` }];

      if (action === actionTypes.ADDITION && !siblingItem) return [...accumulator, { key, message: `Property '${path}' was added with value: ${getValue(children, value)}` }, ...childrenAccumulator];

      const siblingValue = getValue(siblingItem.children, siblingItem.value);
      const currentValue = getValue(children, value);

      const oldValue = (action === actionTypes.ADDITION) ? siblingValue : currentValue;
      const newValue = (action === actionTypes.ADDITION) ? currentValue : siblingValue;

      return [...accumulator, { key, message: `Property '${path}' was updated. From ${oldValue} to ${newValue}` }, ...childrenAccumulator];
    }, []);
  };

  const result = iter(ast);

  return result
    .map(item => item.message)
    .join('\n');
};

export default plainFormatter;
