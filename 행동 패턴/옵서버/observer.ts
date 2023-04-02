/**
 * Subject 인터페이스는 구독자를 관리하기 위한 일련의 메서드를 선언합니다.
 */
interface observerSubject {
  // Subject에 옵저버를 추가합니다.
  attach(observer: Observer): void;

  // Subject에서 옵저버를 제거합니다.
  detach(observer: Observer): void;

  // 모든 옵저버에게 이벤트를 알립니다.
  notify(): void;
}

/**
 * 구상 Subject는 중요한 상태를 가지고 있으며 상태가 변경될 때 옵저버에게 알립니다.
 */
class ConcreteSubject implements observerSubject {
  /**
   * @type {number} 단순화를 위해, 모든 구독자에게 필수적인 Subject의 상태는 이 변수에 저장됩니다.
   */
  public state: number;

  /**
   * @type {Observer[]} 구독자 목록. 실제 상황에서는 구독자 목록이 더 상세하게 저장될 수 있습니다 (이벤트 유형에 따라 구분 등).
   */
  private observers: Observer[] = [];

  // 구독할래요!
  /**
   * 구독 관리 메서드.
   */
  public attach(observer: Observer): void {
    const isExist = this.observers.includes(observer);
    if (isExist) {
      return console.log("Subject: Observer has been attached already.");
    }

    console.log("Subject: Attached an observer.");
    this.observers.push(observer);
  }

  // 구독 안할래요!
  public detach(observer: Observer): void {
    const observerIndex = this.observers.indexOf(observer);
    if (observerIndex === -1) {
      return console.log("Subject: Nonexistent observer.");
    }

    this.observers.splice(observerIndex, 1);
    console.log("Subject: Detached an observer.");
  }

  /**
   * 각 구독자에게 업데이트를 트리거합니다.
   */
  public notify(): void {
    console.log("Subject: Notifying observers...");
    for (const observer of this.observers) {
      observer.update(this);
    }
  }

  /**
   * 일반적으로 구독 로직은 Subject가 할 수 있는 일의 일부에 불과합니다.
   * Subject는 일반적으로 중요한 비즈니스 로직을 가지고 있으며, 중요한 일이 발생하기 전 또는 후에 알림 메서드를 트리거합니다.
   */
  public someBusinessLogic(): void {
    console.log("\nSubject: I'm doing something important.");
    this.state = Math.floor(Math.random() * (10 + 1));

    console.log(`Subject: My state has just changed to: ${this.state}`);
    this.notify();
  }
}

/**
 * Observer 인터페이스는 Subject에서 사용되는 update 메서드를 선언합니다.
 */
interface Observer {
  // Subject로부터 업데이트를 받습니다.
  update(subject: observerSubject): void;
}

/**
 * 구상 Observer들은 자신이 연결된 Subject의 업데이트에 대응합니다.
 */
class ConcreteObserverA implements Observer {
  public update(subject: observerSubject): void {
    if (subject instanceof ConcreteSubject && subject.state < 3) {
      console.log("ConcreteObserverA: Reacted to the event.");
    }
  }
}

class ConcreteObserverB implements Observer {
  public update(subject: observerSubject): void {
    if (
      subject instanceof ConcreteSubject &&
      (subject.state === 0 || subject.state >= 2)
    ) {
      console.log("ConcreteObserverB: Reacted to the event.");
    }
  }
}

/**
 * 클라이언트 코드.
 */
const observerSubject = new ConcreteSubject();

const observer1 = new ConcreteObserverA();
observerSubject.attach(observer1); // Subject: Attached an observer.

const observer2 = new ConcreteObserverB();
observerSubject.attach(observer2); // Subject: Attached an observer.

observerSubject.someBusinessLogic();
observerSubject.someBusinessLogic();

observerSubject.detach(observer2);

observerSubject.someBusinessLogic();
