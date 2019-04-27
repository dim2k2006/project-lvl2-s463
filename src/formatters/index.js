import formatTypes from '../types/formatTypes';
import defaultFormatter from './default';
import plainFormatter from './plain';
import jsonFormatter from './json';

const formattersMap = {
  [formatTypes.DEFAULT]: defaultFormatter,
  [formatTypes.PLAIN]: plainFormatter,
  [formatTypes.JSON]: jsonFormatter,
};

export default format => formattersMap[format];
