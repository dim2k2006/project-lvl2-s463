import fs from 'fs';
import path from 'path';
import flow from 'lodash/flow';
import getParser from './parsers';
import buildAst from './utils/buildAst';
import reverseAndUnique from './utils/reverseAndUnique';
import getDiff from './utils/getDiff';
import stringify from './utils/stringify';

/**
 * Reads files
 * @param {String} path1
 * @param {String} path2
 * @returns {Object}
 */
const readFiles = (path1, path2) => {
  const file1 = fs.readFileSync(path.resolve(path1), 'utf8');
  const file2 = fs.readFileSync(path.resolve(path2), 'utf8');

  return {
    path1,
    path2,
    file1,
    file2,
    ext1: path.extname(path1).slice(1),
    ext2: path.extname(path2).slice(1),
  };
};

/**
 * Parses files
 * @param {Object} props
 * @returns {Object}
 */
const parseFiles = (props) => {
  const {
    ext1,
    ext2,
    file1,
    file2,
  } = props;

  return {
    ...props,
    data1: getParser(ext1)(file1),
    data2: getParser(ext2)(file2),
  };
};

/**
 * Retrieves ast for each file
 * @param {Object} props
 * @returns {Object}
 */
const retrieveAst = (props) => {
  const { data1, data2 } = props;

  return {
    ...props,
    ast1: buildAst(data1),
    ast2: buildAst(data2),
  };
};

/**
 * Retrieves diff between two ast
 * @param {Object} props
 * @returns {Object}
 */
const compareAst = (props) => {
  const { ast1, ast2 } = props;

  const diff1 = getDiff(ast1, ast2);
  const diff2 = reverseAndUnique(diff1)(getDiff(ast2, ast1));

  const diff = [...diff1, ...diff2];

  return {
    ...props,
    diff,
  };
};

/**
 * Formats the result
 * @param {Object} props
 * @returns {String}
 */
const format = (props) => {
  const { diff } = props;

  const result = `${stringify(diff)}\n`;

  return result;
};

/**
 * Generates diff between two files
 * @param {String} pathToFile1
 * @param {String} pathToFile2
 */
const genDiff = flow(
  readFiles,
  parseFiles,
  retrieveAst,
  compareAst,
  format,
);


export default genDiff;
