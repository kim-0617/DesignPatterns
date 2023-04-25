
## Promise.all

```jsx
// 1. Pomise.all

/*
Promise.all은 프라미스가 하나라도 거절되면 전체를 거절합니다.
따라서, 프라미스 결과가 모두 필요할 때같이 ‘모 아니면 도’ 일 때 유용합니다.

아래 Promise.all은 3초 후에 처리되고, 반환되는 프라미스의 result는 배열 [1, 2, 3]이 됩니다.
*/
Promise.all([
  new Promise((resolve) => setTimeout(() => resolve('VALUE 1'), 1000)),
  new Promise((resolve) => setTimeout(() => resolve('VALUE 2'), 1500)),
  // new Promise((_, reject) => setTimeout(() => reject('REASON 2'), 1500)),
  new Promise((resolve) => setTimeout(() => resolve('VALUE 3'), 2000)),
])
  .then((results) => {
    console.log('==================== then1 ====================', results);
    return results;
  })
  .then((results) => {
    console.log('==================== then2 ====================', results);
    return results;
  })
  .catch((results) => {
    console.log('==================== catch ====================', results);
    // return results;
  })
  .finally((results) =>
    console.log('==================== finally ====================', results)
  ); // finally는 data를 못가져온다!!!!

/*
배열 result의 요소 순서는 Promise.all에 전달되는 프라미스 순서와 상응한다는 점에 주목해 주시기 바랍니다.
Promise.all의 첫 번째 프라미스는 가장 늦게 이행되더라도 처리 결과는 배열의 첫 번째 요소에 저장됩니다.
작업해야 할 데이터가 담긴 배열을 프라미스 배열로 매핑하고, 이 배열을 Promise.all로 감싸는 트릭은 자주 사용됩니다.

URL이 담긴 배열을 fetch를 써서 처리하는 예시를 살펴봅시다.
*/
let urls = [
  'https://api.github.com/users/iliakan',
  'https://api.github.com/users/Violet-Bora-Lee',
  'https://api.github.com/users/jeresig',
];

// fetch를 사용해 url을 프라미스로 매핑합니다.
let requests1 = urls.map((url) => fetch(url));

// Promise.all은 모든 작업이 이행될 때까지 기다립니다.
Promise.all(requests1)
  .then((responses) =>
    responses.forEach((response) =>
      console.log(`${response.url}: ${response.status}`)
    )
  )
  .then(console.log);

let names = ['iliakan', 'Violet-Bora-Lee', 'jeresig', 'overflowbin222'];
let requests2 = names.map((name) => {
  // fetch를 사용해 url을 프라미스로 매핑합니다.
  const mappingToPromise = fetch(`https://api.github.com/users/${name}`);
  console.log('mappingToPromise', mappingToPromise);
  return mappingToPromise;
});

Promise.all(requests2)
  .then((responses) => {
    // 모든 응답이 성공적으로 이행되었습니다.
    for (let response of responses) {
      // console.log('pending?', response);
      console.log(`${response.url}: ${response.status}`); // 모든 url의 응답코드가 200입니다.
    }
    return responses;
  })

  // 응답 메시지가 담긴 배열을 response.json()로 매핑해, 내용을 읽습니다.
  .then((responses) => Promise.all(responses.map((r) => r.json())))

  // JSON 형태의 응답 메시지는 파싱 되어 배열 'users'에 저장됩니다.
  .then((users) => {
    users.forEach((user) => console.log(user.name));
    return users;
  })

  .then((users) => {
    console.log('============== .then ==============', users);
    return users;
  })

  .catch((users) => {
    console.log('============== .catch ==============', users);
    return users;
  }) // 작동 X

  .finally((user) =>
    console.log('============== .finally ==============', user)
  ); // undefined

```

## Promise.allSettled

```jsx
// 2. Promise.allSettled

/*
fetch를 사용해 여러 사람의 정보를 가져오고 있다고 해봅시다.
여러 요청 중 하나가 실패해도 다른 요청 결과는 여전히 필요합니다.

이럴 때 Promise.allSettled를 사용할 수 있습니다.
*/

let urls = [
  'https://api.github.com/users/iliakan',
  'https://api.github.com/users/Violet-Bora-Lee',
  'https://no-url',
];

Promise.allSettled(urls.map((url) => fetch(url)))
  .then((results) => {
    results.forEach((result) =>
      console.log('================== Promise ================', result)
    );
    return results;
  })

  .then((results) => {
    results.forEach((result, num) => {
      if (result.status == 'fulfilled') {
        console.log(`${urls[num]}: ${result.value.status}`);
      }
      if (result.status == 'rejected') {
        console.log(`${urls[num]}: ${result.reason}`);
      }
    });

    return results;
  })
  .then((results) => {
    console.log('============= .then =============', results);
    return results;
  }) // [...promises...]
  .catch((results) => {
    console.log('============= .catch =============', results);
    return results;
  }) // 작동 X
  .finally((results) =>
    console.log('============= .finally =============', results)
  ); // undefined

```

