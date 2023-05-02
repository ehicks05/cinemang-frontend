import yargs from 'yargs';

const argv = yargs(process.argv.slice(2))
  .options({
    full: { type: 'string', default: '', choices: ['off', 'on'] },
    syncOnStart: { type: 'boolean', default: false },
  })
  .parseSync();

export { argv };
