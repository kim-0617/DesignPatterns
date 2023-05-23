const fs = require("fs");

const file = fs.createWriteStream("./big.txt");

for (let i = 0; i <= 10_000_000; i++) {
  file.write(
    "안녕하세요 파인랩 김영빈입니다. 이제부터 매우큰 파일을 만들어 볼 예정입니다. 가봅시다~ \n"
  );
}
file.end();
