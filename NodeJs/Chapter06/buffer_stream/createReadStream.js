const fs = require("fs");
const readStream = fs.createReadStream("./readme.txt", { highWaterMark: 16 }); // default 한번 읽는 데이터 사이즈 : 64kb

const data = [];
readStream.on("data", (chunk) => {
  data.push(chunk);
  console.log("chunk", chunk, chunk.length);
  console.log(chunk.toString());
});
readStream.on("end", () => {
  console.log("end :", Buffer.concat(data).toString());
});
// Error handler
readStream.on("error", (err) => {
  console.log("error", err);
});

// => buffer 방식처럼 한번에 읽어서 전달하는 거에(fs.readFile) 비해 메모리 사용량을 줄일 수 있다.
