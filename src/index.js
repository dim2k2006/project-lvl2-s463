import fs from 'fs';
import path from 'path';
import has from 'lodash/has';
import getParser from './parsers';
import getFormatter from './formatters';
import actionTypes from './actionTypes';
import utils from './utils';

const { getKeys, withPath } = utils;

/**
 * Generates diff between two files
 * @param {String} format
 * @param {Array} filePaths
 * @returns {String}
 */
const genDiff = (format = 'complex', ...filePaths) => {
  const data = filePaths
    .map((filepath) => {
      const content = fs.readFileSync(path.resolve(filepath), 'utf8');
      const fileExtension = path.extname(filepath).slice(1);
      return getParser(fileExtension)(content);
    });

  const [data1, data2] = data;

  const keys = getKeys(data1, data2);

  const diff = keys
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

  return `${getFormatter(format)(withPath(diff))}\n`;
};

export default genDiff;
