/**
 * The Command interface declares a method for executing a command.
 * Command 인터페이스는 명령을 실행하기 위한 메소드를 선언합니다.
 */
 interface Command {
    execute(): void;
}

/**
 * Some commands can implement simple operations on their own.
 * 일부 명령은 간단한 작업을 스스로 구현할 수 있습니다.
 */
class SimpleCommand implements Command {
    private payload: string;

    constructor(payload: string) {
        this.payload = payload;
    }

    public execute(): void {
        console.log(`SimpleCommand: See, I can do simple things like printing (${this.payload})`);
    }
}

/**
 * However, some commands can delegate more complex operations to other objects,
 * called "receivers."
 * 그러나 일부 명령은 "리시버(수신자)" 라고 불리는 다른 객체에게 복잡한 작업을 위임할 수 있습니다.
 */
class ComplexCommand implements Command {
    private receiver: Receiver;

    /**
     * Context data, required for launching the receiver's methods.
     * 리시버의 메소드를 실행하기 위해 필요한 컨텍스트 데이터입니다.
     */
    private a: string;

    private b: string;

    /**
     * Complex commands can accept one or several receiver objects along with
     * any context data via the constructor.
     * 복잡한 명령은 생성자를 통해 하나 이상의 리시버 객체와 함께
     * 모든 컨텍스트 데이터를 받아들일 수 있습니다.
     */
    constructor(receiver: Receiver, a: string, b: string) {
        this.receiver = receiver;
        this.a = a;
        this.b = b;
    }

    /**
     * Commands can delegate to any methods of a receiver.
     * 명령은 리시버의 모든 메소드에 위임할 수 있습니다.
     */
    public execute(): void {
        console.log('ComplexCommand: Complex stuff should be done by a receiver object.');
        this.receiver.doSomething(this.a);
        this.receiver.doSomethingElse(this.b);
    }
}

/**
 * The Receiver classes contain some important business logic. They know how to
 * perform all kinds of operations, associated with carrying out a request. In
 * fact, any class may serve as a Receiver.
 * 리시버 클래스에는 중요한 비즈니스 로직이 포함됩니다. 이들은 요청을 수행하는
 * 관련된 모든 작업을 수행할 수 있습니다. 사실상, 모든 클래스가 리시버로서
 * 역할을 수행할 수 있습니다.
 */
class Receiver {
    public doSomething(a: string): void {
        console.log(`Receiver: Working on (${a}.)`);
    }

    public doSomethingElse(b: string): void {
        console.log(`Receiver: Also working on (${b}.)`);
    }
}

/**
 * The Invoker is associated with one or several commands. It sends a request to
 * the command.
 * 인보커(발송자)는 하나 또는 여러 개의 명령과 관련됩니다. 인보커는 명령에게 요청을 보냅니다.
 */
class Invoker {
    private onStart: Command;

    private onFinish: Command;

    /**
     * Initialize commands.
     * 명령을 초기화합니다.
     */
    public setOnStart(command: Command): void {
        this.onStart = command;
    }

    public setOnFinish(command: Command): void {
        this.onFinish = command;
    }

    /**
     * The Invoker does not depend on concrete command or receiver classes. The
     * Invoker passes a request to a receiver indirectly, by executing a
     * command.
     * 인보커는 구체적인 명령 또는 리시버 클래스에 의존하지 않습니다. 인보커는 명령을 실행하여
     * 요청을 간접적으로 리시버에게 전달합니다.
     */
    public doSomethingImportant(): void {
        console.log('Invoker: Does anybody want something done before I begin?');
        if (this.isCommand(this.onStart)) {
            this.onStart.execute();
        }

        console.log('Invoker: ...doing something really important...');

        console.log('Invoker: Does anybody want something done after I finish?');
        if (this.isCommand(this.onFinish)) {
            this.onFinish.execute();
        }
    }

    /**
     * TypeScript에서 is는 Type Guard 문법입니다. is 키워드는 해당 함수가 주어진 인자가 특정 타입인지 여부를 확인하고, boolean 값을 반환합니다.
     * 예를 들어, private isCommand(object: Command): object is Command 함수는 object가 Command 타입인지 여부를 확인하고, boolean 값을 반환합니다.
     * 이 함수가 반환하는 boolean 값은, TypeScript 컴파일러가 object를 Command 타입으로 간주하도록 하는 역할을 합니다.
     * 이를 통해 object가 Command 타입임이 보장되므로, 이후에 Command 인터페이스에서 정의된 메서드를 안전하게 호출할 수 있습니다.
     */
    private isCommand(object: Command): object is Command {
        return object.execute !== undefined;
    }
}

/**
 * The client code can parameterize an invoker with any commands.
 * 클라이언트 코드는 인보커에 임의의 명령을 매개변수화할 수 있습니다.
 */
const invoker = new Invoker();
invoker.setOnStart(new SimpleCommand('Say Hi!'));
const receiver = new Receiver();
invoker.setOnFinish(new ComplexCommand(receiver, 'Send email', 'Save report'));

invoker.doSomethingImportant();