import actionTypes from '../../types/actionTypes';

/**
 * Reverses actions in ast tree
 * @param {Array} ast
 * @returns {Array}
 */
const reverseActions = ast => ast.map((item) => {
  const { action = actionTypes.DEFAULT, children = [] } = item;
  const processedChildren = reverseActions(children);

  if (action === actionTypes.DEFAULT) return { ...item, children: processedChildren };

  return {
    ...item,
    action: (action === actionTypes.SUBTRACTION)
      ? actionTypes.ADDITION
      : actionTypes.SUBTRACTION,
    children: processedChildren,
  };
});

export default reverseActions;
