/*
    퍼사드(Facade) 클래스는 하나 또는 여러 개의 하위 시스템의 복잡한 로직에 대한 간단한 인터페이스를 제공합니다. 
    퍼사드는 클라이언트 요청을 하위 시스템 내의 적절한 객체에 위임합니다. 
    또한, 퍼사드는 이들 객체의 라이프사이클을 관리하는 역할을 담당합니다. 
    이 모든 것은 클라이언트가 하위 시스템의 불필요한 복잡성으로부터 보호될 수 있도록 합니다.
*/
class Facade {
  protected subsystem1: Subsystem1;

  protected subsystem2: Subsystem2;

  /*
    애플리케이션의 요구 사항에 따라, 기존의 하위 시스템 객체를 퍼사드에 제공하거나, 
    퍼사드가 자체적으로 생성하도록 강제할 수 있습니다.
*/
  constructor(subsystem1?: Subsystem1, subsystem2?: Subsystem2) {
    this.subsystem1 = subsystem1 || new Subsystem1();
    this.subsystem2 = subsystem2 || new Subsystem2();
  }

  /*
    퍼사드의 메서드는 하위 시스템의 복잡한 기능을 간편한 단축키로 제공합니다. 
    그러나 클라이언트는 하위 시스템의 능력 중 일부에만 접근할 수 있습니다.
*/
  public operation(): string {
    let result = "Facade initializes subsystems:\n";
    result += this.subsystem1.operation1();
    result += this.subsystem2.operation1();
    result += "Facade orders subsystems to perform the action:\n";
    result += this.subsystem1.operationN();
    result += this.subsystem2.operationZ();

    return result;
  }
}

/*
    하위 시스템은 퍼사드나 클라이언트로부터 직접적으로 요청을 받을 수 있습니다. 
    어떤 경우에도 하위 시스템은 퍼사드를 또 다른 클라이언트로 간주하며, 
    퍼사드는 하위 시스템의 일부가 아닙니다.
*/
class Subsystem1 {
  public operation1(): string {
    return "Subsystem1: Ready!\n";
  }

  // ...

  public operationN(): string {
    return "Subsystem1: Go!\n";
  }
}

/*
 퍼사드는 한번에 여러 시스템과 동작 가능합니다.
*/
class Subsystem2 {
  public operation1(): string {
    return "Subsystem2: Get ready!\n";
  }

  // ...

  public operationZ(): string {
    return "Subsystem2: Fire!";
  }
}

/*
    클라이언트 코드는 퍼사드가 제공하는 간단한 인터페이스를 통해 복잡한 하위 시스템과 작업합니다. 
    퍼사드가 하위 시스템의 라이프사이클을 관리할 때, 클라이언트는 하위 시스템의 존재에 대해 심지어 모를 수도 있습니다. 
    이러한 접근 방식은 복잡성을 효과적으로 제어할 수 있게 해줍니다.
*/
function clientCode(facade: Facade) {
  // ...

  console.log(facade.operation());

  // ...
}

/*
    클라이언트 코드는 이미 하위 시스템의 일부 객체를 생성했을 수 있습니다. 
    이 경우, 퍼사드가 새로운 인스턴스를 생성하는 대신 이러한 객체로 퍼사드를 초기화하는 것이 바람직할 수 있습니다.
*/
const subsystem1 = new Subsystem1();
const subsystem2 = new Subsystem2();
const facade = new Facade(subsystem1, subsystem2);
clientCode(facade);
