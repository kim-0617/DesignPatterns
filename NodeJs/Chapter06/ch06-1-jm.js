// (198p) 'Content-Type': 'application/octet-stream'
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


// (200p) 'hex'와 iv, '파일 암호화를 위한 초기화 벡터로 사용할 임의의 바이트들의 시퀀스'가 무엇인가? 답변은 GPT가...
const secret = Buffer.from(process.argv[4], 'hex')

const iv = randomBytes(16)


// (201p) 'aes192'는 무엇인가? SHA와 차이점은? 또 답변은 GPT가...
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


// (215~216p) _write()와 write
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


// (228~229p) 브로틀리 압축(.br)
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


// (235p) pipeline()을 사용한 개선된 오류 처리 > 스크립트 테스트 command
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