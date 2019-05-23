import fs from 'fs';
import path from 'path';
import genDiff from '../src';

describe('genDiff', () => {
  const fixturesPath = path.join('.', '__tests__', '__fixtures__');

  const table = [
    { type: 'json', format: 'default' },
    { type: 'json', format: 'plain' },
    { type: 'json', format: 'json' },

    { type: 'yml', format: 'default' },
    { type: 'yml', format: 'plain' },
    { type: 'yml', format: 'json' },

    { type: 'ini', format: 'default' },
    { type: 'ini', format: 'plain' },
    { type: 'ini', format: 'json' },
  ];

  table.forEach(({ type, format }) => {
    const path1 = path.join(fixturesPath, type, `before.${type}`);
    const path2 = path.join(fixturesPath, type, `after.${type}`);
    const expected = fs.readFileSync(path.join(fixturesPath, `expected-${format}.txt`), 'utf-8');

    test(`Should return correct diff. Type: ${type}, format: ${format}.`, () => {
      expect(genDiff([path1, path2], format)).toBe(expected);
    });
  });
});
