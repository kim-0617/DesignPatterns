/**
 * The Subject interface declares common operations for both RealSubject and the
 * Proxy. As long as the client works with RealSubject using this interface,
 * you'll be able to pass it a proxy instead of a real subject.
 * Subject 인터페이스는 RealSubject와 Proxy 모두에 대한 공통 작업을 선언합니다.
 * 클라이언트가 이 인터페이스를 사용하여 RealSubject와 작업하면, 실제 subject 대신에 proxy를 전달할 수 있습니다.
 */
interface SubjectEx {
    request(): void;
}

/**
 * The RealSubject contains some core business logic. Usually, RealSubjects are
 * capable of doing some useful work which may also be very slow or sensitive -
 * e.g. correcting input data. A Proxy can solve these issues without any
 * changes to the RealSubject's code.
 * RealSubject에는 핵심 비즈니스 로직이 포함되어 있습니다.
 * 일반적으로 RealSubject는 유용한 작업을 수행하지만 매우 느리거나 민감할 수도 있습니다.
 * 예를 들면, 입력 데이터를 교정하는 작업 등이 있습니다.
 * Proxy는 RealSubject의 코드를 변경하지 않고 이러한 문제를 해결할 수 있습니다.
 */
class RealSubjectEx implements SubjectEx {
    public request(): void {
        console.log('RealSubject: Handling request.');
    }
}

/**
 * The Proxy has an interface identical to the RealSubject.
 * Proxy는 RealSubject와 동일한 인터페이스를 갖습니다.
 */
class ProxyEx implements SubjectEx {
    private realSubject: RealSubjectEx;

    /**
     * The Proxy maintains a reference to an object of the RealSubject class. It
     * can be either lazy-loaded or passed to the Proxy by the client.
     * Proxy는 RealSubject 클래스의 객체에 대한 참조를 유지합니다.
     * 이 객체는 클라이언트에 의해 지연로드되거나 Proxy에 전달될 수 있습니다.
     */
    constructor(realSubject: RealSubjectEx) {
        this.realSubject = realSubject;
    }

    /**
     * The most common applications of the Proxy pattern are lazy loading,
     * caching, controlling the access, logging, etc. A Proxy can perform one of
     * these things and then, depending on the result, pass the execution to the
     * same method in a linked RealSubject object.
     * Proxy 패턴의 가장 일반적인 응용 분야는 느린 로딩, 캐싱, 액세스 제어, 로깅 등입니다.
     * Proxy는 이러한 작업 중 하나를 수행한 다음 결과에 따라 연결된 RealSubject 객체의 동일한 메서드에 실행을 전달할 수 있습니다.
     */
    public request(): void {
        if (this.checkAccess()) {
            this.realSubject.request();
            this.logAccess();
        }
    }

    private checkAccess(): boolean {
        // Some real checks should go here.
        // 일부 실제 검사는 여기에서 수행되어야 합니다.
        console.log('Proxy: Checking access prior to firing a real request.');

        return true;
    }

    private logAccess(): void {
        console.log('Proxy: Logging the time of request.');
    }
}

/**
 * The client code is supposed to work with all objects (both subjects and
 * proxies) via the Subject interface in order to support both real subjects and
 * proxies. In real life, however, clients mostly work with their real subjects
 * directly. In this case, to implement the pattern more easily, you can extend
 * your proxy from the real subject's class.
 * 클라이언트 코드는 실제 subject와 proxy 모두를 Subject 인터페이스를 통해 작업해야 합니다.
 * 그렇게 함으로써 실제 subject와 proxy 모두를 지원할 수 있습니다. 그러나 실제로는 대부분의 클라이언트가 실제 subject와 직접 작업합니다.
 * 이 경우, 패턴을 더 쉽게 구현하기 위해 proxy를 실제 subject의 클래스에서 확장할 수 있습니다.
 */
function clientCode(subject: SubjectEx) {
    // ...

    subject.request();

    // ...
}

console.log('Client: Executing the client code with a real subject:');
const realSubject = new RealSubjectEx();
clientCode(realSubject);

console.log('');

console.log('Client: Executing the same client code with a proxy:');
const proxy = new ProxyEx(realSubject);
clientCode(proxy);