// 중재자 인터페이스
/**
 * 중재자(Mediator) 인터페이스는 컴포넌트들이 다양한 이벤트에 대해 중재자에게 알리는 데 사용되는 메소드를 선언합니다.
 * 중재자는 이러한 이벤트에 반응하고 실행을 다른 컴포넌트로 전달할 수 있습니다.
*/
interface Mediator {
  notify(sender: object, event: string): void;
}

// 실질적인 중개자
/**
 * 구상 중재자는 여러 컴포넌트를 조율하여 협력적인 동작을 구현합니다.
*/
class ConcreteMediator implements Mediator {
  private component1: Component1;

  private component2: Component2;

  constructor(c1: Component1, c2: Component2) {
    this.component1 = c1;
    this.component1.setMediator(this);
    this.component2 = c2;
    this.component2.setMediator(this);
  }

  // 컴포넌트들이 나 이거 해요! 라고 공지하는 메서드, 이벤트 타입에 따라 다르게 동작한다.
  public notify(sender: object, event: string): void {
    if (event === "A") {
      console.log("Mediator reacts on A and triggers following operations:");
      this.component2.doC();
    }

    if (event === "D") {
      console.log("Mediator reacts on D and triggers following operations:");
      this.component1.doB();
      this.component2.doC();
    }
  }
}

// 기본 컴포넌트 틀
/**
 * 베이스 컴포넌트는 중재자 인스턴스를 컴포넌트 객체 내에 저장하는 기본 기능을 제공합니다.
*/
class BaseComponent {
  protected mediator: Mediator;

  constructor(mediator?: Mediator) {
    this.mediator = mediator!;
  }

  public setMediator(mediator: Mediator): void {
    this.mediator = mediator;
  }
}

// 특정 컴포넌트 => 버튼이면 버튼, 체크박스면 체크박스
/**
 * 구상 컴포넌트는 다양한 기능을 구현합니다.
 * 다른 컴포넌트에 의존하지 않습니다.
 * 또한 구상 중재자 클래스에도 의존하지 않습니다.
*/
class Component1 extends BaseComponent {
  public doA(): void {
    console.log("Component 1 does A.");
    this.mediator.notify(this, "A");
  }

  public doB(): void {
    console.log("Component 1 does B.");
    this.mediator.notify(this, "B");
  }
}

class Component2 extends BaseComponent {
  public doC(): void {
    console.log("Component 2 does C.");
    this.mediator.notify(this, "C");
  }

  public doD(): void {
    console.log("Component 2 does D.");
    this.mediator.notify(this, "D");
  }
}

/**
 * 클라이언트 코드.
*/
const c1 = new Component1(); // 예를들어 버튼
const c2 = new Component2(); // 예를들어 체크박스
const mediator = new ConcreteMediator(c1, c2); // 중재자에게 등록

console.log("Client triggers operation A."); // 버튼이 동작합니다. => 클라이언트께서 버튼을 누르셨답니다.
c1.doA(); // A 동작합니다.

console.log("");
console.log("Client triggers operation D."); // 클라이언트께서 체크박스 체크 하셨답니다.
c2.doD(); // D 동작합니다.
