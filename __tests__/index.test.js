import fs from 'fs';
import path from 'path';
import genDiff from '../src';

describe('genDiff', () => {
  test('Should return correct diff.', () => {
    const expected = fs.readFileSync(path.resolve(__dirname, '__fixtures__', 'expected.txt'), 'utf8');

    expect(genDiff('./__tests__/__fixtures__/before.json', './__tests__/__fixtures__/after.json')).toBe(expected);
  });
});
