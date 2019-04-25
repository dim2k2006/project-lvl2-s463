import actionTypes from './utils/actionTypes';
import removeDuplicates from './utils/removeDuplicates';
import reverseActions from './utils/reverseActions';

/**
 * Retrieves difference between two ast
 * @param {Array} ast1
 * @param {Array} ast2
 * @returns {Array}
 */
const getDiff = (ast1, ast2) => ast1
  .reduce((accumulator, { key: key1, value: value1, children: children1 = [] }) => {
    const comparedItem = ast2.find(({ key: key2 }) => key2 === key1);

    if (!comparedItem) {
      return [
        ...accumulator,
        {
          key: key1,
          value: value1,
          action: actionTypes.SUBTRACTION,
          children: getDiff(children1, children1),
        },
      ];
    }

    const { value: value2, children: children2 = [] } = comparedItem;

    const childDiff1 = getDiff(children1, children2);
    const childDiff2 = removeDuplicates(childDiff1)(reverseActions(getDiff(children2, children1)));

    const childDiff = [...childDiff1, ...childDiff2];

    if (value1 === value2) {
      return [
        ...accumulator,
        {
          key: key1,
          value: value1,
          action: actionTypes.DEFAULT,
          children: childDiff,
        },
      ];
    }

    if (value1 !== value2) {
      return [
        ...accumulator,
        {
          key: key1,
          value: value2,
          action: actionTypes.ADDITION,
          children: getDiff(children2, children2),
        },
        {
          key: key1,
          value: value1,
          action: actionTypes.SUBTRACTION,
          children: getDiff(children1, children1),
        },
      ];
    }

    return accumulator;
  }, []);

export default { getDiff };
