const { Transform } = require("stream");

class AppendInitVict extends Transform {
    constructor(initVict, opts) {
        super(opts);
        this.initVict = initVict,
        this.appended = false
    }

    _transform (chunk, encoding, cb) {
        if (!this.appended) {
            this.push(this.initVict);
            this.appended = true
        }

        this.push(chunk);
        cb();
    }
}

module.exports = AppendInitVict;