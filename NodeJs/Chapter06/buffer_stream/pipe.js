const fs = require("fs");
const zlib = require("zlib");

const readStream = fs.createReadStream("./readme.txt", { highWaterMark: 16 });
const zlibStream = zlib.createGzip();
const writeStream = fs.createWriteStream("./writeme_3.txt.gz");
// readStream.pipe(writeStream);
readStream.pipe(zlibStream).pipe(writeStream);
