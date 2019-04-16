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
  const data = [
    ...Object.keys(data1).map(key => ({ key, value: data1[key] })),
    ...Object.keys(data2).map(key => ({ key, value: data2[key] })),
  ];

  return `{\n${
    data
      .reduce((accumulator, item) => {
        const { key, value } = item;

        const existingItem = accumulator.find(accItem => accItem.key === key);

        if (!existingItem && (data1[key] === data2[key])) return [...accumulator, { key, value, action: ' ' }];

        if (!existingItem && (has(data1, key) && has(data2, key) && (data1[key] !== data2[key]))) return [...accumulator, { key, value, action: '+' }];

        if (!existingItem && (has(data1, key) && !has(data2, key))) return [...accumulator, { key, value, action: '-' }];

        if (!existingItem && data1[key] && !data2[key]) return [...accumulator, { key, value, action: '-' }];

        if (!existingItem && !data1[key] && data2[key]) return [...accumulator, { key, value, action: '+' }];

        const existingItemIndex = accumulator.findIndex(accItem => accItem.key === key);

        if (existingItem && existingItem.value !== value) {
          return [
            ...accumulator.slice(0, existingItemIndex),
            { key, value, action: '+' },
            { key, value: existingItem.value, action: '-' },
            ...accumulator.slice(existingItemIndex + 1),
          ];
        }

        if (existingItem && existingItem.value === value) return accumulator;

        return accumulator;
      }, [])
      .map(item => `${item.action} ${item.key}: ${item.value}`)
      .join('\n')
  }\n}\n`;
};

export default genDiff;
