'use strict';
// Do this as the first thing so that any code reading it knows the right env.
process.env.BABEL_ENV = 'production';
process.env.NODE_ENV = 'production';
process.env.REACT_APP_CLI_MODE = 'true';

require('./build')