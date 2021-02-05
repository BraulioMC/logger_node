const winston = require('winston');
var path = require('path');
const winstonTimestampColorize = require('winston-timestamp-colorize');
require('dotenv').config();

//
// Logging levels
//
const config = {
  levels: { error: 0, warn: 1, http: 2, info: 3, verbose: 4, debug: 5 },
  colors: {
    error: 'red',
    warn: 'yellow',
    http: 'white',
    info: 'green',
    verbose: 'cyan',
    debug: 'blue'
  }
};

// Colors Winston
winston.addColors(config.colors);

//
// Format logs
//
const formated = (
  winston.format.combine(
    winston.format.splat(),
    // winston.format.label( {label: path.basename(__filename, '.js')} ),
    winston.format.colorize({ all: true }),
    // winston.format.align(),
    winston.format.simple(),
    winston.format.timestamp( {format: 'YYYY-MM-DD HH:mm:ss'} ),
    winstonTimestampColorize( {color: 'magenta'} ),
    winston.format.printf(info => `${info.timestamp} [${info.label}] ${info.level}: ${info.message}`)
));

//
// Transports
//
const myTransports = [];

myTransports.push(
  new winston.transports.Console(
  {
    // level: process.env.CONSOLE_LEVEL || 'info',
    handleExceptions: true,
  }),

  new winston.transports.File(
  {
    filename: process.env.ERROR_FILE || './logs/error.log',
    level: process.env.ERROR_LEVEL || 'error',
  }),

  new winston.transports.Http(
  { // level: 'warn',
    format: winston.format.json()
  })
);

// Logger
const logger = winston.createLogger(
  {
    levels: config.levels,
    level: process.env.CONSOLE_LEVEL || 'debug',
    format: formated,
    transports: myTransports
  }
);


// Pass parameters like morgan to get a debug
logger.stream = {
  write: function (message) {
    logger.debug(message);
  }
};

// Testing
if (false) {
  logger.info('Test my string')
  
  // info: test message my string {}
  logger.log('info', 'test message %s', 'my string');
  
  // info: test message my 123 {}
  logger.log('warn', 'test message %d', 123);
  
  // Level vervose
  logger.verbose('Verbose mode')
  
  // Level http
  logger.http('Testing object config\n%o', config);
  
  // prints "Found error at %s"
  logger.error('Found %s at %s', 'error', new Date());
  logger.debug('Found %s at %s', 'error', 100.00);
}

// Export
module.exports = logger;
