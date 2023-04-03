# require vs import 문법

자바스크립트 개발을 하다보면 모듈을 불러오는 문법 두가지 (  **require**  /  **exports**  ) 와 (  **import** /  **export**  ) 키워드를 접하게 되는데, 이 둘은 비슷하면서도 달라 가끔 자바스크립트 개발하는데 있어 혼동을 준다.

( **require** / **exports** ) 는 NodeJS에서 사용되고 있는  CommonJS  키워드이고 Ruby 언어 스타일과 비슷하다라고 볼수 있다.

( **import** /  **export**  ) 는  ES6(ES2015)에서 새롭게 도입된 키워드로서 Java나 Python 언어 방식과 비슷하다.

예를 들어, 아래 2줄의 코드는 기본적으로 외부 모듈의 코드를 불러오는 동일한 작업을 수행하고 있지만 문법 구조가 다름을 알수 있다.

```javascript
/* CommonJS */  
const  name  =  require('./module.js');
```
```javascript
/* ES6 */  
import  name  from  './module.js'
```

위 처럼  **import**  와  **require**  는 확연히 다르기 때문에 둘을 구분하는데 있어 무리가 없다.

하지만,  **export**  와  **exports**  는 단수냐 복수냐의 차이 때문에 많은 초보 개발자들이 혼동해 한다.

```javascript
/* CommonJS */  
const  name  =  '고양이';  

module.exports  =  name;
```
```javascript
/* ES6 */  
const  name  =  '고양이';  

export  default  name;
```

<br />

>**[ ES6 와 CommonJS 의 export(내보내기) 차이점 ]**  
>CommonJS와 ES6라는 모듈 시스템에서는 exports 객체라는 개념이 존재한다.  
exports는 모듈로부터 내보내지는 데이터들을 담고 있는 하나의 객체이다.  
여러분은 노드 프로젝트를 진행할때 module.exports = 라는 모듈 내보내기 구문을 자주 써왔을 것이다.  
그리고 ES6의 export default 구문이, CommonJS의 module.exports 구문 동작을 대체하기 위한 문법이라고 보면 된다.



<br />

### require와 import의 주요 차이점을 정리해보면 다음과 같다.
-   require()는 CommonJS를 사용하는 node.js문이지만  import()는 ES6에서만 사용
-   require()는 파일 (어휘가 아님)에 들어있는 곳에 남아 있으며  import()는 항상  맨 위로 이동
-   require()는 프로그램의 어느 지점에서나 호출 할 수 있지만  import()는  파일의 시작 부분에서만  실행할 수 있다. (그렇지만 import 전용 비동기 문법으로 파일 중간에 모듈 불러오기를 할 수 있다.  [참고글Visit Website](https://inpa.tistory.com/entry/JS-%F0%9F%93%9A-%EB%AA%A8%EB%93%88-%EC%82%AC%EC%9A%A9%ED%95%98%EA%B8%B0-import-export-%EC%A0%95%EB%A6%AC?category=889099#%EB%B8%8C%EB%9D%BC%EC%9A%B0%EC%A0%80(HTML)%EC%97%90%EC%84%9C_%EB%AA%A8%EB%93%88_%EC%82%AC%EC%9A%A9_%ED%95%98%EA%B8%B0))
-   하나의 프로그램에서 두 키워드를 동시에 사용할 수 없다
-   일반적으로  import()는 사용자가  필요한 모듈 부분 만 선택하고 로드 할 수 있기 때문에 더 선호된다. 또한  require()보다 성능이 우수하며 메모리를 절약한다.

<br />


# 모듈 전체 내보내기 / 가져오기

### CommonJs 문법(require / exports)
```javascript
// 모듈 전체를 export, 파일내 한번만 사용가능하다.  
const  obj  = {
  num: 100,  
  sum: function (a, b) {
    console.log(a  +  b);  
   },  
   extract: function (a, b) {
     console.log(a  -  b);  
   },  
};  

module.exports  =  obj;
```
```javascript
const  obj  =  require('./exportFile.js');  

obj.num; // 100  
obj.sum(10, 20); // 30  
obj.extract(10, 20); // -10
```

### ES6 문법 (import / export)
```javascript
// 모듈 전체를 export, 파일내 한번만 사용가능하다.  
const  obj  = {
  num: 100,
  sum: function (a, b) {
    console.log(a  +  b);  
  },  
  extract: function (a, b) {
    console.log(a  -  b);  
  },  
};  

export  default  obj;
```
```javascript
// 전체 자체를 import 할 경우 중괄호 없이 그냥 씀
import obj from './exportFile.js';

obj.num; // 100
obj.sum(10, 20); // 30
obj.extract(10, 20); // -10
```




<br />

# 모듈 개별 내보내기 / 가져오기

### CommonJs 문법(require / exports)
```javascript
// 멤버를 직접 일일히 export
exports.name = 'Ann'; // 변수의 export
exports.sayHello = function() { // 함수의 export
    console.log('Hello World!');
}
exports.Person = class Person { // 클래스의 export
    constructor(name){
        this.name = name;
    }
}
```
```javascript
const obj = require('./exportFile.js');

obj.num; // 100
obj.sum(10, 20); // 30
obj.extract(10, 20); // -10
```

>**[ CommonJs 방식으로 사용시 주의 사항 ]**   
>CommonJs 방식으로 모듈을 내보낼때는 ES6처럼 명시적으로 선언하는 것이 아니라 특정 변수나 그 변수의 속성으로 내보낼 객체를 세팅해줘야 한다.  
특히, 제일 햇갈리는 부분이 바로 유사해 보이는 export 변수와 module.exports 변수를 상황에 맞게 잘 사용해야 한다는 점이다.  
기본적으로 2가지 규칙만 기억하면 된다.  
>1. 여러개의 객체를 내보낼 경우 →  export.변수  의 개별 속성으로 할당  
>2. 딱 하나의 객체를 내보낼 경우 →  module.exports = 객체  자체에 할당


### ES6  문법 (import /  export)
```javascript
// 멤버를 직접 일일히 export
export const name = 'Ann'; // 변수의 export
export function sayHello() { // 함수의 export
    console.log('Hello World!');
}
export class Person { // 클래스의 export
    constructor(name){
        this.name = name;
    }
}


// ----------------------- OR ----------------------- //


// 멤버를 따로 묶어서 export
const name = 'Ann';
function sayHello() {
    console.log('Hello World!');
}
class Person {
    constructor(name){
        this.name = name;
    }
}
export {name, sayHello, Person}; // 변수, 함수, 클래스를 하나의 객체로 구성하여 export
```
```javascript
import { name, sayHello, Person } from './exportFile.js';

console.log(name); // Ann
sayHello(); // Hello World!
const person = new Person('inpa');


// ----------------------- OR ----------------------- //


// 개별로 export 된걸 * 로 한번에 묶고 as 로 별칭을 줘서, 
// 마치 전체 export default 된걸 import 한 것 처럼 사용 가능
import * as obj from './exportFile.js'; 

console.log(obj.name); // Ann
obj.sayHello(); // Hello World!
const person = new obj.Person('inpa');
```

<br />

# Node.js 에서 import 키워드 사용 방법

비록 정식적으로 노드의 CommonJS를 대체할수는 없지만, 자바스크립트 노드 프로젝트에서  import  키워드를 사용하도록 지정 설정을 할 수 있는 방법 또한 존재한다.

과거에는 import, export를 인식시키기 위해 따로 .mjs라는 확장자를 사용해 모듈 키워드를 구분하는 방법을 사용했었다.

예를들어  app.js  대신에  app.mjs  로 소스 파일을 만드는 식으로 말이다.

하지만 이제는 package.json을 통해서 간편하게 설정할 수 있어서 확장자를 바꾸지 않아도 import, export를 쓸 수 있게 되었다.
>참고로 노드 버전이 올라감에 따라 --experimental-modules 를 붙여서 실행하던 방식은 사라졌다.

<br />
방법은 간단하다. 그저 json 속성에 "type": "module" 을 추가해주면 된다.

```javascript
{
	"type": "module"
}
```
다음은 express 모듈을 import 키워드로 받아서 서버를 실행하는 샘플 코드이다.
```javascript
// const express = require('express');
import express from 'express';

const app = express();

app.get('/', (req, res) => {
   res.send('<h1>Hello World!</h1>');
});

app.listen(3000, () => {
   console.log('3000번 포트 서버 시작');
});
```
