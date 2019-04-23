/**
 * Converts object to ast
 * @param {Object} data
 * @returns {Array}
 */
const getAst = (data = {}) => Object.keys(data).map((key) => {
  const value = data[key];

  if (!(value instanceof Object)) {
    return {
      key,
      value,
    };
  }

  return {
    key,
    value: '',
    children: getAst(value),
  };
});

const actionTypes = {
  ADDITION: '+',
  SUBTRACTION: '-',
  DEFAULT: ' ',
};

/**
 * Retrieves difference between two ast
 * @param {Array} ast1
 * @param {Array} ast2
 * @param {Boolean} reverseActions
 * @returns {Array}
 */
const getDiff = (ast1, ast2, reverseActions = false) => ast1
  .reduce((accumulator, { key: key1, value: value1, children: children1 = [] }) => {
    const comparedItem = ast2.find(({ key: key2 }) => key2 === key1);

    if (!comparedItem) {
      return [
        ...accumulator,
        {
          key: key1,
          value: value1,
          action: actionTypes.SUBTRACTION,
        },
      ];
    }

    const { key: key2, value: value2, children: children2 = [] } = comparedItem;

    const childDiff1 = getDiff(children1, children2);
    const childDiff2 = getDiff(children2, children1, true)
      .filter(({ key: ckey2 }) => !childDiff1.find(({ key: ckey1 }) => ckey1 === ckey2));

    const childDiff = [...childDiff1, ...childDiff2];

    // если есть чилдрены то сделать доп проверку
    // кажется что нет рекурсии, скрипт работает только на 1 уровень в глубину

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
          children: childDiff,
        },
        {
          key: key1,
          value: value1,
          action: actionTypes.SUBTRACTION,
          children: childDiff,
        },
      ];
    }

    return accumulator;
  }, [])
  .map((item) => {
    if (!reverseActions) return item;

    if (item.action === actionTypes.DEFAULT) return item;

    return {
      ...item,
      action: (item.action === actionTypes.SUBTRACTION)
        ? actionTypes.ADDITION
        : actionTypes.SUBTRACTION,
    };
  });

export default { getAst, getDiff };
