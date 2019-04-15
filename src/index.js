import fs from 'fs';
import path from 'path';
import has from 'lodash/has';

/**
 * Generates diff between two files
 * @param {String} pathToFile1
 * @param {String} pathToFile2
 */
const genDiff = (pathToFile1, pathToFile2) => {
  const data1 = JSON.parse(fs.readFileSync(path.join(__dirname, '..', pathToFile1)));
  const data2 = JSON.parse(fs.readFileSync(path.join(__dirname, '..', pathToFile2)));

  const keys1 = Object.keys(data1);
  const keys2 = Object.keys(data2);

  const iter = (index, accumulator) => {
    const key1 = keys1[index];
    const key2 = keys2[index];

    if (!key1 && !key2) return accumulator;

    if (!has(data2, key1)) return iter(index + 1, `${accumulator}\n  - ${key1}: ${data1[key1]}`);

    /* 1 */ if (has(data2, key1) && data1[key1] !== data2[key1]) return iter(index + 1, `${accumulator}\n  + ${key1}: ${data2[key1]}\n  - ${key1}: ${data1[key1]}`);

    /* 2 */ if (!has(data1, key2)) return iter(index + 1, `${accumulator}\n  + ${key2}: ${data2[key2]}`);

    // объеденить 1 и 2

    return iter(index + 1, `${accumulator}\n    ${key1}: ${data1[key1]}`);
  };

  return `{${iter(0, '')}\n}`;
};

export default genDiff;
