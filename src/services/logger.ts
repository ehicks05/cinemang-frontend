var log4js = require('log4js');

log4js.configure({
  appenders: {
    everythingFile: {
      type: 'file',
      filename: './logs/all-the-logs.txt',
      maxLogSize: 10485760,
      backups: 3,
      compress: true,
    },
    everythingStdOut: {
      type: 'stdout',
    },
  },
  categories: {
    default: {
      appenders: ['everythingFile', 'everythingStdOut'],
      level: 'debug',
    },
  },
});

var logger = log4js.getLogger();
logger.level = 'info';

export default logger;
