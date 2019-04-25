import fs from 'fs';
import path from 'path';
import genDiff from '../src';

const fixturesPath = path.join('.', '__tests__', '__fixtures__');

const expectedFlat = fs.readFileSync(path.resolve(fixturesPath, 'expected.txt'), 'utf8');
const expectedNested = fs.readFileSync(path.resolve(fixturesPath, 'expected-nested.txt'), 'utf8');

const fixtures = [
  [path.join(fixturesPath, 'json', 'before.json'), path.join(fixturesPath, 'json', 'after.json'), expectedFlat],
  [path.join(fixturesPath, 'json', 'before-nested.json'), path.join(fixturesPath, 'json', 'after-nested.json'), expectedNested],

  [path.join(fixturesPath, 'yml', 'before.yml'), path.join(fixturesPath, 'yml', 'after.yml'), expectedFlat],
  [path.join(fixturesPath, 'yml', 'before-nested.yml'), path.join(fixturesPath, 'yml', 'after-nested.yml'), expectedNested],

  [path.join(fixturesPath, 'ini', 'before.ini'), path.join(fixturesPath, 'ini', 'after.ini'), expectedFlat],
];

describe('genDiff', () => {
  test.each(fixtures)('Should return correct diff. Index of the test case: %#', (before, after, expected) => {
    expect(genDiff(before, after)).toBe(expected);
  });
});
