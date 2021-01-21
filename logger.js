const { createLogger, format, transports } = require('winston');
const winstonTimestampColorize = require('winston-timestamp-colorize');
const dotenv = require('dotenv').config();

// Logger
const myTransports = [];

myTransports.push(
  new transports.File(
  {
    filename: './logs/error.log',
    level: process.env.LOGGER_LEVEL || 'error',
    format: format.combine(
      format.splat(),
      format.json()
    )
  }),
  new transports.Http(
  {
    level: 'warn',
    format: format.json()
  })
);

if (process.env.NODE_ENV === 'dev')
{
  myTransports.push(
    new transports.Console(
    {
      level: 'debug',
      handleExceptions: true,
      format: format.combine(
        format.splat(),
        format.colorize(),
        format.align(),
        format.timestamp( {format: 'YYYY-MM-DD HH:mm:ss'} ),
        winstonTimestampColorize({ color: 'blue' }),
        format.printf(info => `${info.timestamp} [${info.level}]: ${info.message}`)
      )
    })
  )
}

const logger = createLogger({ transports: myTransports });

// Pass parameters like morgan to get a debug
logger.stream = {
  write: function (message) {
    logger.debug(message);
  }
};


// Testing
// info: test message my string {}
logger.log('info', 'test message %s', 'my string');

// info: test message my 123 {}
logger.log('warn', 'test message %d', 123);

// prints "Found error at %s"
logger.error('Found %s at %s', 'error', new Date());
logger.http('Found %s at %s', 'error', true);
logger.debug('Found %s at %s', 'error', 100.00);

// Export
module.exports = logger;
