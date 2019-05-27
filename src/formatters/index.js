import defaultFormatter from './default';
import plainFormatter from './plain';
import jsonFormatter from './json';

const formattersMap = {
  default: defaultFormatter,
  plain: plainFormatter,
  json: jsonFormatter,
};

export default format => formattersMap[format];
