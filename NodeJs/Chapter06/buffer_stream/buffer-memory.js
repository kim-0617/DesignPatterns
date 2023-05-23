const fs = require("fs");

// + 활성상태보기
console.log("before :", process.memoryUsage().rss);

const data1 = fs.readFileSync("./big.txt");
fs.writeFileSync("./big_2.txt", data1);
console.log("buffer :", process.memoryUsage().rss);
