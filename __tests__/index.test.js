import fs from 'fs';
import path from 'path';
import genDiff from '../src';

const fixturesPath = path.join('.', '__tests__', '__fixtures__');

const fixtures = [
  [path.join(fixturesPath, 'before.json'), path.join(fixturesPath, 'after.json')],
  [path.join(fixturesPath, 'before.yml'), path.join(fixturesPath, 'after.yml')],
  [path.join(fixturesPath, 'before.ini'), path.join(fixturesPath, 'after.ini')],
];

describe('genDiff', () => {
  const expected = fs.readFileSync(path.resolve(__dirname, '__fixtures__', 'expected.txt'), 'utf8');

  test.each(fixtures)('Should return correct diff. Index of the test case: %#', (before, after) => {
    expect(genDiff(before, after)).toBe(expected);
  });
});
