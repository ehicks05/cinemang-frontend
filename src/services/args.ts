import yargs from 'yargs';

const argv = yargs(process.argv.slice(2))
  .options({
    full: { type: 'boolean', default: false },
    syncOnStart: { type: 'boolean', default: false },
  })
  .parseSync();

export { argv };
