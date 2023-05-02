```jsx
// async & await
// clear style of using promise
// 기존에 존재하는 Promise를 이용하여 간편하게 작성할 수 있게 도와준다(Syntatic Sugar)

// 1. Promise transger async/await
function fetchUser() {
  return new Promise((resolve, reject) => {
    // do network request in 10 secs...
    return resolve("OverFlowBIN");
  });
}

const user = fetchUser();
console.log("user: ", user);

async function fetchUser2() {
  // do network request in 10 secs...
  return "OverFlowBIN";
}

const user2 = fetchUser2();
console.log("user: ", user);

// 2. await
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// async가 붙게 되면 해당 함수는 Promise 객체를 return 한다
async function getApple() {
  await delay(1000);
  return "🍎";
}

async function getBanana() {
  await delay(1000);
  return "🍌";
}

async function pickFruits() {
  const apple = await getApple();
  const banana = await getBanana();
  return `${apple} + ${banana}`;
}

// pickFruits().then(console.log);

// 3. 병렬적 실행
async function pickFruits2() {
  const applePromise = getApple(); // Promise를 만들자 마자 해당 내부의 코드가 실행이 된다
  const bananaPromise = getBanana(); // Promise를 만들자 마자 해당 내부의 코드가 실행이 된다
  const apple = await applePromise; // 만들어진 Promise 객체를 await 처리
  const banana = await bananaPromise; // 만들어진 Promise 객체를 await 처리
  return `${apple} + ${banana}`;
}

// pickFruits2().then(console.log);

// 4. 병렬적 실행을 위한 Promise API(Promise.all)
function pickFruits3() {
  return Promise.all([getApple(), getBanana()]) // [ '🍎', '🍌' ]
    .then((fruit) => fruit.join(" + "));
}
pickFruits3().then(console.log);

// 5. pick only one
function pickFruits4() {
  return Promise.race([getBanana(), getApple()]);
}
pickFruits4().then(console.log);


```
