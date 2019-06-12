import fs from 'fs';
import path from 'path';
import has from 'lodash/has';
import keys from 'lodash/keys';
import union from 'lodash/union';
import getParser from './parsers';
import getFormatter from './formatters';

const genDiff = (filePath1, filePath2, format = 'complex') => {
  const data1 = getParser(path.extname(filePath1).slice(1))(fs.readFileSync(path.resolve(filePath1), 'utf8'));
  const data2 = getParser(path.extname(filePath2).slice(1))(fs.readFileSync(path.resolve(filePath2), 'utf8'));

  const diff = union(keys(data1), keys(data2))
    .reduce((accumulator, key) => {
      if (!has(data1, key) && has(data2, key)) {
        return [
          ...accumulator,
          {
            key,
            value: data2[key],
            type: 'added',
          },
        ];
      }

      if (has(data1, key) && !has(data2, key)) {
        return [
          ...accumulator,
          {
            key,
            value: data1[key],
            type: 'removed',
          },
        ];
      }

      if (has(data1, key) && has(data2, key) && data1[key] === data2[key]) {
        return [
          ...accumulator,
          {
            key,
            value: data1[key],
            type: 'unchanged',
          },
        ];
      }

      if (has(data1, key) && has(data2, key) && data1[key] !== data2[key]) {
        return [
          ...accumulator,
          {
            key,
            value: data2[key],
            type: 'added',
          },
          {
            key,
            value: data1[key],
            type: 'removed',
          },
        ];
      }

      return accumulator;
    }, []);

  return `${getFormatter(format)(diff)}\n`;
};

export default genDiff;
