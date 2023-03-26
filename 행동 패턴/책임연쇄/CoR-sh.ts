/**
 * Handler 인터페이스는 핸들러 체인을 구축하는 방법을 선언합니다.
 * 또한 요청을 실행하는 메소드를 선언합니다.
 */
interface Handler {
  setNext(handler: Handler): Handler;

  handle(request: string): string | null;
}

/**
 * 기본 체이닝 동작은 베이스 핸들러 클래스 내부에서 구현될 수 있습니다.
 */
abstract class AbstractHandler implements Handler {
  private nextHandler: Handler;

  public setNext(handler: Handler): Handler {
    this.nextHandler = handler;
    // 여기서 핸들러를 반환하면 다음과 같이 핸들러를 연결하는 것이 편리해집니다:
    // monkey.setNext(squirrel).setNext(dog);
    return handler;
  }

  public handle(request: string): string | null {
    if (this.nextHandler) {
      return this.nextHandler.handle(request);
    }

    // return `this is null`;
    return null;
  }
}

/**
 * 모든 구상 핸들러는 요청을 처리하거나 체인의 다음 핸들러에게 전달합니다.
 */
class MonkeyHandler extends AbstractHandler {
  public handle(request: string): string | null {
    if (request === "Banana") {
      return `Monkey: I'll eat the ${request}.`;
    }
    return super.handle(request);
  }
}

class SquirrelHandler extends AbstractHandler {
  public handle(request: string): string | null {
    if (request === "Nut") {
      return `Squirrel: I'll eat the ${request}.`;
    }
    return super.handle(request);
  }
}

class DogHandler extends AbstractHandler {
  public handle(request: string): string | null {
    if (request === "MeatBall") {
      return `Dog: I'll eat the ${request}.`;
    }
    return super.handle(request);
  }
}

/**
 * 클라이언트 코드는 일반적으로 하나의 핸들러와 함께 작동하는 것이 적합합니다.
 * 대개 클라이언트 코드는 핸들러가 체인의 일부인지도 모릅니다.
 */
function clientCode(handler: Handler) {
  const foods = ["Nut", "Banana", "Cup of coffee"];

  for (const food of foods) {
    console.log(`Client: Who wants a ${food}?`);

    const result = handler.handle(food);
    if (result) {
      // `this is null`은 truthy 값이기 때문에, else block으로 갈 수 없음
      // `  ${food} was left untouched.`대신 `this is null`이 출력
      console.log(`  ${result}`);
    } else {
      console.log(`  ${food} was left untouched.`);
    }
  }
}

/**
 * 클라이언트 코드의 다른 부분은 실제 체인을 구성합니다.
 */
const monkey = new MonkeyHandler();
const squirrel = new SquirrelHandler();
const dog = new DogHandler();

monkey.setNext(squirrel).setNext(dog);

/**
 * 클라이언트는 체인의 첫 번째 핸들러뿐만 아니라 다른 핸들러에게도 요청을 보낼 수 있어야 합니다.
 */
console.log("Chain: Monkey > Squirrel > Dog\n");
clientCode(monkey);
console.log("");

console.log("Subchain: Squirrel > Dog\n");
clientCode(squirrel);
