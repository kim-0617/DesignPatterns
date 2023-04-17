# 04

## 4-1-2 : 콜백지옥

- 자바스크립트와 노드의 전형적인 안티패턴
- 전형적인 콜백지옥 ( 3단 ) : 파일읽고 ⇒ 데이터 처리하고 ⇒ 파일에 쓰고 …
- 다른이름으로 죽음의 피라미드

```jsx
fs.readFile('file.txt', function(err, data) {
  if (err) {
    console.error('Error:', err);
  } else {
    processData(data, function(err, result) {
      if (err) {
        console.error('Error:', err);
      } else {
        writeToFile(result, function(err) {
          if (err) {
            console.error('Error:', err);
          } else {
            console.log('File has been written.');
          }
        });
      }
    });
  }
});
```

- "**in-place 함수의 정의를 남용하지 말라**” : 함수를 정의할 때 익명 함수나 전역 함수를 직접 인라인으로 정의하는 것이 아니라, 다른 곳에서 정의된 함수를 사용하거나, 함수 표현식을 사용하여 지역 함수를 정의하고, 이를 재사용 가능한 모듈로 구성하라는 뜻입니다.

### 1. 빠른반환원칙?

```jsx
if(err) {
	// error handleing...
} else {
	// no error...
}

// if - else로 분기하는 것 보다 return 키워드를 사용해서 else문 코드를 단축

if(err) {
	// error handleing...
	return;
}
// no error...
```

### 2. 함수로 따로 빼기 (별도의 함수로 분리, 모듈화)

## 비동기 패턴

```jsx
function iterate(index) {
	if (index === tasks.length) return finish();
	const task = tasks[index];
	task(() => iterate(index + 1)); // 재귀적 호출
}

function finish() {
	// 반복 완료
}

iterate(0)
```

- 주의할점은 task가 동기적일경우 완전한 재귀적인 호출로써, 호출스택이 터져버릴 수 있음

### iterateSeries 구현

```jsx
function iterateSeries(collection, iteratorCallback, finalCallback) {
  let index = 0;

	// 에러일경우 finalCallback 호출
  function iterate(err) {
    if (err) {
      return finalCallback(err);
    }

		// 마지막에 도달했을 때 finalCallback 호출
    if (index === collection.length) {
      return finalCallback();
    }

    const item = collection[index]; // 현재 아이템
    index++; // 인덱스 증가

    iteratorCallback(item, iterate); // 이터레이터 콜백을 실행
  }

  iterate();
}
```

- `iteratorCallback` 함수를 사용하는 개발자는 인자로 받은 iterate 함수를 실행해야 한다는 것을 인지해야 한다.
- 또한 다음 item의 처리가 이루어지기 전에 현재 item의 처리를 보장하는 코드도 추가하여야 할 것 이다.

## 4-2-4 병렬실행

- spiderLinks, 뭐가 바뀌었는가?
- iterator로 반복하지 않고 (작업 하나 완료하고 다음작업하고가 아닌) forEach구문으로 전체 링크들을 작업을 전부 시켜버린다.
- 작업이 완료되면 done이라는 콜백을 추가하여 counter값을 증가시킨다.
- 이러한 병렬실행 패턴에서 일정한 작업 수가 완료되면 즉시 finish콜백을 호출하도록 할 수 있는데 이 상황을 경쟁이라고 합니다.
- 마치 Promise.race()의 기능과 비슷하지 않을까 예상합니다.

## 연습 4-1

```jsx
const fs = require('fs');

function concatFiles(...srcFiles, dest, cb) {
  let destContent = '';
  let readCount = 0;

  const handleRead = (err, data) => {
    if (err) {
      return cb(err);
    }
    destContent += data; // 데이터가 차례대로 쌓인다 foo, bar ...
    readCount++;
    if (readCount === srcFiles.length) { // 모든 파일들 읽으면 파일에 쓴다
      fs.writeFile(dest, destContent, (err) => {
        if (err) {
          return cb(err);
        }
        cb(null);
      });
    }
  };

	// 인자로 받은 srcFiles의 배열을 순회하면서 파일을 읽어들이고 dest에 저장한다
  for (let i = 0; i < srcFiles.length; i++) {
    fs.readFile(srcFiles[i], 'utf8', handleRead);
  }
}
```

## 연습 4-2

```jsx
const fs = require('fs');
const path = require('path');

function listNestedFiles(dir, cb) {
  fs.readdir(dir, (err, files) => { // 디렉토리 읽기
    if (err) return cb(err); // 에러면 에러처리
    let count = files.length; // 인자로 받은 디렉토리의 길이
    if (!count) return cb(null, []); // 디렉토리가 비었다면 처리

    const results = []; // 모든 서브 디렉토리반환

    files.forEach(file => {
      const filePath = path.join(dir, file);
      fs.stat(filePath, (err, stat) => { // 파일의 타입 구분
        if (err) return cb(err);

				// 디렉토리면 내부 파일들을 재귀적으로 가져온다
        if (stat.isDirectory()) {
          listNestedFiles(filePath, (err, nestedFiles) => {
            if (err) return cb(err);
            results.push(...nestedFiles);

            count--;
            if (count === 0) cb(null, results);
          });
        } else { // 그냥 파일이면 result에 넣는다
          results.push(filePath);

          count--;
          if (count === 0) cb(null, results);
        }
      });
    });
  });
}
```

## 연습 4-3

```jsx
const fs = require('fs');
const path = require('path');

function recursiveFind(dir, keyword, cb) {
  let matches = [];

  fs.readdir(dir, (err, files) => {
    if (err) {
      cb([]);
      return;
    }

    let pending = files.length;

    if (!pending) { // 파일이 비었다면
      cb(matches);
      return;
    }

    files.forEach((file) => {
      const filePath = path.join(dir, file);

      fs.stat(filePath, (err, stats) => {
        if (err) {
          if (--pending === 0) {
            cb(matches);
          }
          return;
        }

        if (stats.isDirectory()) {
          recursiveFind(filePath, keyword, (innerMatches) => {
            matches = matches.concat(innerMatches);
            if (--pending === 0) {
              cb(matches);
            }
          });
        } else {
          fs.readFile(filePath, 'utf8', (err, content) => {
            if (err) {
              if (--pending === 0) {
                cb(matches);
              }
              return;
            }

						// 키워드 포함인지 찾는부분
            if (content.includes(keyword)) {
              matches.push(filePath);
            }
						
						// 찾고 나서 찾은 파일 감소
            if (--pending === 0) {
              cb(matches);
            }
          });
        }
      });
    });
  });
}
```

1. 주어진 경로(dir)에서 모든 파일과 디렉토리를 읽습니다.
2. 파일을 검사하여 키워드가 포함되어 있는지 확인합니다.
3. 매칭되는 파일 이름을 배열에 추가합니다.
4. 디렉토리를 검사하고 재귀적으로 실행합니다.
5. 모든 검색이 완료되면 결과를 콜백함수(cb)를 사용하여 반환합니다.