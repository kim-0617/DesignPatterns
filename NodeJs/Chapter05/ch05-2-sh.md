# 05 - 2

## Async / await

- async / await 구문을 사용하면 각 비동기 작업에서 다음 구문을 실행하기 전에 결과를 기다리며 차단되는 것처럼 보이는 함수를 작성할 수 있습니다.
- async / await 구문을 이용한 비동기 코드는 전통적인 동기적 코드에 버금가는 가독성을 가지고 있습니다.
- async / await 구문은 프라미스에 크게 의지합니다.
- async 함수는 항상 프라미스를 반환합니다. 이것은 async 함수의 반환값이 Promise.resolve()에 전달된 다음 호출자에게 반환된 것과 같습니다.
- async 함수를 호출하는 것은 다른 비동기 작업과 마찬가지로 즉시 수해오딥니다. 즉, async 함수는 프라미스를 동기적으로 반환합니다.
- await 표현은 프라미스와 같은 비동기적인 표현뿐만 아니라, 어떠한 값으로도 작동합니다. 만약 프라미스가 아닌 값이 제공되면 그것의 동작은 Promise.resolve()에 전달된 값을 기다리는 것과 비슷합니다.

## Async / await 에서의 에러처리

- async / await의 큰 장점 중 하나는 try…catch 블록의 동작을 정규화하여 동기적 throws와 비동기적 프라미스의 거부 두 상황 모두에서 잘 작동하도록 하는 것입니다.
- 에러처리는 간단하고, 가독성이 좋으며, 무엇보다도 비동기적 / 동기적 에러를 모두 지원해야 합니다.

```jsx
function delayError(milliseconds) {
  return new Promise((resolve, reject) => {
    // milliseconds 후에 거절되는 Promise
    setTimeout(() => {
      reject(new Error(`Error after ${milliseconds}ms`));
    }, milliseconds);
  });
}

async function playingWithErrors(throwSyncError) {
  try {
    // 동기적 오류상황
    if (throwSyncError) {
      throw new Error("This is a synchronous error");
    }

    // 비동기적 오류상황
    await delayError(1000);
  } catch (err) {
    // 동기적, 비동기적 오류상황에 맞게 메세지가 찍힌다.
    console.error(`We have an error: ${err.message}`);
  } finally {
    console.log("Done");
  }
}

// throws a synchronous error
playingWithErrors(true);
// awaited Promise will reject
playingWithErrors(false);
```

### “return” vs “return await” 함정

- 흔한 안티패턴 중 하나는 async / await와 함께 에러를 다룰 때 호출자에 거부하는 프라미스를 반환하고, 프라미스를 반환하는 함수의 로컬 try…catch 블록에서 에러가 잡히는 것을 예상하는 것입니다.
- 다음은 에러가 try..catch 구문에서 에러가 잡히지 않습니다.

```jsx
function delayError(milliseconds) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(new Error(`Error after ${milliseconds}ms`));
    }, milliseconds);
  });
}

async function errorNotCaught() {
  try {
    // 거절되는 Promise 객체 return
    return delayError(1000);
    // 만약 로컬에서 처리하고 프라미스의 거부를 포착하고 싶다면..
    return await delayError(1000); // awiat 키워드 추가
  } catch (err) {
    console.error("Error caught by the async function: " + err.message);
  }
}

errorNotCaught().catch((err) =>
  console.error("Error caught by the caller: " + err.message)
);
// 사실상 위의 catch 구문에서 에러핸들링이 가능합니다.
```

- 만약 로컬 try…catch 블럭에서 에러를 잡고싶다면 거절되는 Promise 객체 return 문에서 await 키워드를 붙여줘야 합니다. 이렇게되면, 함수 호출부의 catch 블럭이 아닌 로컬 try…catch 블럭에서 에러를 핸들링할 수 있습니다.

### 안티패턴이란?

- 안티패턴은 소프트웨어 공학 분야 용어이며, 실제 많이 사용되는 패턴이지만 비효율적이거나 비생산적인 패턴을 의미한다.

## 순차 실행을 위한 forEach와 async / await의 사용의 안티패턴

- 개발자들이 Array.forEach() 또는 Array.map()과 함께 async / await를 사용한 순차 비동기 반복을 구현하려고 시도하는 안티패턴이 존재합니다. 다음은 예상대로 동작하지 않습니다.

```jsx
const doSomethingAsync = (item) => {
  return new Promise((res, rej) => {
    setTimeout(() => {
      res(item + 1);
    }, (Math.random() + 1) * 1000);
  });
};

const items = [1, 2, 3];

items.forEach(async (item) => {
  const result = await doSomethingAsync(item);
  console.log(result);
});
```

- setTimeout의 초를 랜덤하게 준 상태에서 forEach의 콜백으로 async함수를 선언하고 await 구문으로 doSomethingAsync함수를 기다리는게 의도였지만 forEach 함수에 의해 doSomethingAsync가 반환하는 프라미스는 무시됩니다.
- 다음과 같이 for…of 나 Promise.all을 활용하여 해결할 수 있습니다.

```jsx
for (const item of items) {
  const result = await doSomethingAsync(item);
  console.log(result);
}

// 또는

const results = await Promise.all(
  items.map(async (item) => {
    const result = await doSomethingAsync(item);
    return result;
  })
);

console.log(results);
```
