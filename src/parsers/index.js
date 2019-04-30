import { safeLoad as ymlParse } from 'js-yaml';
import { parse as iniParse } from 'ini-forked'; // installed from forked repo cause original repo has problems with parsing numbers

const parserTypes = {
  json: JSON.parse,
  yml: ymlParse,
  ini: iniParse,
};

export default type => parserTypes[type];
