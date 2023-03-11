/**
 * The Target defines the domain-specific interface used by the client code.
 * (JM) 타겟 클래스는 클라이언트 코드에 의해 사용되는 특정 도메인(기존 비즈니스 로직) 인터페이스를 정의합니다.
 */
class Target {
  public request(): string {
    return "Target: The default target's behavior.";
  }
}

/**
 * The Adaptee contains some useful behavior, but its interface is incompatible
 * with the existing client code. The Adaptee needs some adaptation before the
 * client code can use it.
 * (JM) 클래스 Adaptee는 클라이언트 코드가 사용하려면 적용이 필요합니다.
 * 일반적으로 타사 또는 레거시의 유용한 클래스(=서비스)
 */
class Adaptee {
  public specificRequest(): string {
    return ".eetpadA eht fo roivaheb laicepS"; // reversed
  }
}

/**
 * The Adapter makes the Adaptee's interface compatible with the Target's
 * interface.
 * (JM) 어댑터는 타겟과 Adaptee가 양립할 수 있게 만듭니다.
 */
class Adapter extends Target {
  private adaptee: Adaptee;

  constructor(adaptee: Adaptee) {
    super(); // (JM) 상속 메서드 참조
    this.adaptee = adaptee;
  }

  public request(): string {
    const result = this.adaptee.specificRequest().split("").reverse().join(""); // (JM) 다시 뒤집어 원래대로
    return `Adapter: (TRANSLATED) ${result}`;
  }
}

/**
 * The client code supports all classes that follow the Target interface.
 */
function adapterClientCode(target: Target) {
  // (JM) 특정 도메인(기존 비즈니스 로직)
  console.log(target.request());
}

console.log("Client: I can work just fine with the Target objects:");
const target = new Target();
adapterClientCode(target);

console.log("");

const adaptee = new Adaptee();
console.log(
  "Client: The Adaptee class has a weird interface. See, I don't understand it:"
);
console.log(`Adaptee: ${adaptee.specificRequest()}`); // (JM) 어댑터 사용 전까지 Adaptee는 호환 불가

console.log("");

console.log("Client: But I can work with it via the Adapter:");
const adapter = new Adapter(adaptee); // (JM) 어댑터를 사용해서 Adaptee 호환
adapterClientCode(adapter);
