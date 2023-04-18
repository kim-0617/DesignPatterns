1. 콜백 함수를 그냥 쓰면 다음과 같이 콜백헬에서 헤어나오지 못할것이다.

```jsx
import { spider } from "./spider.js";

spider(process.argv[2], (err, filename, downloaded) => {
  if (err) {
    console.error(err);
  } else if (downloaded) {
    console.log(`Completed the download of "${filename}"`);
  } else {
    console.log(`"${filename}" was already downloaded`);
  }
});
```

```jsx
import fs from 'fs'
import path from 'path'
import superagent from 'superagent'
import mkdirp from 'mkdirp'
import { urlToFilename } from './utils.js'

export function spider (url, cb) {
  const filename = urlToFilename(url)
  fs.access(filename, err => { // [1] 해당 파일이 존재하는지 확인하여 해당 URL에서 이미 다운로드를 했는지 검사.
    if (err && err.code === 'ENOENT') {
      console.log(`Downloading ${url} into ${filename}`)
      superagent.get(url).end((err, res) => { // [2] 파일을 찾을 수 없을 경우 해당 URL은 다음의 코드를 통해 다운로드 된다.
        if (err) {
          cb(err)
        } else {
          mkdirp(path.dirname(filename), err => { // [3] 파일이 저장될 디렉토리가 있는지 확인한다.
            if (err) {
              cb(err)
            } else {
              fs.writeFile(filename, res.text, err => { // [4] HTTP응답의 내용을 파일 시스템에 던진다.
                if (err) {
                  cb(err)
                } else {
                  cb(null, filename, true)
                }
              })
            }
          })
        }
      })
    } else {
      cb(null, filename, false)
    }
  })
}
```

1. 기본적인 콜백 규칙을 통한 콜백 지옥에서 도망치기
- in-place 함수의 정의를 남용하지 않기
- 가능한 빨리 종료하기
- 콜백을 위해 명명된 함수를 생성하여 클로저 바깥에 배치하여 중간 결과를 인자로 전달한다.
- 코드를 모듈화 한다.

해당 코드의 중요한 사항은 빠른 반환 원칙이 적용될 수 있도록 파일의 존재 유무에 대한 검사의 순서를 바꾸었다는 것이다. 
빠른 반환 원칙과 다른 콜백 규칙들을 적용함으로써 코드의 중첩을 크게 줄일 수 있엇으며, 
동시에 재사용성 및 테스트 가능성을 높일 수 있었습니다.

```jsx
import fs from 'fs'
import path from 'path'
import superagent from 'superagent'
import mkdirp from 'mkdirp'
import { urlToFilename } from './utils.js'

/*
	saveFile 함수: 주어진 파일명과 내용(contents)을 받아 해당 파일을 생성하고 내용을 저장하는 함수입니다. 
	mkdirp 모듈을 사용하여 파일이 저장될 디렉토리를 생성한 뒤 fs.writeFile 메서드를 사용하여 파일을 
	생성하고 내용을 저장합니다.
	(동시에 재사용성 및 테스트 가능성을 높일 수 있게 해주는 함수)
*/
function saveFile (filename, contents, cb) {
  mkdirp(path.dirname(filename), err => {
    if (err) {
      return cb(err)
    }
    fs.writeFile(filename, contents, cb)
  })
}

/*
	download 함수: 주어진 URL로부터 웹 페이지를 다운로드하고 해당 페이지의 내용을 파일로 저장하는 함수입니다. 
	superagent 모듈을 사용하여 HTTP GET 요청을 보내고, 
	응답(res)의 텍스트 내용을 saveFile 함수를 호출하여 파일로 저장합니다. 
	다운로드가 완료되면 콜백 함수를 호출하여 다운로드된 파일의 내용을 전달합니다.
	(동시에 재사용성 및 테스트 가능성을 높일 수 있게 해주는 함수)
*/
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

/*
	spider 함수: 주어진 URL을 스크레이핑하여 해당 웹 페이지의 내용을 파일로 저장하는 함수입니다. 
	먼저 urlToFilename 함수를 사용하여 URL을 파일명으로 변환한 뒤, 
	fs.access 메서드를 사용하여 해당 파일이 이미 존재하는지 확인합니다. 
	파일이 이미 존재할 경우 콜백 함수를 호출하여 파일명과 "false" 값을 전달합니다. 
	파일이 존재하지 않을 경우 download 함수를 호출하여 웹 페이지를 다운로드하고 파일로 저장한 뒤,
	콜백 함수를 호출하여 파일명과 "true" 값을 전달합니다.
*/
export function spider (url, cb) {
  const filename = urlToFilename(url)
  fs.access(filename, err => {
    if (!err || err.code !== 'ENOENT') { // [1]
      return cb(null, filename, false)
    }
    download(url, filename, err => {
      if (err) {
        return cb(err)
      }
      cb(null, filename, true)
    })
  })
}
```

1. 큐를 사용하여 제한된 병렬 실행
    
    3-1. 재귀함수로 적용하여 순차적인 웹 스파이더를 호출하여 웹 스파이더 버전2
    
    ```jsx
    import fs from 'fs'
    import path from 'path'
    import superagent from 'superagent'
    import mkdirp from 'mkdirp'
    import { urlToFilename, getPageLinks } from './utils.js'
    
    function saveFile (filename, contents, cb) {
      mkdirp(path.dirname(filename), err => {
        if (err) {
          return cb(err)
        }
        fs.writeFile(filename, contents, cb)
      })
    }
    
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
            return cb(err)
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
              return cb(err)
            }
    
            spiderLinks(url, requestContent, nesting, cb)
          })
        }
    
        // The file already exists, let’s process the links
        spiderLinks(url, fileContent, nesting, cb)
      })
    }
    ```
    
    3-2. 병렬 실행을 이용하여 비동기 작업을 병렬로 실행하는 방식을 웹 스파이더 버전3
    
    ```jsx
    import fs from 'fs'
    import path from 'path'
    import superagent from 'superagent'
    import mkdirp from 'mkdirp'
    import { urlToFilename, getPageLinks } from './utils.js'
    
    function saveFile (filename, contents, cb) {
      mkdirp(path.dirname(filename), err => {
        if (err) {
          return cb(err)
        }
        fs.writeFile(filename, contents, cb)
      })
    }
    
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
    
    function spiderLinks (currentUrl, body, nesting, cb) {
      if (nesting === 0) {
        return process.nextTick(cb)
      }
    
      const links = getPageLinks(currentUrl, body)
      if (links.length === 0) {
        return process.nextTick(cb)
      }
    
      let completed = 0
      let hasErrors = false
    
      function done (err) {
        if (err) {
          hasErrors = true
          return cb(err)
        }
        if (++completed === links.length && !hasErrors) {
          return cb()
        }
      }
    
      links.forEach(link => spider(link, nesting - 1, done))
    }
    
    export function spider (url, nesting, cb) {
      const filename = urlToFilename(url)
      fs.readFile(filename, 'utf8', (err, fileContent) => {
        if (err) {
          if (err.code !== 'ENOENT') {
            return cb(err)
          }
    
          return download(url, filename, (err, requestContent) => {
            if (err) {
              return cb(err)
            }
    
            spiderLinks(url, requestContent, nesting, cb)
          })
        }
    
        spiderLinks(url, fileContent, nesting, cb)
      })
    }
    ```
    
    3-3. 병렬 실행의 방식은 동시 작업을 실행할 때의 문제점이 발생할 수 있었는데, 경쟁 상태와 작업 동기화의 문제점이 존재하였습니다. 
    그래서 경쟁상태를 제거하기 위하여 제한된 병렬 실행을 제시하였고, 결과적으로 큐를 이용하여 제한된 병렬 실행을 요청하는 웹 스파이더 4
    
    ```jsx
    import fs from 'fs'
    import path from 'path'
    import superagent from 'superagent'
    import mkdirp from 'mkdirp'
    import { urlToFilename, getPageLinks } from './utils.js'
    
    function saveFile (filename, contents, cb) {
      mkdirp(path.dirname(filename), err => {
        if (err) {
          return cb(err)
        }
        fs.writeFile(filename, contents, cb)
      })
    }
    
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
    
    function spiderLinks (currentUrl, body, nesting, queue) {
      if (nesting === 0) {
        return
      }
    
      const links = getPageLinks(currentUrl, body)
      if (links.length === 0) {
        return
      }
    
      links.forEach(link => spider(link, nesting - 1, queue))
    }
    
    function spiderTask (url, nesting, queue, cb) {
      const filename = urlToFilename(url)
      fs.readFile(filename, 'utf8', (err, fileContent) => {
        if (err) {
          if (err.code !== 'ENOENT') {
            return cb(err)
          }
    
          return download(url, filename, (err, requestContent) => {
            if (err) {
              return cb(err)
            }
    
            spiderLinks(url, requestContent, nesting, queue)
            return cb()
          })
        }
    
        spiderLinks(url, fileContent, nesting, queue)
        return cb()
      })
    }
    
    const spidering = new Set()
    export function spider (url, nesting, queue) {
      if (spidering.has(url)) {
        return
      }
    
      spidering.add(url)
      queue.pushTask((done) => {
        spiderTask(url, nesting, queue, done)
      })
    }
    ```
    
    콜백 함수와 일급 함수의 장점을 통하여 간단한 예제를 만들어보았습니다. 이 예제는 arr에 값에 함수를 넣어 각각의 값들을 콜백함수로 실행시키는 예제입니다. 
    콜백 함수의 핵심과 일급 함수의 핵심을 넣어서 간략화 하였습니다. 아주 쉽지만 유용하게 쓰일 수 있는 개념인지라 이해하는 것이 중요하다고 생각합니다.
    
    ```jsx
    var arr = [];
    
    function pushArr(listner) {
        arr.push(listner);
    }
    
    function sum(a, b, cb) {
        cb(new Error(), a + b);
    }
    
    function division(a, b, cb) {
        cb(null, a / b);
    }
    
    function square(a, b, cb) {
        cb(null, a * b);
    }
    
    function main() {
        pushArr((cb) => {
            sum(10, 5, cb);
        });
        pushArr((cb) => {
            division(10, 5, cb);
        });
        pushArr((cb) => {
            square(10, 5, cb);
        });
    
        calculate();
    }
    
    function calculate() {
        arr.forEach((data) => {
            data((err, res) => {
                if (err) return console.error("error");
                console.log(res);
            });
        });
    }
    
    main();
    
    // error
    // 2
    // 50
    ```
