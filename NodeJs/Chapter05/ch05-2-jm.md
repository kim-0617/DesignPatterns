## download() 함수가 얼마나 간단하고 간결해졌는지 잠시 살펴봅시다. (178p)
```js
// callback version
function download (url, filename, cb) {
  console.log(`Downloading ${url}`)
  superagent.get(url).end((err, res) => {
    if (err) {
      return cb(err)
    }
    saveFile(filename, res.text, err => {
      if (err) {
        return cb(err)
      }
      console.log(`Downloaded and saved: ${url}`)
      cb(null, res.text)
    })
  })
}
```
```js
// promise version
function download (url, filename) {
  console.log(`Downloading ${url}`)
  let content
  return superagent.get(url)
    .then((res) => {
      content = res.text
      return mkdirpPromises(dirname(filename))
    })
    .then(() => fsPromises.writeFile(filename, content))
    .then(() => {
      console.log(`Downloaded and saved: ${url}`)
      return content
    })
}
```
```js
// async/await version
async function download (url, filename) {
  console.log(`Downloading ${url}`)
  const { text: content } = await superagent.get(url)
  await mkdirpPromises(dirname(filename))
  await fsPromises.writeFile(filename, content)
  console.log(`Downloaded and saved: ${url}`)
  return content
}
```
~~async/await 너무 좋아요~~

## 개발자들이 Array.forEach() 또는... (179p)
그러나 iteration 함수에 의해 반한된 프라미스는 forEach()에 의해 무시됩니다.

**왜죠?**
```js
// A function to execute for each element in the array. Its return value is discarded.
forEach(callbackfn: (value: T, index: number, array: T[]) => void, thisArg?: any): void
map<U>(callbackfn: (value: T, index: number, array: T[]) => U, thisArg?: any): U[]
```
async/await 함수를 Array.forEach() 메서드의 콜백 함수로 사용하면

각 요소의 처리가 비동기로 처리될 수는 있지만

이때 반환된 프로미스를 처리할 수 있는 방법이 없기 때문에 그냥 무시되는 것입니다.

## 첫 번째 작업은 taskQueue에서 제거되고, resolve를 호출할 때... (184p)
```js
runTask (task) {
  return new Promise((resolve, reject) => {
    const taskWrapper = () => {
      const taskPromise = task()
      taskPromise.then(resolve, reject)
      return taskPromise
    }

    if (this.consumerQueue.length !== 0) {
      // there is a sleeping consumer available, use it to run our task
      const consumer = this.consumerQueue.shift()
      consumer(taskWrapper)
    } else {
      // all consumers are busy, enqueue the task
      this.taskQueue.push(taskWrapper)
    }
  })
}
```
어려운 코드가 둘 있습니다.
1. taskPromise.then(resolve, reject)
2. consumer(taskWrapper)

### 우선 확인
```js
runTask (task) { // task를 인자로 받아 (task도 함수임)
  return new Promise((resolve, reject) => { // Promise를 return하는 메서드
    const taskWrapper = () => { // taskWrapper는 함수임
      const taskPromise = task() // taskPromise도 또 다른 함수임
      taskPromise.then(resolve, reject) // (1) .then()을 왜 할까요?
      return taskPromise
    }

    if (this.consumerQueue.length !== 0) {
      // there is a sleeping consumer available, use it to run our task
      const consumer = this.consumerQueue.shift() // this.consumerQueue.shift()로 빼온 consumer는 resolve. resolve 또한 (cb)함수
      consumer(taskWrapper) // (2) resolve(taskWrapper)로 볼 수 있음
    } else {
      // all consumers are busy, enqueue the task
      this.taskQueue.push(taskWrapper)
    }
  })
}
```

### (1) .then()을 왜 할까요?
```
이렇게 taskWrapper 함수에서 then 메서드를 호출하는 이유는 task 함수의 실행 결과를 처리하기 위해서입니다.
taskWrapper 함수는 task 함수의 실행 결과를 반환하며, 해당 결과는 then 메서드에서 resolve나 reject를 호출하는 데 사용됩니다.
따라서, then 메서드를 호출하지 않으면, task 함수의 실행 결과가 처리되지 않고, 프로미스 객체가 처리될 수 없습니다.
```

### (2) resolve(taskWrapper)로 볼 수 있음
resolve임을 확인할 수 있는 코드
```js
async getNextTask () {
  return new Promise((resolve) => {
    if (this.taskQueue.length !== 0) {
      return resolve(this.taskQueue.shift())
    }

    this.consumerQueue.push(resolve) // 요기요
  })
}
```

### 마지막, task()
함수임을 확인할 수 있는 코드
```js
const content = await queue.runTask(async () => {
  try {
    return await fsPromises.readFile(filename, 'utf8')
  } catch (err) {
    if (err.code !== 'ENOENT') {
      throw err
    }

    // The file doesn't exist, so let’s download it
    return download(url, filename)
  }
})
```
runTask() 메서드의 인수로 async 함수를 넣었네요!