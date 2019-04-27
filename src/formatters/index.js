import formatTypes from '../types/formatTypes';
import defaultFormatter from './default';
import plainFormatter from './plain';

const formattersMap = {
  [formatTypes.DEFAULT]: defaultFormatter,
  [formatTypes.PLAIN]: plainFormatter,
};

export default format => formattersMap[format];
