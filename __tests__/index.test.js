import fs from 'fs';
import path from 'path';
import genDiff from '../src';

const fixturesPath = path.join('.', '__tests__', '__fixtures__');

const expectedFlat = fs.readFileSync(path.resolve(fixturesPath, 'expected.txt'), 'utf8');
const expectedNested = fs.readFileSync(path.resolve(fixturesPath, 'expected-nested.txt'), 'utf8');

const fixtures = [
  [path.join(fixturesPath, 'before.json'), path.join(fixturesPath, 'after.json'), expectedFlat],
  [path.join(fixturesPath, 'before.yml'), path.join(fixturesPath, 'after.yml'), expectedFlat],
  [path.join(fixturesPath, 'before.ini'), path.join(fixturesPath, 'after.ini'), expectedFlat],
  [path.join(fixturesPath, 'before-nested.json'), path.join(fixturesPath, 'after-nested.json'), expectedNested],
];

describe('genDiff', () => {
  test.each(fixtures)('Should return correct diff. Index of the test case: %#', (before, after, expected) => {
    expect(genDiff(before, after)).toBe(expected);
  });
});
