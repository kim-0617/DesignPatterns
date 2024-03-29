# 01

## 1-1 Node.js 철학

- 유저랜드 혹은 유저스페이스라 불리는 사용자 전용 모듈 생태계를 두는 것이 Node.js문화에 엄청난 영향을 끼쳤다.
    - 유저 랜드 모듈은 일반적으로 특정 사용자 또는 팀이 개발하고 유지 관리하는 모듈을 의미합니다. 이러한 모듈은 Node.js 패키지 매니저인 npm을 통해 다른 개발자들에게 쉽게 공유할 수 있습니다. 따라서 이러한 모듈을 사용하여 개발자들은 프로젝트를 더 빠르고 효율적으로 개발할 수 있으며, 코드를 재사용하고 개선할 수 있습니다.

- 코어를 최소한의 기능세트로 관리하는것이 무슨의미인가?
    - Node.js가 코어를 최소한의 기능세트로 관리하는 것은, Node.js 코어에서 지원하는 기능을 최소한으로 유지하면서 각기 다른 기능을 수행하는 모듈을 작성하고, 이러한 모듈들을 필요에 따라 조합하여 기능을 확장할 수 있도록 하는 것을 의미합니다.
    - 코어가 가볍기때문에 ⇒ 경량코어이기 때문에!

- 안정적이지만 느리게 진화하는 해결책을 갖는 대신 커뮤니티가 사용자 관점에서의 폭 넓은 해결책을 실험해볼 수 있다?
    - Node.js는 상대적으로 안정적인 환경을 제공하지만, 너무 느리게 진화할 수도 있습니다. Node.js는 다양한 사용자들이 만드는 모듈, 라이브러리 등을 쉽게 활용할 수 있는 패키지 매니저인 npm을 통해 사용자 커뮤니티에 의해 발전됩니다. 이러한 사용자 커뮤니티의 노력 덕분에 Node.js 환경에서 다양한 문제를 해결할 수 있는 폭넓은 해결책을 찾아볼 수 있습니다.

- 최소한의 모듈로 프로그램을 구성, 각 프로그램은 한가지 역할만 잘하자 → 단일책임?
    - Node.js는 모듈화와 단일 책임 원칙(Single Responsibility Principle) 등의 개념을 기반으로 하는 패러다임을 채택하고 있습니다. 이러한 접근 방식은 코드의 재사용성과 유지보수성을 높이고, 코드의 가독성과 확장성을 개선할 수 있습니다.
    
- package.json, package.lock.json을 통해 종속성 지옥을 벗어남
    - 의존성을 다 정의해 놓아서 각각의 패키지가 종속성 지옥에 빠지지 않는다.
    
- DRY ⇒ Don’t Repeat Yourself
    - 바퀴를 다시 발명하지 마라
    
- 결론 : 최소한의 기능을 가진 모듈화로인해서 코드가 덜 잘못되게한다. 이게 Node.js의 철학이다.
- 심지어 모듈들은 확장보다는 사용되기 위해서 만들어졌다.
- 객체지향의 문제점 : 현실세계의 불완성성을 고려하지않고 컴퓨터 시스템의 수학적인 용어들을 사용하여 실제세계들을 흉내내보려하는데 이것은 둘 사이의 괴리감이 있다.

## 1-2 Node.js는 어떻게 작동하는가?

- 블로킹 : 단일스레드의 경우 입출력이 발생하면 자원을 건들지 못하게 막아버린다.
- 그래서 스레드를 두어서 한 스레드가 블로킹 되더라도 다른 스레드에서 다른 작업들을 수행할 수 있도록 한다.
- 스레드는 비용이 저렴하진 않다
- 논블로킹 : 데이터의 반환을 기다리지 않는다
- 논블로킹의 전형적인 패턴은 실제 데이터가 반환될 대까지 루프내에서 리소스를 적극적으로 폴링하는 것이다.
- 이것을 바쁜 대기라고 한다.
- 폴링은 엄청난 CPU의 낭비를 초래
- 효율적으로 처리방법 : 동기 이벤트 디멀티플렉싱
- 이것은 여러 이벤트들을 관찰해서 리소스들의 읽기 또는 쓰기 연산이 완료되었을 때 새로운 이벤트를 반환
- 코드를 보면 이벤트들을 관찰하면서 블로킹하지 않으면서 리소스를 삭제하거나 이벤트를 처리한다. 근데 이벤트 디멀티플렉서가 처리하기 위한 새로운 이벤트가 있을 때 까지 블로킹된다는게 무슨말인가? ⇒ while문에서 블로킹 되고 있는것인가? 준비가 된 리소스가 있을 때 까지?
    - 준비된 이벤트가 없으면 있을때까지 블로킹
    - 있으면 while 문으로 들어가서 이벤트 처리
- 리액터 패턴?

## 1-3 Node.js에서의 Javascript

- 브라우저의 js와 노드의 js는 다소 다르다
- Dom, window, document가 없다.
- Node는 운영체제에서 제공하는 서비스에 접근이 가능하다
- Node 환경에서는 오직 CommonJS만 사용가능
    - 그런데 ES모듈 방식도 사용할 수 있나봅니다.