import fs from 'fs';
import path from 'path';
import genDiff from '../src';
import formatTypes from '../src/types/formatTypes';

const fixturesPath = path.join('.', '__tests__', '__fixtures__');

const expectedFlat = fs.readFileSync(path.resolve(fixturesPath, 'expected.txt'), 'utf8');
const expectedFlatPlain = fs.readFileSync(path.resolve(fixturesPath, 'expected-plain.txt'), 'utf8');
const expectedNested = fs.readFileSync(path.resolve(fixturesPath, 'expected-nested.txt'), 'utf8');

const fixtures = [
  // JSON default format
  [path.join(fixturesPath, 'json', 'before.json'), path.join(fixturesPath, 'json', 'after.json'), formatTypes.DEFAULT, expectedFlat],
  [path.join(fixturesPath, 'json', 'before-nested.json'), path.join(fixturesPath, 'json', 'after-nested.json'), formatTypes.DEFAULT, expectedNested],

  // JSON plain format
  [path.join(fixturesPath, 'json', 'before.json'), path.join(fixturesPath, 'json', 'after.json'), formatTypes.PLAIN, expectedFlatPlain],

  // YML default format
  [path.join(fixturesPath, 'yml', 'before.yml'), path.join(fixturesPath, 'yml', 'after.yml'), formatTypes.DEFAULT, expectedFlat],
  [path.join(fixturesPath, 'yml', 'before-nested.yml'), path.join(fixturesPath, 'yml', 'after-nested.yml'), formatTypes.DEFAULT, expectedNested],

  // INI default format
  [path.join(fixturesPath, 'ini', 'before.ini'), path.join(fixturesPath, 'ini', 'after.ini'), formatTypes.DEFAULT, expectedFlat],
  [path.join(fixturesPath, 'ini', 'before-nested.ini'), path.join(fixturesPath, 'ini', 'after-nested.ini'), formatTypes.DEFAULT, expectedNested],
];

describe('genDiff', () => {
  test.each(fixtures)('Should return correct diff. Index of the test case: %#', (path1, path2, format, expected) => {
    expect(genDiff({ path1, path2, format })).toBe(expected);
  });
});
