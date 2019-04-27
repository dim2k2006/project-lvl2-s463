import actionTypes from '../types/actionTypes';

/**
 * Converts ast to string
 * @param {Array} ast
 * @param {Number} depth
 * @returns {String}
 */
const plainFormatter = (ast) => {
  const result = ast.reduce((accumulator, {
    action,
    key,
    value,
    children = [],
  }) => {
    if (accumulator.find(item => item.key === key)) return accumulator;

    if (action === actionTypes.DEFAULT) return accumulator;

    const siblingItem = ast.find(item => item.key === key && item.action !== action);

    if (action === actionTypes.ADDITION && !siblingItem) return [...accumulator, { key, message: `Property '${key}' was added with value: ${value}` }];

    if (action === actionTypes.SUBTRACTION && !siblingItem) return [...accumulator, { key, message: `Property '${key}' was removed` }];

    const oldValue = (action === actionTypes.ADDITION) ? siblingItem.value : value;
    const newValue = (action === actionTypes.ADDITION) ? value : siblingItem.value;

    return [...accumulator, { key, message: `Property '${key}' was updated. From ${oldValue} to ${newValue}` }];
  }, [])
    .map(item => item.message)
    .join('\n');

  console.log('result:', result);

  return result;

//   const result = ast
//     .map(({
//       action,
//       key,
//       value,
//       children = [],
//     }) => `${indentationChar.repeat(depth)}${action} ${key}: ${(!children.length) ? value : plainFormatter(children, depth + 4)}`)
//     .join('\n');
//
//   return `{
// ${result}
// ${indentationChar.repeat((depth > 2) ? depth - 2 : 0)}}`;
};

export default plainFormatter;
