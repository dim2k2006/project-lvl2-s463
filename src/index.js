import fs from 'fs';
import path from 'path';
import has from 'lodash/has';
import flow from 'lodash/flow';
import { safeLoad } from 'js-yaml';

const parseFnTypes = {
  json: JSON.parse,
  yaml: safeLoad,
};

const actionTypes = {
  ADDITION: '+',
  SUBTRACTION: '-',
  DEFAULT: ' ',
};

/**
 * Reads files
 * @param {String} path1
 * @param {String} path2
 * @returns {Object}
 */
const readFiles = (path1, path2) => {
  const file1 = fs.readFileSync(path.resolve(path1), 'utf8');
  const file2 = fs.readFileSync(path.resolve(path2), 'utf8');

  return {
    path1,
    path2,
    file1,
    file2,
    ext1: path.extname(path1).slice(1),
    ext2: path.extname(path2).slice(1),
  };
};

/**
 * Parses files
 * @param {Object} props
 * @returns {Object}
 */
const parseFiles = (props) => {
  const {
    ext1,
    ext2,
    file1,
    file2,
  } = props;

  return {
    ...props,
    data1: parseFnTypes[ext1](file1),
    data2: parseFnTypes[ext2](file2),
  };
};

/**
 * Retrieves data keys
 * @param {Object} props
 * @returns {Object}
 */
const getKeys = (props) => {
  const { data1, data2 } = props;
  const keys1 = Object.keys(data1);
  const keys2 = Object.keys(data2).filter(key => !keys1.includes(key));

  return {
    ...props,
    keys1,
    keys2,
  };
};

/**
 * Retrieves difference between two objects by key
 * @param {Object} data1
 * @param {Object} data2
 * @param {String} key
 * @returns {Array}
 */
const getDiffByKey = (data1, data2, key) => {
  if (has(data1, key) && has(data2, key) && data1[key] === data2[key]) {
    return [{ key, value: data1[key], action: actionTypes.DEFAULT }];
  }

  if (has(data1, key) && has(data2, key) && data1[key] !== data2[key]) {
    return [
      { key, value: data2[key], action: actionTypes.ADDITION },
      { key, value: data1[key], action: actionTypes.SUBTRACTION },
    ];
  }

  if (has(data1, key) && !has(data2, key)) {
    return [{ key, value: data1[key], action: actionTypes.SUBTRACTION }];
  }

  if (!has(data1, key) && has(data2, key)) {
    return [{ key, value: data2[key], action: actionTypes.ADDITION }];
  }

  return [{ key, value: data1[key], action: actionTypes.DEFAULT }];
};

/**
 * Retrieves the diff between data
 * @param {Object} props
 * @returns {Object}
 */
const getDiff = (props) => {
  const {
    data1,
    data2,
    keys1,
    keys2,
  } = props;

  const iter = (index, accumulator) => {
    const key1 = keys1[index];
    const key2 = keys2[index];

    if (!key1 && !key2) return accumulator;

    const diff1 = (key1) ? getDiffByKey(data1, data2, key1) : [];
    const diff2 = (key2) ? getDiffByKey(data1, data2, key2) : [];

    return iter(index + 1, [...accumulator, ...diff1, ...diff2]);
  };

  return {
    ...props,
    diff: iter(0, []),
  };
};

/**
 * Formats the result
 * @param {Object} props
 * @returns {String}
 */
const format = (props) => {
  const { diff } = props;
  const result = diff
    .map(item => `  ${item.action} ${item.key}: ${item.value}`)
    .join('\n');

  return `{
${result}
}
`;
};

/**
 * Generates diff between two files
 * @param {String} pathToFile1
 * @param {String} pathToFile2
 */
const genDiff = flow(
  readFiles,
  parseFiles,
  getKeys,
  getDiff,
  format,
);


export default genDiff;
