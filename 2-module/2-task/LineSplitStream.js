const stream = require('stream');
const os = require('os');

class LineSplitStream extends stream.Transform {
  constructor(options) {
    super(options);

    this.linesBuffer = '';
  }

  _transform(chunk, encoding, callback) {
    const data = this.linesBuffer + chunk.toString();
    const lines = data.split(os.EOL);

    if (data.endsWith(os.EOL)) {
      this.linesBuffer = '';
    } else {
      this.linesBuffer = lines.pop();
    }

    for (const line of lines) {
      this.push(line);
    }

    callback();
  }

  _flush(callback) {
    if (this.linesBuffer) {
      this.push(this.linesBuffer);
    }

    callback();
  }
}

module.exports = LineSplitStream;
