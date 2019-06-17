import fs from 'fs';
import path from 'path';
import has from 'lodash/has';
import keys from 'lodash/keys';
import union from 'lodash/union';
import find from 'lodash/find';
import getParser from './parsers';
import getFormatter from './formatters';

const keyTypes = [
  {
    type: 'added',
    check: (data1, data2, key) => !has(data1, key) && has(data2, key),
    process: (data1, data2, key) => ({
      oldValue: data1[key],
      newValue: data2[key],
    }),
  },
  {
    type: 'removed',
    check: (data1, data2, key) => has(data1, key) && !has(data2, key),
    process: (data1, data2, key) => ({
      oldValue: data1[key],
      newValue: data2[key],
    }),
  },
  {
    type: 'unchanged',
    check: (data1, data2, key) => has(data1, key) && has(data2, key) && data1[key] === data2[key],
    process: (data1, data2, key) => ({
      oldValue: data1[key],
      newValue: data2[key],
    }),
  },
  {
    type: 'changed',
    check: (data1, data2, key) => has(data1, key) && has(data2, key) && data1[key] !== data2[key],
    process: (data1, data2, key) => ({
      oldValue: data1[key],
      newValue: data2[key],
    }),
  },
];

const genDiff = (filePath1, filePath2, format = 'complex') => {
  const data1 = getParser(path.extname(filePath1).slice(1))(fs.readFileSync(path.resolve(filePath1), 'utf8'));
  const data2 = getParser(path.extname(filePath2).slice(1))(fs.readFileSync(path.resolve(filePath2), 'utf8'));

  const diff = union(keys(data1), keys(data2))
    .map((key) => {
      const { type, process } = find(keyTypes, item => item.check(data1, data2, key));
      const { oldValue, newValue } = process(data1, data2, key);

      return {
        type,
        key,
        oldValue,
        newValue,
      };
    });

  return `${getFormatter(format)(diff)}\n`;
};

export default genDiff;
