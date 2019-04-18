#!/usr/bin/env node

import program from 'commander';
import genDiff from '..';

program
  .version('1.0.0')
  .arguments('<firstConfig> <secondConfig>')
  .action((path1, path2) => {
    console.log(genDiff(path1, path2));
  })
  .description('Compares two configuration files and shows a difference.')
  .option('-f, --format [type]', 'Output format')
  .parse(process.argv);
