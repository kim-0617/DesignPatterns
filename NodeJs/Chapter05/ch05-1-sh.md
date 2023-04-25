# 05 - 1

## 5-1-1 Promise란 무엇인가?

- ECMA 2015부터 표준이 되었고, 노드버전 4부터 기본적으로 사용할 수 있다.
- 콜백을 대신할 강력한 대안으로 발돋음 하게 된다.
- 프라미스는 비동기 작업의 최종적인 결과(또는에러)를 담고있는 객체 입니다.
- 비동기 작업이 아직 완료되지 않았을 때, Pending (대기중)
- 작업이 성공적으로 끝났을 때, Fullfilled (이행됨)
- 작업이 에러와 함께 종료 됐을 때, Rejected (거부됨)
- 이 때, Promise가 이행되거나 거부됐을 때, 이것을 Settled (결정됨) 이라고 부른다.
- Promise가 Settled 되면 이행됐거나, 거부된 결과의 관련된 에러를 받기 위해서 프라미스 인스턴스의 then() 함수를 사용할 수 있습니다.

```jsx
promise.then(onFullfilled, onRejected)
```

- 역사적으로 여러가지 방법의 프라미스 구현이 존재했으며 대부분이 서로 호환되지 않았습니다. 즉, 서로 다른 라이브러리의 프라미스 객체는 체이닝을 할 수 없다는 뜻입니다.
- 이러한 점을 극복하고자 JavaScript 커뮤니티는 Promise/A+ 사양을 만들었습니다. 이 사양은 then() 함수의 동작을 자세히 설명하여 상호 운용가능한 기반을 제공함으로써, 서로 다른 라이브러리의 프라미스 객체를 바로 사용할 수 있게 하였습니다.
- 이러한 모든 객체를 thenable 이라는 Promise와 유사한 객체로 간주합니다.

## 5-1-3 프라미스 API

```jsx
const p1 = new Promise((resolve, reject) => {});
```

- resolve(obj) : 호출될 때 제공된 이행값으로 프라미스를 이행하는 함수이며, obj가 값이면 값 자체가 전달되고, thenable한 객체이면 obj의 이행값이 전달됩니다.
- reject(err) : err 사유와 함께 프라미스를 거부합니다. err는 Error 인스턴스를 나타내는 규약입니다.
- all(iterable) : 배열등을 인자로 받아서 배열 내의 모든 프라미스가 이행되면 이행된 결과값들의 배열을 이행값으로 하여 이행하는 새로운 프라미스를 생성합니다. 하나라도 거부되면 거부됩니다.
- allSettled(iterable) : 마찬가지로 배열등을 인자로 받아서 배열내의 모든 프라미스가 settled 될 때 까지 기다립니다. 이행값 또는 거부 사유를 담은 객체의 배열을 반환합니다. all 메서드와 다른점은 프라미스 중 하나가 거부될 때 즉시 거부되지 않고 모든 프라미스가 Settled 될 때 까지 기다립니다.
- race(iterable) : iterable 에서 가장 처음으로 Settled 된 프라미스를 반환합니다.

- then(onFullfilled, onRejected) : 이것은 프라미스의 필수함수로써, 앞서 언급한 Promise/A+ 표준과 호환됩니다.
- catch(onRejected) : 이것은 promise.then(undefined, onRejected)에 대한 편리한 버전 (syntatic-sugar)입니다.
- finally(onFinally) : onFullfilled, onRejected와 달리 onFinally 콜백은 입력으로 인자를 수신하지 않으며 여기에서 반환된 값은 무시됩니다. Finally에서 반환한 프라미스는 현재 프라미스 인스턴스의 이행값 또는 거부 사유로 결정됩니다. Promise 체인에서 항상 마지막에 실행됩니다. 이 메소드는 주로 로딩 상태를 나타내거나, 자원을 해제하거나, 리소스를 정리하는 등의 마무리 작업을 수행하는데 사용됩니다.

## 5-1-5 프라미스화

- 콜백 기반 함수의 일부 특성을 알고 있을 경우, 콜백 기반함수를 프라미스를 반환하는 동일한 함수로 변환할 수 있습니다. 이 변환을 프라미스화(promisification)라고 합니다.

### 기존 콜백 사용 코드

```jsx
import { randomBytes } from "crypto"

randomBytes(32, function (err, buffer) {
  if (err) {
    console.error(err)
  } else {
    console.log(`Random bytes: ${buffer.toString()}`)
  }
})
```

### 콜백규칙

- 콜백은 함수의 마지막 인자이다.
- 에러가 있다면 콜백에 첫 번째 인자로 전달된다.
- 모든 반환값은 콜백 함수의 error 인자 다음에 전달된다.

### 프라미스화 코드

```jsx
import { randomBytes } from 'crypto'

// 콜백 기반 API를 프라미스 기반으로 변환하는 함수
function promisify(callbackBasedApi) {
  return function promisified(...args) {
    // 새로운 Promise를 생성하여 반환
    return new Promise((resolve, reject) => {
      // 인자로 전달된 함수를 새로운 인자로 대체하여 호출
      const newArgs = [
        ...args,
        function (err, result) {
          if (err) {
            // 에러가 발생하면 프라미스를 거부하고 에러를 전달
            return reject(err)
          }
          // 정상적으로 결과가 반환되면 프라미스를 이행하고 결과를 전달
          resolve(result)
        }
      ]
      // 변환된 함수를 호출하여 새로운 프라미스를 반환
      callbackBasedApi(...newArgs)
    })
  }
}

// 랜덤 바이트를 생성하는 콜백 기반 API를 프라미스 기반으로 변환
const randomBytesP = promisify(randomBytes)

// 프라미스 기반의 랜덤 바이트 생성 함수를 호출하고 결과를 출력
randomBytesP(32)
  .then(buffer => {
    console.log(`Random bytes: ${buffer.toString()}`)
  })
```

- promisify 함수는 promisified 함수를 반환합니다.
- randomBytesP는 promisified 함수입니다.
- randomBytesP(32)를 호출하면 …args에 32가 대입되고 이 반환값은 Promise 객체 입니다.
- return new Promise 이부분에서 새로운 인자를 제작하게 되는데 …args(원래인자)에 함수를 추가하는데, 이것은 우리가 콜백은 함수의 맨 마지막 인자로 들어간다는 것을 알기 때문에 맨 마지막에 적어줍니다.
- 따라서 randomBytes(32, callbackFn) 형태로 실행하게 되는 것 입니다.
- 정상적으로 fullfilled 되었다면 resolve(result)가 호출 될 것이고, result는 32가 randomBytes화 된 것이기 때문에 그 문자열이 찍힐 것 입니다.