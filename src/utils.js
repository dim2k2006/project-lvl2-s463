import has from 'lodash/has';
import actionTypes from './types/actionTypes';

/**
 * Retrieves keys from two objects
 * @param {Object} data1
 * @param {Object} data2
 * @returns {Array}
 */
const getKeys = (data1 = {}, data2 = {}) => [...Object.keys(data1), ...Object.keys(data2)]
  .reduce((accumulator, key) => {
    if (!accumulator.includes(key)) return [...accumulator, key];

    return accumulator;
  }, []);

/**
 * Retrieves diff between two objects
 * @param {Array} keys
 * @param {Object} data1
 * @param {Object} data2
 * @returns {Array}
 */
const getDiff = (keys = [], data1 = {}, data2 = {}) => keys
  .reduce((accumulator, key) => {
    if (!has(data1, key) && has(data2, key)) {
      return [
        ...accumulator,
        {
          key,
          value: data2[key],
          action: actionTypes.ADDITION,
        },
      ];
    }

    if (has(data1, key) && !has(data2, key)) {
      return [
        ...accumulator,
        {
          key,
          value: data1[key],
          action: actionTypes.SUBTRACTION,
        },
      ];
    }

    if (has(data1, key) && has(data2, key) && data1[key] === data2[key]) {
      return [
        ...accumulator,
        {
          key,
          value: data1[key],
          action: actionTypes.DEFAULT,
        },
      ];
    }

    if (has(data1, key) && has(data2, key) && data1[key] !== data2[key]) {
      return [
        ...accumulator,
        {
          key,
          value: data2[key],
          action: actionTypes.ADDITION,
        },
        {
          key,
          value: data1[key],
          action: actionTypes.SUBTRACTION,
        },
      ];
    }

    return accumulator;
  }, []);

/**
 * Adds path to ast nodes
 * @param {Array} ast
 * @param {String} path
 * @returns {Array}
 */
const withPath = (ast, path = '') => ast.map((item) => {
  const { key = '', children = [] } = item;
  const newPath = `${(path === '') ? key : `${path}.${key}`}`;

  return {
    ...item,
    path: newPath,
    children: withPath(children, newPath),
  };
});

export default { getKeys, getDiff, withPath };
