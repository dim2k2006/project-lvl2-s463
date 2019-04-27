import { safeLoad as ymlParse } from 'js-yaml';
import { parse as iniParse } from 'ini';

const parserTypes = {
  json: JSON.parse,
  yml: ymlParse,
  ini: iniParse,
};

export default type => parserTypes[type];
