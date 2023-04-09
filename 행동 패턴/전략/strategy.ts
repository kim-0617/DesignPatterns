/**
 * Context는 클라이언트에게 흥미로운 인터페이스를 정의합니다.
 */
class StrategyContext {
  /**
   * @type {Strategy} Context는 Strategy 객체 중 하나에 대한 참조를 유지합니다.
   * Context는 전략의 구상 클래스를 알지 못합니다.
   * 그러나 모든 전략은 Strategy 인터페이스를 통해 동작해야 합니다.
   */
  private strategy: Strategy;

  /**
   * 일반적으로 Context는 생성자를 통해 전략을 받아들입니다.
   * 그러나 런타임에 전략을 변경할 수 있는 setter도 제공합니다.
   */
  constructor(strategy: Strategy) {
    this.strategy = strategy;
  }

  /**
   * 보통 Context는 런타임에 전략 객체를 교체할 수 있도록 합니다.
   */
  public setStrategy(strategy: Strategy) {
    this.strategy = strategy;
  }

  /**
   * Context는 자체 알고리즘의 여러 버전을 구현하는 대신 일부 작업을 전략 객체에 위임합니다.
   */
  public doSomeBusinessLogic(): void {
    console.log(
      "Context: Sorting data using the strategy (not sure how it'll do it)"
    );
    const result = this.strategy.doAlgorithm(["a", "b", "c", "d", "e"]);
    console.log(result.join(","));
  }
}

/**
 * Strategy 인터페이스는 일부 알고리즘의 모든 지원 버전에 대한 공통 작업을 선언합니다.
 * Context는 이 인터페이스를 사용하여 구상 전략이 정의한 알고리즘을 호출합니다.
 */
interface Strategy {
  doAlgorithm(data: string[]): string[];
}

/**
 * 구상 전략은 기본 Strategy 인터페이스를 따르면서 알고리즘을 구현합니다.
 * 인터페이스를 따르므로서 Context에서 전략을 서로 교체할 수 있습니다.
 */
class ConcreteStrategyA implements Strategy {
  public doAlgorithm(data: string[]): string[] {
    return data.sort();
  }
}

class ConcreteStrategyB implements Strategy {
  public doAlgorithm(data: string[]): string[] {
    return data.reverse();
  }
}

/**
 * 클라이언트 코드는 구상 전략을 선택하고 Context에 전달합니다.
 * 클라이언트는 올바른 선택을 하기 위해 전략 간의 차이를 이해해야 합니다.
 */
const strategyContext = new StrategyContext(new ConcreteStrategyA());
console.log("Client: Strategy is set to normal sorting.");
strategyContext.doSomeBusinessLogic();

console.log("");

console.log("Client: Strategy is set to reverse sorting.");
strategyContext.setStrategy(new ConcreteStrategyB());
strategyContext.doSomeBusinessLogic();
