import fs from 'fs';
import path from 'path';
import genDiff from '../src';

describe('genDiff', () => {
  const fixturesPath = path.join('.', '__tests__', '__fixtures__');

  const table = [
    { type: 'json', format: 'complex' },
    // { type: 'json', format: 'plain' },
    // { type: 'json', format: 'json' },

    { type: 'yml', format: 'complex' },
    // { type: 'yml', format: 'plain' },
    // { type: 'yml', format: 'json' },

    { type: 'ini', format: 'complex' },
    // { type: 'ini', format: 'plain' },
    // { type: 'ini', format: 'json' },
  ];

  table.forEach(({ type, format }) => {
    const path1 = path.join(fixturesPath, type);
    const path2 = path.join(fixturesPath, type);

    test(`Should return correct diff. Type: ${type}. Format: ${format}. Structure: flat.`, () => {
      const expected = fs.readFileSync(path.join(fixturesPath, `expected-${format}.txt`), 'utf-8');
      const config1 = path.join(path1, `before.${type}`);
      const config2 = path.join(path2, `after.${type}`);

      expect(genDiff(config1, config2, format)).toBe(expected);
    });

    test(`Should return correct diff. Type: ${type}. Format: ${format}. Structure: nested.`, () => {
      const expected = fs.readFileSync(path.join(fixturesPath, `expected-nested-${format}.txt`), 'utf-8');
      const config1 = path.join(path1, `before-nested.${type}`);
      const config2 = path.join(path2, `after-nested.${type}`);

      expect(genDiff(config1, config2, format)).toBe(expected);
    });
  });
});
