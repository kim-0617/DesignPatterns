## ch06-1 요약
Node.js와 같은 이벤트 기반 플랫폼에서

**I/O를 처리**하는 가장 효율적인 방법은

<u>실시간으로 입력을 사용할 수 있게 되는 즉시 사용</u>하고

<u>애플리케이션이 처리하는 즉시 출력</u>을 내보내는 것

## (198p) 'Content-Type': 'application/octet-stream'
```js
const httpRequestOptions = {
  hostname: serverHost,
  port: 3000,
  path: '/',
  method: 'PUT',
  headers: {
    'Content-Type': 'application/octet-stream',
    'Content-Encoding': 'gzip',
    'X-Filename': basename(filename)
  }
}
```
```
Content-Type: application/octet-stream은 HTTP 헤더의 하나로, 해당 헤더는 HTTP 요청 또는 응답에서 전송되는 데이터의 형식을 나타냅니다.

Content-Type은 MIME (Multipurpose Internet Mail Extensions) 형식으로 표현되며,
이는 데이터의 종류와 형식을 식별하기 위해 사용됩니다. Content-Type 헤더의 값은 데이터의 미디어 타입을 나타내며, 주로 파일 형식이나 데이터의 종류를 지정하는 데 사용됩니다.

"application/octet-stream"은 이진 데이터를 나타내는 MIME 유형입니다.
이 형식은 특정한 데이터 형식을 명시하지 않고, 단순히 이진 형태의 데이터를 전송하기 위해 사용됩니다.
이러한 형식은 주로 파일 다운로드나 바이너리 데이터 전송에 사용됩니다.

"application/octet-stream"으로 지정된 데이터는 일반적으로 특정한 데이터 형식에 의존하지 않고, 바이너리로 구성된 파일 또는 데이터를 나타냅니다.
이는 이미지, 오디오, 비디오, 압축 파일 등 다양한 형식의 파일을 포함할 수 있습니다.
따라서 데이터 수신측에서는 이진 데이터를 다운로드하거나 처리하기 위해 별도의 로직을 구현해야 합니다.

데이터 형식이 이미 알려진 경우, 보다 구체적인 MIME 유형을 사용하는 것이 좋습니다.
예를 들어, 이미지 파일의 경우 "image/jpeg" 또는 "image/png"와 같은 MIME 유형을 사용하여 명시적으로 데이터 형식을 지정할 수 있습니다.
```

## (200p) 'hex'와 iv, '파일 암호화를 위한 초기화 벡터로 사용할 임의의 바이트들의 시퀀스'가 무엇인가? 답변은 GPT가...
```js
...
const secret = Buffer.from(process.argv[4], 'hex')

const iv = randomBytes(16)
...
```
```
'hex'는 데이터를 16진수로 인코딩하거나 디코딩하기 위한 형식입니다.
Buffer.from() 메서드의 두 번째 매개변수로 사용되며, 주어진 문자열을 16진수로 해석하여 Buffer 객체를 생성합니다.

위의 코드에서 secret 변수는 process.argv[4] 값인 문자열을 16진수로 디코딩하여 Buffer 객체로 변환하는 것을 보여줍니다.
이는 주로 비밀키나 암호와 같은 데이터를 16진수 형식으로 전달받아 사용할 때 유용합니다.

iv는 "Initialization Vector"의 약자로, 초기화 벡터라고 불리는 값입니다.
파일 암호화에 사용되는 암호화 알고리즘은 대부분 블록 암호화 방식을 사용합니다.
이러한 알고리즘에서는 평문을 고정된 크기의 블록으로 나누어 암호화하게 됩니다.
그리고 각 블록을 암호화할 때마다 초기화 벡터가 필요합니다.

초기화 벡터는 각 블록의 암호화를 위해 사용되는 값으로, 각 블록마다 다른 초기화 벡터를 사용하면 암호화의 안전성이 향상됩니다.
iv 변수는 randomBytes(16) 함수를 통해 16바이트 길이의 임의의 값을 생성하여 초기화 벡터로 사용합니다.
이 값은 암호화 및 복호화 과정에서 필요한 초기 상태 값을 제공합니다.
```
```
시퀀스는 순서대로 나열된 일련의 항목 또는 사건을 의미합니다.
파일 암호화에서 "임의의 바이트들의 시퀀스"는 임의로 선택된 바이트들이 순차적으로 나열된 것을 의미합니다.

암호화 알고리즘에서 초기화 벡터는 각 블록의 암호화에 사용되는 값으로, 이 값은 보안성을 높이기 위해 매번 다른 값이어야 합니다.
따라서 초기화 벡터는 임의로 선택되어야 하며, 그 선택은 예측 불가능하고 보안적으로 안전해야 합니다.
이를 위해 일반적으로 암호학적으로 안전한 의사난수(random)를 사용하여 임의의 바이트들의 시퀀스를 생성합니다.

이 시퀀스는 암호화 과정에서 블록들을 초기화하는 데 사용되며, 같은 초기화 벡터를 사용하는 경우에는 동일한 평문에 대해 동일한 암호문이 생성됩니다.
따라서, 보안성을 유지하기 위해서는 각 암호화에 대해 고유한 초기화 벡터를 생성해야 합니다.

암호화에서 초기화 벡터는 암호화 과정에서 한 번 사용되며, 이후에는 동일한 초기화 벡터를 사용하지 않는 것이 보안적으로 안전합니다.
따라서, 다른 파일을 암호화할 때마다 새로운 초기화 벡터를 생성해야 합니다.
```

## (201p) 'aes192'는 무엇인가? SHA와 차이점은? 또 답변은 GPT가...
```js
const server = createServer((req, res) => {
  const filename = basename(req.headers['x-filename'])
  const iv = Buffer.from(req.headers['x-initialization-vector'], 'hex')
  const destFilename = join('received_files', filename)
  console.log(`File request received: ${filename}`)
  req
    .pipe(createDecipheriv('aes192', secret, iv))
    .pipe(createGunzip())
    .pipe(createWriteStream(destFilename))
    .on('finish', () => {
      res.writeHead(201, { 'Content-Type': 'text/plain' })
      res.end('OK\n')
      console.log(`File saved: ${destFilename}`)
    })
})
```
```
aes192는 192비트 길이의 키를 사용하는 Advanced Encryption Standard (AES) 암호화 알고리즘 중 하나입니다.
AES는 대칭키 암호화 알고리즘으로, 비밀키를 사용하여 데이터를 암호화하고 복호화하는 데 사용됩니다.

AES는 현재 가장 널리 사용되는 암호화 알고리즘 중 하나로, 안전성과 성능 면에서 우수한 평가를 받고 있습니다.
AES는 128, 192, 256비트의 세 가지 키 길이를 지원하며, aes192는 그 중 하나입니다.

암호화에서 aes192 알고리즘은 주어진 비밀키와 초기화 벡터(iv)를 사용하여 데이터를 암호화하는 데에 사용됩니다.
createDecipheriv() 함수는 암호화 알고리즘과 암호화에 사용될 비밀키 및 초기화 벡터를 입력받아 복호화를 위한 Transform 스트림을 생성합니다.
이를 통해 요청(req) 데이터를 AES-192 알고리즘을 사용하여 복호화할 수 있게 됩니다.
```
```
AES와 SHA는 모두 암호화와 관련된 알고리즘입니다. 각각의 알고리즘이 어떤 용도로 사용되는지 살펴보겠습니다.

AES (Advanced Encryption Standard):
AES는 대칭키 암호화 알고리즘으로, 데이터의 기밀성을 보호하기 위해 사용됩니다.
AES는 안전성과 효율성 측면에서 우수한 평가를 받아 널리 사용되고 있습니다.
주로 데이터를 암호화하고 복호화하는 데에 사용되며, 대칭키를 기반으로 하므로 암호화와 복호화에 동일한 키를 사용합니다.
AES는 128, 192, 256비트의 키 길이를 지원하며, 키 길이가 길수록 암호화 강도가 높아집니다.

SHA (Secure Hash Algorithm):
SHA는 해시 함수로, 주로 데이터 무결성 검사와 메시지 무결성을 보장하기 위해 사용됩니다.
SHA는 단방향 해시 함수로서, 임의의 길이의 데이터를 입력으로 받아 고정된 길이의 해시 값으로 변환합니다.
해시 함수의 특성상 입력 데이터를 복원할 수 없으며, 작은 변경에도 다른 해시 값이 생성되어 데이터의 무결성을 검증할 수 있습니다.
SHA-1, SHA-256, SHA-512 등 다양한 해시 알고리즘이 있으며, 각각의 길이와 보안 강도가 다릅니다.
SHA-256은 현재 가장 많이 사용되는 SHA 알고리즘 중 하나입니다.

따라서, AES와 SHA는 각자 다른 목적과 사용법을 가지고 있습니다.
AES는 데이터의 기밀성을 위한 암호화에 사용되고, SHA는 데이터의 무결성을 보장하기 위한 해시 함수로 사용됩니다.
둘 다 안정성과 보안성을 갖춘 알고리즘으로 평가받고 있습니다.
```

## (215~216p) _write()와 write
```js
// to-file-stream.js
export class ToFileStream extends Writable {
  constructor (options) {
    super({ ...options, objectMode: true })
  }

  _write (chunk, encoding, cb) {
    mkdirp(dirname(chunk.path))
      .then(() => fs.writeFile(chunk.path, chunk.content))
      .then(() => cb())
      .catch(cb)
  }
}

// index.js
const tfs = new ToFileStream()

tfs.write({ path: join('files', 'file1.txt'), content: 'Hello' })
tfs.write({ path: join('files', 'file2.txt'), content: 'Node.js' })
tfs.write({ path: join('files', 'file3.txt'), content: 'streams' })
```
```
ToFileStream 클래스는 Writable 스트림을 상속한 클래스입니다.
Writable 스트림은 데이터를 쓰는 기능을 제공하는 스트림이며, 데이터를 쓰기 위해서는 _write 메서드를 구현해야 합니다.

일반적으로 _write 메서드는 클래스 내부에서 사용되는 내부 메서드입니다.
직접 호출하거나 접근하는 것이 권장되지 않습니다.
대신, Writable 스트림을 사용하는 코드에서 write() 메서드를 호출하여 데이터를 쓸 수 있습니다.

tfs.write()는 ToFileStream 클래스의 인스턴스인 tfs를 통해 Writable 스트림의 write() 메서드를 호출하는 것입니다.
이를 통해 데이터를 스트림에 쓸 수 있습니다.
tfs.write()는 내부적으로 _write 메서드를 호출하여 데이터를 처리합니다.

따라서, tfs.write()는 ToFileStream 클래스의 Writable 스트림에서 제공되는 메서드를 사용하여 데이터를 쓰는 것이며,
_write 메서드는 내부적으로 호출되어 실제로 데이터를 처리합니다.
tfs.write()를 통해 외부 코드에서 데이터를 쓸 수 있도록 인터페이스를 제공하는 것입니다.
```

## (228~229p) 브로틀리 압축(.br)
```js
const filepath = process.argv[2] // ①
const filename = basename(filepath)
const contentStream = new PassThrough() // ②

upload(`${filename}.br`, contentStream) // ③
  .then((response) => {
    console.log(`Server response: ${response.data}`)
  })
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })

createReadStream(filepath) // ④
  .pipe(createBrotliCompress())
  .pipe(contentStream)
```
```
createBrotliCompress()는 Node.js에서 제공하는 내장 모듈인
zlib 모듈의 하나인 brotli 압축 알고리즘을 사용하여 데이터를 압축하는 Transform 스트림을 생성하는 함수입니다.

brotli 알고리즘은 데이터를 효율적으로 압축하는 데 사용되는 압축 알고리즘 중 하나입니다.
이 알고리즘은 데이터를 작은 크기로 압축하면서도 상대적으로 빠른 압축과 해제 속도를 제공합니다.

createBrotliCompress() 함수를 사용하여 brotli 알고리즘을 사용하는 압축 스트림을 생성할 수 있습니다.
이 스트림은 입력 데이터를 압축하여 출력 스트림으로 전달하는 역할을 합니다.
압축된 데이터는 출력 스트림을 통해 전송되거나 저장될 수 있습니다.

위의 예시에서는 createReadStream(filepath)를 통해 파일로부터 데이터를 읽고,
그 데이터를 createBrotliCompress()를 통해 압축한 후 처리하고자 하는 대상으로 전달하는 것을 볼 수 있습니다.
이를 통해 파일 데이터를 Brotli 압축한 후 원하는 대상으로 전달할 수 있습니다.
```

## (235p) pipeline()을 사용한 개선된 오류 처리 > 스크립트 테스트 command
```js
const pipelinePromise = promisify(pipeline)

const uppercasify = new Transform({
  transform (chunk, enc, cb) {
    this.push(chunk.toString().toUpperCase())
    cb()
  }
})

async function main () {
  try {
    await pipelinePromise(
      process.stdin,
      createGunzip(),
      uppercasify,
      createGzip(),
      process.stdout
    )
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
}

main()
```
스크립트 테스트 command를 이해하셨나요?

`echo 'Hello World!' | gzip | node uppercasify-gzipped.js | gunzip`