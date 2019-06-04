import fs from 'fs';
import path from 'path';
import has from 'lodash/has';
import getParser from './parsers';
import getFormatter from './formatters';
import actionTypes from './actionTypes';
import utils from './utils';

const { getKeys } = utils;

/**
 * Generates diff between two files
 * @param {String} format
 * @param {String} filePath1
 * @param {String} filePath2
 * @returns {String}
 */
const genDiff = (filePath1, filePath2, format = 'complex') => {
  const data = [filePath1, filePath2]
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

  return `${getFormatter(format)(diff)}\n`;
};

export default genDiff;
