import flow from 'lodash/flow';
import reverseActions from '../reverseActions';
import removeDuplicates from '../removeDuplicates';

/**
 * Reverse actions and removes duplicates in ast
 * @param {Array} originAst
 * @returns {Array}
 */
const reverseAndUnique = originAst => flow(
  reverseActions,
  removeDuplicates(originAst),
);

export default reverseAndUnique;
