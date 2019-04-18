import { safeLoad } from 'js-yaml';

const parserTypes = {
  json: JSON.parse,
  yml: safeLoad,
};

export default type => parserTypes[type];
