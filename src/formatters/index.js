import complexFormatter from './complex';
import plainFormatter from './plain';
import jsonFormatter from './json';

const formattersMap = {
  complex: complexFormatter,
  plain: plainFormatter,
  json: jsonFormatter,
};

export default format => formattersMap[format];
