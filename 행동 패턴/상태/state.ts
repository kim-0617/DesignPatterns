/**
 * Context는 클라이언트에게 필요한 인터페이스를 정의합니다.
 * 또한 현재 Context의 상태를 나타내는 State 하위 클래스의 인스턴스에 대한 참조를 유지합니다.
 */
class Context {
  /**
   * @type {State} A reference to the current state of the Context.
   * @type {State} Context의 현재 상태를 나타내는 참조입니다.
   * (SH) @type 은 바로 밑의변수 state가 State 타입이란 걸 알려줍니다.
   */
  private state: State;

  constructor(state: State) {
    this.transitionTo(state);
  }

  /**
   * Context는 런타임에 State 객체를 변경할 수 있습니다.
   */
  public transitionTo(state: State): void {
    console.log(`Context: Transition to ${(<any>state).constructor.name}.`);
    this.state = state;
    this.state.setContext(this);
  }

  /**
   * Context는 일부 동작을 현재 State 객체에 위임합니다.
   */
  public request1(): void {
    this.state.handle1();
  }

  public request2(): void {
    this.state.handle2();
  }
}

/**
 * 기본 State 클래스는 모든 구체적인 State에서 구현해야 할 메서드를 선언하고,
 * 해당 State와 연관된 Context 객체에 대한 역참조를 제공합니다.
 * 이 역참조는 State가 Context를 다른 State로 전이하기 위해 사용될 수 있습니다.
 */
abstract class State {
  protected context: Context;

  public setContext(context: Context) {
    this.context = context;
  }

  public abstract handle1(): void;

  public abstract handle2(): void;
}

/**
 * 구상 State는 Context의 상태와 관련된 다양한 동작을 구현합니다.
 */
class ConcreteStateA extends State {
  public handle1(): void {
    console.log("ConcreteStateA handles request1.");
    console.log("ConcreteStateA wants to change the state of the context.");
    this.context.transitionTo(new ConcreteStateB());
  }

  public handle2(): void {
    console.log("ConcreteStateA handles rㅊequest2.");
  }
}

class ConcreteStateB extends State {
  public handle1(): void {
    console.log("ConcreteStateB handles request1.");
  }

  public handle2(): void {
    console.log("ConcreteStateB handles request2.");
    console.log("ConcreteStateB wants to change the state of the context.");
    this.context.transitionTo(new ConcreteStateA());
  }
}

/**
 * 클라이언트 코드입니다.
 */
const context = new Context(new ConcreteStateA());
context.request1();
context.request2();
