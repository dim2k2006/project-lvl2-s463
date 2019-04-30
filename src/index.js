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
 * @param {Object} props
 * @returns {String}
 */
const genDiff = (props = {}) => {
  const { path1, path2, format = formatTypes.DEFAULT } = props;

  const file1 = fs.readFileSync(path.resolve(path1), 'utf8');
  const file2 = fs.readFileSync(path.resolve(path2), 'utf8');

  const ext1 = path.extname(path1).slice(1);
  const ext2 = path.extname(path2).slice(1);

  const data1 = getParser(ext1)(file1);
  const data2 = getParser(ext2)(file2);

  const ast1 = buildAst(data1);
  const ast2 = buildAst(data2);

  const diff1 = getDiff(ast1, ast2);
  const diff2 = reverseAndUnique(diff1)(getDiff(ast2, ast1));

  const diff = [...diff1, ...diff2];

  return `${getFormatter(format)(withPath(diff))}\n`;
};

export default genDiff;
