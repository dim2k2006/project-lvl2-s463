import fs from 'fs';
import path from 'path';
import getParser from './parsers';
import buildAst from './utils/buildAst';
import reverseAndUnique from './utils/reverseAndUnique';
import getDiff from './utils/getDiff';
import getFormatter from './formatters';
import formatTypes from './types/formatTypes';
import withPath from './utils/withPath';

/**
 * Generates diff between two files
 * @param {Array} list
 * @param {String} format
 * @returns {String}
 */
const genDiff = (list = [], format = formatTypes.DEFAULT) => {
  const processedList = list
    .map((filepath) => {
      const content = fs.readFileSync(path.resolve(filepath), 'utf8');
      const fileExtension = path.extname(filepath).slice(1);
      const data = getParser(fileExtension)(content);
      const ast = buildAst(data);

      return ast;
    });

  const [ast1, ast2] = processedList;

  const diff1 = getDiff(ast1, ast2);
  const diff2 = reverseAndUnique(diff1)(getDiff(ast2, ast1));

  const diff = [...diff1, ...diff2];

  return `${getFormatter(format)(withPath(diff))}\n`;
};

export default genDiff;
