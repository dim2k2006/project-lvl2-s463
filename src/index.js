import fs from 'fs';
import path from 'path';
import getParser from './parsers';
import getFormatter from './formatters';
import formatTypes from './types/formatTypes';

import utils from './utils';

const { getKeys, getDiff, withPath } = utils;

/**
 * Generates diff between two files
 * @param {Array} filePaths
 * @param {String} format
 * @returns {String}
 */
const genDiff = (filePaths = [], format = formatTypes.DEFAULT) => {
  const data = filePaths
    .map((filepath) => {
      const content = fs.readFileSync(path.resolve(filepath), 'utf8');
      const fileExtension = path.extname(filepath).slice(1);
      return getParser(fileExtension)(content);
    });

  const [data1, data2] = data;

  const keys = getKeys(data1, data2);

  const diff = getDiff(keys, data1, data2);

  return `${getFormatter(format)(withPath(diff))}\n`;
};

export default genDiff;
