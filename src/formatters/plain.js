import actionTypes from '../actionTypes';

const placeholder = '[complex value]';

/**
 * Returns value or placeholder
 * @param {Array} children
 * @param {String} value
 * @param {String} holder
 * @returns {string}
 */
const getValue = (children, value, holder) => {
  const result = (!children.length) ? value : holder;

  return result;
};

/**
 * Converts ast to string
 * @param {Array} ast
 * @returns {String}
 */
const plainFormatter = (ast) => {
  const iter = tree => tree
    .reduce((accumulator, {
      action,
      key,
      value,
      children = [],
      path = '',
    }) => {
      if (accumulator.find(item => item.key === key)) return accumulator;

      if (action === actionTypes.DEFAULT && !children.length) return accumulator;

      const childrenAccumulator = iter(children);

      if (action === actionTypes.DEFAULT && children.length) {
        return [...accumulator, ...childrenAccumulator];
      }

      const siblingItem = tree.find(item => item.key === key && item.action !== action);

      if (action === actionTypes.SUBTRACTION && !siblingItem) {
        return [...accumulator, { key, message: `Property '${path}' was removed` }];
      }

      if (action === actionTypes.ADDITION && !siblingItem) {
        return [...accumulator, { key, message: `Property '${path}' was added with value: ${getValue(children, value, placeholder)}` }, ...childrenAccumulator];
      }

      const siblingValue = getValue(siblingItem.children, siblingItem.value, placeholder);
      const currentValue = getValue(children, value, placeholder);

      const oldValue = (action === actionTypes.ADDITION) ? siblingValue : currentValue;
      const newValue = (action === actionTypes.ADDITION) ? currentValue : siblingValue;

      return [...accumulator, { key, message: `Property '${path}' was updated. From ${oldValue} to ${newValue}` }, ...childrenAccumulator];
    }, []);

  return iter(ast)
    .map(item => item.message)
    .join('\n');
};

export default plainFormatter;
