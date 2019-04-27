#!/usr/bin/env node

import program from 'commander';
import genDiff from '..';
import formatTypes from '../utils/formatTypes';

program
  .version('1.0.0')
  .arguments('<firstConfig> <secondConfig>')
  .description('Compares two configuration files and shows a difference.')
  .option('-f, --format [type]', 'Output format')
  .action((path1, path2, options = {}) => {
    const { format = formatTypes.DEFAULT } = options;

    console.log(genDiff({ path1, path2, format }));
  })
  .parse(process.argv);
