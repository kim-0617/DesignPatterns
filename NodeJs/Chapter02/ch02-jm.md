## JSON.stringify()의 args (57p)
```js
JSON.stringify(value, replacer, space)
/** 
 * If replacer is anything other than a function or an array (e.g. null or not provided),
 * all string-keyed properties of the object are included in the resulting JSON string.
 * 
 * If this is a number, it indicates the number of space characters to be used as indentation,
 * clamped to 10 (that is, any number greater than 10 is treated as if it were 10).
 * Values less than 1 indicate that no space should be used.
 */
JSON.stringify(a, null, 2)
```
그래서 key는 "b", "a", "loaded"와 같이 string으로, indent가 2 spaces씩 들어갔군요!


## process.argv[2]가 뭘까요? (75p)
[Node.js docs](https://nodejs.org/docs/latest/api/process.html#process_process_argv)

The process.argv property returns an array containing the command-line arguments passed when the Node.js process was launched.
```js
import { argv } from 'node:process';

// print process.argv
argv.forEach((val, index) => {
  console.log(`${index}: ${val}`);
});
```
> $ node process-args.js one two=three four
```
0: /usr/local/bin/node
1: /Users/mjr/work/node/process-args.js
2: one
3: two=three
4: four
```
argv: string[]


## ESM이 순환 종속성 문제를 다루는 방법
- 59p에서 ESM이 순환 종속성 문제를 다루는 방법 처음 언급
- 파싱(순환 제거) => 인스턴스화 => 평가 단계를 거쳐 순환 종속성이 존재하는 상황에서도
- 모든 모듈이 다른 모듈의 `최신 상태`를 갖고 있음
- ESM도 순환 종속성이 존재함
- 순환 종속성이 발생하는 경우 계산 비용이 많이 소모됨(리소스를 많이 사용)
- eslint의 rule도 있습니다. [import/no-cycle](https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/no-cycle.md)
- 리팩토링을 진행하다 만났던 eslint rules인데, 가능하면 순환 종속성이 발생하지 않도록 코드를 짜거나
- `maxDepth`, `ignoreExternal` 옵션을 활용할 수 있겠네요!


## ESM에서 JSON 파일 직접 가져오기 (90p)
In TypeScript or using Babel, you can import json file in your code.
```js
// Babel

import * as data from './example.json';
const word = data.name;
console.log(word); // output 'testing'
```
위 답변을 포함한 다양한 방법은 [how-to-import-a-json-file-in-ecmascript-6](https://stackoverflow.com/questions/34944099/how-to-import-a-json-file-in-ecmascript-6) 요기에 있어요

### Node.js docs
JSON modules
Stability: 1 - `Experimental`
JSON files can be referenced by import:

```js
import packageConfig from './package.json' assert { type: 'json' };
```
The `assert { type: 'json' }` syntax is mandatory; see Import Assertions.

The imported JSON only exposes a `default` export. There is no support for named exports. A cache entry is created in the CommonJS cache to avoid duplication. The same object is returned in CommonJS if the JSON module has already been imported from the same path.