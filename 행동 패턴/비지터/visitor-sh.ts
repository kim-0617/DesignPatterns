// 어디서 겹치는지는 모르겠지만 어딘가의 Component가 있어서 그거에 덮어씌워진것 같네요
// 그래서 이름변경했습니다.
/*
  interface a {
    name : string;
  }

  interface a {
    age : number
  }

  interface a {
    hobby : string
  }

  이렇게 확장해나가는 것 처럼요
*/

/**
 * Component 인터페이스는 기본 visitor 인터페이스를 인자로 받는 accept 메소드를 선언합니다.
 */
interface 행동패턴Component {
  accept(visitor: Visitor): void;
}

/**
 * 각 Concrete Component는 자신의 클래스에 해당하는 visitor의 메소드를 호출하는 방식으로 accept 메소드를 구현해야 합니다.
 */
class ConcreteComponentA implements 행동패턴Component {
  /**
   * 현재 클래스 이름과 일치하는 visitConcreteComponentA를 호출하는 것에 주목하세요.
   * 이렇게 하면 visitor가 작업하는 component의 클래스를 알려줄 수 있습니다.
   */
  public accept(visitor: Visitor): void {
    visitor.visitConcreteComponentA(this);
  }

  /**
   * Concrete Component에는 기본 클래스나 인터페이스에 없는 특수한 메소드가 있을 수 있습니다.
   * 하지만 Visitor는 component의 concrete 클래스를 알고 있으므로 이러한 메소드를 사용할 수 있습니다.
   */
  public exclusiveMethodOfConcreteComponentA(): string {
    return "A";
  }
}

class ConcreteComponentB implements 행동패턴Component {
  /**
   * 여기도 마찬가지로 visitConcreteComponentB => ConcreteComponentB 입니다.
   */
  public accept(visitor: Visitor): void {
    visitor.visitConcreteComponentB(this);
  }

  public specialMethodOfConcreteComponentB(): string {
    return "B";
  }
}

/**
 * Visitor 인터페이스는 component 클래스에 해당하는 visiting 메소드 세트를 선언합니다.
 * visiting 메소드의 시그니처를 통해 visitor는 다루고 있는 component의 정확한 클래스를 식별할 수 있습니다.
 */
interface Visitor {
  visitConcreteComponentA(element: ConcreteComponentA): void;

  visitConcreteComponentB(element: ConcreteComponentB): void;
}

/**
 * Concrete Visitor는 모든 concrete component 클래스와 함께 작동할 수 있는 여러 버전의 알고리즘을 구현합니다.
 * Visitor 패턴을 복합 트리와 같은 복잡한 객체 구조와 함께 사용할 때 가장 큰 이점을 누릴 수 있습니다.
 * 이 경우 visitor의 메소드를 다양한 구조체의 객체에 대해 실행하는 동안 알고리즘의 중간 상태를 저장하는 것이 유용할 수 있습니다.
 */
class ConcreteVisitor1 implements Visitor {
  public visitConcreteComponentA(element: ConcreteComponentA): void {
    console.log(
      `${element.exclusiveMethodOfConcreteComponentA()} + ConcreteVisitor1`
    );
  }

  public visitConcreteComponentB(element: ConcreteComponentB): void {
    console.log(
      `${element.specialMethodOfConcreteComponentB()} + ConcreteVisitor1`
    );
  }
}

class ConcreteVisitor2 implements Visitor {
  public visitConcreteComponentA(element: ConcreteComponentA): void {
    console.log(
      `${element.exclusiveMethodOfConcreteComponentA()} + ConcreteVisitor2`
    );
  }

  public visitConcreteComponentB(element: ConcreteComponentB): void {
    console.log(
      `${element.specialMethodOfConcreteComponentB()} + ConcreteVisitor2`
    );
  }
}

/**
 * 클라이언트 코드는 구체적인 클래스를 파악하지 않고도 어떤 요소 집합에 대해 visitor 작업을 실행할 수 있습니다.
 * accept 연산은 적절한 작업을 visitor 객체의 적절한 메소드로 전달합니다.
 */
function clientCode(components: 행동패턴Component[], visitor: Visitor) {
  for (const component of components) {
    component.accept(visitor);
  }
}

const components = [new ConcreteComponentA(), new ConcreteComponentB()];

console.log(
  "The client code works with all visitors via the base Visitor interface:"
);
const visitor1 = new ConcreteVisitor1();
clientCode(components, visitor1);
console.log("");

console.log(
  "It allows the same client code to work with different types of visitors:"
);
const visitor2 = new ConcreteVisitor2();
clientCode(components, visitor2);
