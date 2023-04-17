# 03

## 콜백 패턴

- 자바스크립트에서 콜백은 다른 함수에 인자로 전달되는 함수이며, 작업이 완료되면 작업결과를 가지고 호출됩니다. 함수형 프로그래밍에서 이런식으로 결과를 전달하는 방식을 연속전달방식(CPS) 라고 부릅니다.
- 비동기 호출을 만나면 제어의 흐름을 그 즉시 동기적인 흐름으로 돌려놓는다.
- addAsync 함수에서 settimeout을 만나면 그 즉시 addAscyc 함수에게 제어권을 돌려준다.
- 그 후 순차적 실행

```jsx
import { readFile } from "fs";

const cache = new Map();

function inconsistentRead(filename, cb) {
  if (cache.has(filename)) {
    cb(cache.get(filename));
  } else {
    readFile(filename, "utf-8", (err, data) => {
      cache.set(filename, data);
      cb(data);
    });
  }
}

function createFileReader(filename, who) {
  const listeners = [];

  inconsistentRead(filename, (value) => {
    listeners.forEach((listener) => listener(value));
  });

  return {
    onDataReady: (listener) => listeners.push(listener),
  };
}

/* 
    일어나는일
    - reader1 생성시
    1. createFileReader로 data.txt 파일에 접근 => inconsistentRead
    2. inconsistentRead => 해시맵에 등록되어있지 않기때문에 비동기적 호출
    3. 그러니까 밑에 reurn 문이 먼저 실행되서 onDataReady 함수를 무사히 반환하는겁니다.
    
    - reader1 생성 후 onDataReady 함수 호출
    1. 이제 리스너즈에 콜백을 무사히 등록했습니다.
    2. 파일 읽기가 끝나면 inconsistentRead의 콜백이 실행되면서 listeners의 모든 콜백이 실행 됩니다.
    3. console.log(`First call data: ${data}`); 이거 찍힙니다.
    4. reader2가 만들어집니다. 똑같은 파일을 읽으려 합니다.
    5. 그런데 해시맵에 이미 data.txt에 대한 내용이 있죠? 파일이름이 같죠?
    6. 즉각 실행됩니다. 동기적으로, 하지만 listeners에는 아무것도없어요 등록되기 전이다 이말이죠.
    7. 아무것도 안찍힙니다. 
    8. 그 후 그제서야 reader2.onDataReady 하면서 listener을 넘겨주지만 늦었죠? createFileReader는 끝났어요
    9. 그렇기 때문에 console에 아무것도 찍히지 않습니다.

    - if reader2가 reader1의 콜백 바깥에 있다면?
    => 모두 파일을 잘 읽고 콘솔에 찍습니다.
    => reader1이 inconsistentRead 실행하면서 막혀있는 동안 reader2도 inconsistentRead를 실행하겠죠?
    => 그렇기 때문에 둘 다 읽겠죠
*/

const reader1 = createFileReader("data.txt");
reader1.onDataReady((data) => {
  console.log(`First call data: ${data}`);

  // 얼마후같은파일을다시읽으려고시도합니다.
  //   const reader2 = createFileReader("data.txt");
  //   reader2.onDataReady((data) => {
  //     console.log(`Second call data: ${data}`);
  //   });
});

const reader2 = createFileReader("data.txt");
reader2.onDataReady((data) => {
  console.log(`Second call data: ${data}`);
});
```

### process.nextTic, setImmediate

```jsx
import { readFile } from "fs";

const cache = new Map();

function inconsistentRead(filename, cb) {
  if (cache.has(filename)) {
    // here!!
    process.nextTick(() => cb(cache.get(filename)));
		// or
		setImmediate(() => cb(cache.get(filename)));
  } else {
    readFile(filename, "utf-8", (err, data) => {
      cache.set(filename, data);
      cb(data);
    });
  }
}

function createFileReader(filename, who) {
  const listeners = [];

  inconsistentRead(filename, (value) => {
    listeners.forEach((listener) => listener(value));
  });

  return {
    onDataReady: (listener) => listeners.push(listener),
  };
}

const reader1 = createFileReader("data.txt");
reader1.onDataReady((data) => {
  console.log(`First call data: ${data}`);

  const reader2 = createFileReader("data.txt");
  reader2.onDataReady((data) => {
    console.log(`Second call data: ${data}`); // 잘 읽힌다!!
  });
});
```

### ⇒ process.nextTick이 콜백함수를 비동기 큐로 빼버리니까 readfile과 마찬가지로 onDataReady 콜백이 등록되기까지의 시간을 벌 수 있는 것이죠

## 3-1-3

- 콜백은 맨 마지막에 !
- 오류는 맨 처음에 !
- 예외가 이벤트루프에 도달하는순간 애플리케이션은 중단됩니다.

## 3-2 관찰자 패턴

- EventEmitter 생성 및 사용
- EventEmitter 클래스를 확장시켜서 관찰자 패턴 구현
- 메모리 누수가 일어나지않게 필요하지 않게된 이벤트들은 구독해지시키자
- 호출할때 비동기 동기 섞어서 쓰지말자

## 3 : 결론

- 콜백이던 이벤트에미터건 상황에 맞게 쓰자
- 콜백은 api 하나당 특정 콜백 하나
- 이벤트에미터는 같은 이벤트에 다수의 리스너 등록

## 여담 - gpt한테는 굵직굵직한 개념느낌만 물어보자

![Untitled](03%203806943710ec4f808a61070d1f81a2b3/Untitled.png)

![Untitled](03%203806943710ec4f808a61070d1f81a2b3/Untitled%201.png)