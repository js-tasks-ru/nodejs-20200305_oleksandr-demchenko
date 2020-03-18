const stream = require('stream');
const LimitExceededError = require('./LimitExceededError');

class LimitSizeStream extends stream.Transform {
  constructor(options) {
    super(options);
    this.length = 0;
    this.limit = options.limit;
  }

  _transform(chunk, encoding, callback) {
    this.length += chunk.length;
    if (this.length <= this.limit) {
      callback(null, chunk);
    } else {
      callback(new LimitExceededError());
    }
  }
}

module.exports = LimitSizeStream;
