## Terminology
> 유저 랜드(유저 스페이스)
- 사용자 공간 (User space and kernel space)
  - 전통적인 컴퓨터 운영 체제는 일반적으로 가상 메모리를 커널 공간과 사용자 공간으로 분리시킨다.
  - 커널 공간은 커널, 커널 확장 기능, 대부분의 장치 드라이버를 실행하기 위한 예비 공간이다
> 클로저(Javascript)
  - 학습할 때 기본 예제는 쉬운데... 평소에 잘 활용해 본 적이 없는 것 같아요...
  - 레퍼런스 남깁니다
    - [Node 개발자를 위한 클로저 설명](https://medium.com/nodejs-server/node-%EA%B0%9C%EB%B0%9C%EC%9E%90%EB%A5%BC-%EC%9C%84%ED%95%9C-%ED%81%B4%EB%A1%9C%EC%A0%80-%EC%84%A4%EB%AA%85-f750c8614548)
      - 이 아티클뿐만 아니라 실용적인 주제를 다룬 글이 많아 보이네요
    - [MDN](https://developer.mozilla.org/ko/docs/Web/JavaScript/Closures)

## Node.js 특징
1. 비동기적 구성을 많이 사용한다
   - 콜백
   - 프로미스
   - 리액터 패턴
2. 단일 스레드를 사용한다
   - 동시성 접근에 유리하다
      - 경쟁 상태, 다중스레드 동기화 문제가 발생하지 않아 간단하다.

## 리액터 패턴
- 챕터1에서 가장 중요한 개념이라고 생각했습니다.
- **디자인** 패턴으로 분류하진 않는 듯 보이지만 **패턴**입니다.
  - 클래스로 구현 가능하고, 구글링하면 Java 예시가 많습니다(...)
- 구글링하면 리액터 패턴과 묶어서 Proactor가 등장합니다.
  - Proactor: OS의 비동기 I/O를 호출하고 작업이 완료되면 콜백형식으로 받아서 적절한 이벤트를 호출하고 처리하는 구조
  - 책에서 소개하지 않은 것을 보면... Node.js에는 사용하지 않는가?
  - [SOF](https://stackoverflow.com/questions/56739934/is-nodejs-representing-reactor-or-proactor-design-pattern) 사용한다네요.
- 교재에서 `이벤트 디멀티플렉서`는 다른 레퍼런스에서 종종 `Dispatcher`라고 표현합니다
  - 레퍼런스
    - [교재의 그림 활용](https://riverandeye.tistory.com/entry/1-Reactor-Pattern)
    - [Reactor Pattern 과 I/O Multiplexing](https://sjh836.tistory.com/184)