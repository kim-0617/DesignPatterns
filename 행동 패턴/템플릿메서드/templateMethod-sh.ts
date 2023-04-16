/**
 * 추상 클래스는 (보통) 추상 원시 연산의 호출로 구성된 일부 알고리즘의 뼈대를 담은 템플릿 메서드를 정의합니다.
 * 구체적인 하위 클래스는 이러한 연산을 구현해야 하지만, 템플릿 메서드 자체는 그대로 둬야 합니다.
 */
abstract class AbstractClass {
  /**
   * 템플릿 메서드는 알고리즘의 뼈대를 정의합니다.
   */
  public templateMethod(): void {
    this.baseOperation1();
    this.requiredOperations1();
    this.baseOperation2();
    this.hook1();
    this.requiredOperation2();
    this.baseOperation3();
    this.hook2();
  }

  // bulk : 무더기 짐들
  /**
   * 이러한 연산은 이미 구현되어 있습니다.
   */
  protected baseOperation1(): void {
    console.log("AbstractClass says: I am doing the bulk of the work");
  }

  protected baseOperation2(): void {
    console.log(
      "AbstractClass says: But I let subclasses override some operations"
    );
  }

  protected baseOperation3(): void {
    console.log(
      "AbstractClass says: But I am doing the bulk of the work anyway"
    );
  }

  /**
   * 이러한 연산은 하위 클래스에서 구현해야 합니다.
   */
  protected abstract requiredOperations1(): void;

  protected abstract requiredOperation2(): void;

  /**
   * 이러한 것들은 "훅"입니다.
   * 하위 클래스에서 재정의할 수 있지만, 훅에는 기본(빈) 구현이 이미 있으므로 필수적이지는 않습니다.
   * 훅은 알고리즘의 중요한 위치에서 추가 확장 포인트를 제공합니다.
   */
  protected hook1(): void {}

  protected hook2(): void {}
}

/**
 * 구상 클래스는 기본 클래스의 모든 추상 연산을 구현해야 합니다.
 * 또한 몇 가지 연산은 기본 구현과 대체할 수 있습니다.
 */
class ConcreteClass1 extends AbstractClass {
  protected requiredOperations1(): void {
    console.log("ConcreteClass1 says: Implemented Operation1");
  }

  protected requiredOperation2(): void {
    console.log("ConcreteClass1 says: Implemented Operation2");
  }
}

/**
 * 일반적으로 구체 클래스는 기본 클래스의 일부 연산만 재정의합니다.
 */
class ConcreteClass2 extends AbstractClass {
  protected requiredOperations1(): void {
    console.log("ConcreteClass2 says: Implemented Operation1");
  }

  protected requiredOperation2(): void {
    console.log("ConcreteClass2 says: Implemented Operation2");
  }

  protected hook1(): void {
    console.log("ConcreteClass2 says: Overridden Hook1");
  }
}

/**
 * 클라이언트 코드는 알고리즘을 실행하기 위해 템플릿 메서드를 호출합니다.
 * 클라이언트 코드는 작업하는 객체의 구체적인 클래스를 알 필요가 없으며,
 * 객체들은 기본 클래스의 인터페이스를 통해 작업합니다.
 */
function clientCode(abstractClass: AbstractClass) {
  abstractClass.templateMethod();
}

console.log("Same client code can work with different subclasses:");
clientCode(new ConcreteClass1());
console.log("");

console.log("Same client code can work with different subclasses:");
clientCode(new ConcreteClass2());
