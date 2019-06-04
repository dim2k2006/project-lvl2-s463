import fs from 'fs';
import path from 'path';
import has from 'lodash/has';
import getParser from './parsers';
import getFormatter from './formatters';
import utils from './utils';

const { getKeys } = utils;

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
            action: 'added',
          },
        ];
      }

      if (has(data1, key) && !has(data2, key)) {
        return [
          ...accumulator,
          {
            key,
            value: data1[key],
            action: 'removed',
          },
        ];
      }

      if (has(data1, key) && has(data2, key) && data1[key] === data2[key]) {
        return [
          ...accumulator,
          {
            key,
            value: data1[key],
            action: 'notChanged',
          },
        ];
      }

      if (has(data1, key) && has(data2, key) && data1[key] !== data2[key]) {
        return [
          ...accumulator,
          {
            key,
            value: data2[key],
            action: 'added',
          },
          {
            key,
            value: data1[key],
            action: 'removed',
          },
        ];
      }

      return accumulator;
    }, []);

  return `${getFormatter(format)(diff)}\n`;
};

export default genDiff;
