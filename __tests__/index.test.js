import fs from 'fs';
import path from 'path';
import genDiff from '../src';

describe('genDiff', () => {
  const fixturesPath = path.join('.', '__tests__', '__fixtures__');

  const table = [
    { type: 'json', format: 'complex' },
    { type: 'json', format: 'plain' },
    // { type: 'json', format: 'json' },

    { type: 'yml', format: 'complex' },
    { type: 'yml', format: 'plain' },
    // { type: 'yml', format: 'json' },

    { type: 'ini', format: 'complex' },
    { type: 'ini', format: 'plain' },
    // { type: 'ini', format: 'json' },
  ];

  table.forEach(({ type, format }) => {
    const path1 = path.join(fixturesPath, type);
    const path2 = path.join(fixturesPath, type);

    const expectedFlat = fs.readFileSync(path.join(fixturesPath, `expected-${format}.txt`), 'utf-8');

    test(`Should return correct diff. Type: ${type}, format: ${format}. Structure: flat.`, () => {
      expect(genDiff(format, path.join(path1, `before.${type}`), path.join(path2, `after.${type}`))).toBe(expectedFlat);
    });
  });
});
