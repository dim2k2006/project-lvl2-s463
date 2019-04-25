import fs from 'fs';
import path from 'path';
import flow from 'lodash/flow';
import getParser from './parsers';
import utils from './utils';
import buildAst from './utils/buildAst';

const { getDiff } = utils;

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

  // console.log('ast1:', ast1);
  // console.log('ast2:', ast2);

  const diff1 = getDiff(ast1, ast2, false);
  const diff2 = getDiff(ast2, ast1, true)
    .filter(({ key: key2 }) => !diff1.find(({ key: key1 }) => key1 === key2));
  const diff = [...diff1, ...diff2];

  console.log('diff:', JSON.stringify(diff));

  return {
    ...props,
    diff,
  };
};

// /**
//  * Retrieves data keys
//  * @param {Object} props
//  * @returns {Object}
//  */
// const getKeys = (props) => {
//   const { data1, data2 } = props;
//   const keys1 = Object.keys(data1);
//   const keys2 = Object.keys(data2).filter(key => !keys1.includes(key));
//
//   return {
//     ...props,
//     keys1,
//     keys2,
//   };
// };

// /**
//  * Retrieves difference between two objects by key
//  * @param {Object} data1
//  * @param {Object} data2
//  * @param {String} key
//  * @returns {Array}
//  */
// const getDiffByKey = (data1, data2, key) => {
//   if (has(data1, key) && has(data2, key) && data1[key] === data2[key]) {
//     return [{ key, value: data1[key], action: actionTypes.DEFAULT }];
//   }
//
//   if (has(data1, key) && has(data2, key) && data1[key] !== data2[key]) {
//     return [
//       { key, value: data2[key], action: actionTypes.ADDITION },
//       { key, value: data1[key], action: actionTypes.SUBTRACTION },
//     ];
//   }
//
//   if (has(data1, key) && !has(data2, key)) {
//     return [{ key, value: data1[key], action: actionTypes.SUBTRACTION }];
//   }
//
//   if (!has(data1, key) && has(data2, key)) {
//     return [{ key, value: data2[key], action: actionTypes.ADDITION }];
//   }
//
//   return [{ key, value: data1[key], action: actionTypes.DEFAULT }];
// };
//
// /**
//  * Retrieves the diff between data
//  * @param {Object} props
//  * @returns {Object}
//  */
// const getDiff = (props) => {
//   const {
//     data1,
//     data2,
//     keys1,
//     keys2,
//   } = props;
//
//   const iter = (index, accumulator) => {
//     const key1 = keys1[index];
//     const key2 = keys2[index];
//
//     if (!key1 && !key2) return accumulator;
//
//     const diff1 = (key1) ? getDiffByKey(data1, data2, key1) : [];
//     const diff2 = (key2) ? getDiffByKey(data1, data2, key2) : [];
//
//     return iter(index + 1, [...accumulator, ...diff1, ...diff2]);
//   };
//
//   return {
//     ...props,
//     diff: iter(0, []),
//   };
// };

/**
 * Formats the result
 * @param {Object} props
 * @returns {String}
 */
const format = (props) => {
  const { diff } = props;
  const indentationChar = ' ';
  const indentationOffset = 2;
  const actionOffset = 1;

  const iter = (data, offset, aOffset) => {
    const result = data
      .map(({
        key,
        value,
        action,
        children = [],
      }) => {
        const currentAOffset = offset > indentationOffset ? aOffset : 0;
        const offsetValue = (offset > indentationOffset) ? offset + currentAOffset : offset;

        if (!children.length) return `${indentationChar.repeat(offsetValue)}${action} ${key}: ${value}`;

        return `${indentationChar.repeat(offsetValue)}${action} ${key}: ${iter(children, offset + indentationOffset, aOffset * 2)}`;
      })
      .join('\n');

    return `{
${result}
${indentationChar.repeat(offset)}}`;
  };

  const result = iter(diff, indentationOffset, actionOffset);

  console.log('result:', result);

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
  // getKeys,
  // getDiff,
  // format,
);


export default genDiff;
