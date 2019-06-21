import fs from 'fs';
import path from 'path';
import {
  has,
  keys,
  union,
  find,
} from 'lodash';
import getParser from './parsers';
import getFormatter from './formatters';

const keyTypes = [
  {
    type: 'nested',
    check: (data1, data2, key) => (data1[key] instanceof Object && data2[key] instanceof Object)
      && !(data1[key] instanceof Array && data2[key] instanceof Array),
    process: (value1, value2, fn) => ({
      oldValue: value1,
      newValue: fn(value1, value2),
    }),
  },
  {
    type: 'added',
    check: (data1, data2, key) => !has(data1, key) && has(data2, key),
    process: (value1, value2) => ({
      oldValue: value1,
      newValue: value2,
    }),
  },
  {
    type: 'removed',
    check: (data1, data2, key) => has(data1, key) && !has(data2, key),
    process: (value1, value2) => ({
      oldValue: value1,
      newValue: value2,
    }),
  },
  {
    type: 'unchanged',
    check: (data1, data2, key) => has(data1, key) && has(data2, key) && data1[key] === data2[key],
    process: (value1, value2) => ({
      oldValue: value1,
      newValue: value2,
    }),
  },
  {
    type: 'changed',
    check: (data1, data2, key) => has(data1, key) && has(data2, key) && data1[key] !== data2[key],
    process: (value1, value2) => ({
      oldValue: value1,
      newValue: value2,
    }),
  },
];

const getAst = (data1, data2) => union(keys(data1), keys(data2)).map((key) => {
  const { type, process } = find(keyTypes, item => item.check(data1, data2, key));
  const { oldValue, newValue } = process(data1[key], data2[key], getAst);

  return {
    type,
    key,
    oldValue,
    newValue,
  };
});

const genDiff = (filePath1, filePath2, format = 'complex') => {
  const config1 = fs.readFileSync(path.resolve(filePath1), 'utf8');
  const config2 = fs.readFileSync(path.resolve(filePath2), 'utf8');

  const configExt1 = path.extname(filePath1).slice(1);
  const configExt2 = path.extname(filePath2).slice(1);

  const data1 = getParser(configExt1)(config1);
  const data2 = getParser(configExt2)(config2);

  const diff = getAst(data1, data2);

  // console.log('diff:', JSON.stringify(diff));

  return `${getFormatter(format)(diff)}\n`;
};

export default genDiff;
