import fs from 'fs';
import path from 'path';
import genDiff from '../src';
import formatTypes from '../src/types/formatTypes';

describe('genDiff', () => {
  const fixturesPath = path.join('.', '__tests__', '__fixtures__');
  const dataTypes = ['json', 'yml', 'ini'];

  const table = dataTypes.reduce((accumulator, dataType) => {
    const testRow = Object.values(formatTypes).reduce((iAccumulator, formatType) => {
      return [
        ...iAccumulator,
        [
          path.join(fixturesPath, dataType, `before.${dataType}`),
          path.join(fixturesPath, dataType, `after.${dataType}`),
          formatType,
          fs.readFileSync(path.join(fixturesPath, `expected-${formatType}.txt`), 'utf-8'),
        ],
        [
          path.join(fixturesPath, dataType, `before-nested.${dataType}`),
          path.join(fixturesPath, dataType, `after-nested.${dataType}`),
          formatType,
          fs.readFileSync(path.join(fixturesPath, `expected-nested-${formatType}.txt`), 'utf-8'),
        ],
      ];
    }, []);

    return [
      ...accumulator,
      ...testRow,
    ];
  }, []);

  test.each(table)('Should return correct diff. \nPath1: %s \nPath2: %s \nFormat: %s.', (path1, path2, format, expected) => {
    expect(genDiff({ path1, path2, format })).toBe(expected);
  });
});
