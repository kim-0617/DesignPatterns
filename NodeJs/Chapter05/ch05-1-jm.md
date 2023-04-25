## fsPromises.writeFile(filename, content) (165p)
```js
import { promises as fsPromises } from 'fs'
import { dirname } from 'path'
import superagent from 'superagent'
import mkdirp from 'mkdirp'
import { urlToFilename, getPageLinks } from './utils.js'
import { promisify } from 'util'

const mkdirpPromises = promisify(mkdirp)

function download (url, filename) {
  console.log(`Downloading ${url}`)
  let content
  return superagent.get(url)
    .then((res) => {
      content = res.text
      return mkdirpPromises(dirname(filename)) // 프라미스화된 함수 mkdirpPromises()는 프라미스를 return
    })
    .then(() => fsPromises.writeFile(filename, content)) // 여기가 이해가 잘 안 갔음
    // fs.writeFile(filename, content, cb)를 프라미스화해서 사용한 것
    .then(() => {
      console.log(`Downloaded and saved: ${url}`)
      return content
    })
}
```

## (콜백을 사용할 때...) 오류를 전파하기 위한 로직을... (167p)
```js
// (4장) 콜백 사용 spiderLinks() spider()
function spiderLinks (currentUrl, body, nesting, cb) {
  if (nesting === 0) {
    // Remember Zalgo?
    return process.nextTick(cb)
  }

  const links = getPageLinks(currentUrl, body) // [1]
  if (links.length === 0) {
    return process.nextTick(cb)
  }

  function iterate (index) { // [2]
    if (index === links.length) {
      return cb()
    }

    spider(links[index], nesting - 1, function (err) { // [3]
      if (err) {
        return cb(err) // 콜백으로 오류 전파!
      }
      iterate(index + 1)
    })
  }

  iterate(0) // [4]
}

export function spider (url, nesting, cb) {
  const filename = urlToFilename(url)
  fs.readFile(filename, 'utf8', (err, fileContent) => {
    if (err) {
      if (err.code !== 'ENOENT') {
        return cb(err)
      }

      // The file doesn't exist, so let’s download it
      return download(url, filename, (err, requestContent) => {
        if (err) {
          return cb(err) // 콜백으로 오류 전파!
        }

        spiderLinks(url, requestContent, nesting, cb)
      })
    }

    // The file already exists, let’s process the links
    spiderLinks(url, fileContent, nesting, cb)
  })
}
```
```js
// (5장) 프라미스 사용 spiderLinks() spider()
function spiderLinks (currentUrl, content, nesting) {
  let promise = Promise.resolve()
  if (nesting === 0) {
    return promise
  }
  const links = getPageLinks(currentUrl, content)
  for (const link of links) {
    promise = promise.then(() => spider(link, nesting - 1))
  }

  return promise
}

export function spider (url, nesting) {
  const filename = urlToFilename(url)
  return fsPromises.readFile(filename, 'utf8')
    .catch((err) => {
      if (err.code !== 'ENOENT') {
        throw err
      }

      // The file doesn't exist, so let’s download it
      return download(url, filename)
    })
    .then(content => spiderLinks(url, content, nesting))
}

// spider-cli.js
spider(url, nesting)
  .then(() => console.log('Download complete'))
  .catch(err => console.error(err)) // 여기에서 모든 에러를 잡아냄
```

## 책에는 TaskQueue Class 전체 코드가 없다. TaskQueue 객체를 초기화하고 (171~172p)
```js
export class TaskQueue {
  // 사실 생성자만 책에 없다
  constructor (concurrency) {
    this.concurrency = concurrency
    this.running = 0
    this.queue = []
  }

  runTask (task) {
    return new Promise((resolve, reject) => { // (여기 프라미스)
      this.queue.push(() => {
        return task().then(resolve, reject) // 작업을 실행(task())하고 그 결과(resolve() 또는 rejcet())를 (여기 프라미스)로 전달
        // 예제에서 task()는 콜백 함수임
        /*
        .runTask(() => {
          return fsPromises.readFile(filename, 'utf8') // 여기 프라미스에서 resolve()
            .catch((err) => {
              if (err.code !== 'ENOENT') {
                throw err
              }

              // The file doesn't exist, so let’s download it
              return download(url, filename)
            })
        })
        */
      })
      process.nextTick(this.next.bind(this))
    })
  }

  next () {
    while (this.running < this.concurrency && this.queue.length) {
      const task = this.queue.shift()
      task().finally(() => {
        this.running--
        this.next()
      })
      this.running++
    }
  }
}
```
```js
export function spider (url, nesting, concurrency) {
  const queue = new TaskQueue(concurrency) // 초기화
  return spiderTask(url, nesting, queue)
}
```

## 스파이더 처리의 깊이가... 데드락을 초래할 수 있기 때문입니다. (172p)
### 데드락
```
데드락(Deadlock)은 둘 이상의 작업이 서로 상대방의 작업이 끝나기를 기다리며 진행이 멈춘 상태를 말합니다. 이 상황에서는 모든 작업이 멈추고 아무 일도 일어나지 않는 상태가 됩니다. 데드락이 발생하면 작업의 실행이 중단되고 시스템의 성능이 저하될 수 있습니다.

예를 들어, 큐에 5개의 작업이 들어 있고 동시성 제한이 2인 경우, 동시에 최대 2개의 작업만 실행됩니다. 큐에서 첫 번째 작업을 실행 중일 때, 다른 작업은 대기열에서 대기하게 됩니다. 그러나, 첫 번째 작업이 두 번째 작업의 실행을 기다리면서 대기 상태가 되면, 큐에는 다른 작업이 있지만 실행할 수 있는 작업이 없어진 상황이 발생합니다. 이것이 데드락 상태입니다.
```
- 의도적으로 spiderLinks()를 우리가 제한하고자 하는 작업의 바깥에 두었다는 것을 주목하십시오.
  - queue.runTask().then() then()의 onFulfilled에서 spiderLinks()를 호출
```js
function spiderTask (url, nesting, queue) {
  if (spidering.has(url)) {
    return Promise.resolve()
  }
  spidering.add(url)

  const filename = urlToFilename(url)

  return queue
    .runTask(() => {
      return fsPromises.readFile(filename, 'utf8')
        .catch((err) => {
          if (err.code !== 'ENOENT') {
            throw err
          }

          // The file doesn't exist, so let’s download it
          return download(url, filename)
        })
    })
    .then(content => spiderLinks(url, content, nesting, queue))
}
```
- 동시성을 제한함
  - runTask(task()) 콜백 함수 task()에서
  - next()메서드를 호출해서 데드락을 방지함
```js
next () {
    while (this.running < this.concurrency && this.queue.length) {
      const task = this.queue.shift()
      task().finally(() => {
        this.running--
        this.next()
      })
      this.running++
    }
  }
```