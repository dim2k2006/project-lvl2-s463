import fs from 'fs';
import path from 'path';
import genDiff from '../src';

describe('genDiff', () => {
  test('Should return correct diff. json files.', () => {
    const expected = fs.readFileSync(path.resolve(__dirname, '__fixtures__', 'expected.txt'), 'utf8');

    expect(genDiff('./__tests__/__fixtures__/before.json', './__tests__/__fixtures__/after.json')).toBe(expected);
  });

  test('Should return correct diff. yaml files.', () => {
    const expected = fs.readFileSync(path.resolve(__dirname, '__fixtures__', 'expected.txt'), 'utf8');

    expect(genDiff('./__tests__/__fixtures__/before.yaml', './__tests__/__fixtures__/after.yaml')).toBe(expected);
  });
});
