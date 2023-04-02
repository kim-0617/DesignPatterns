/**
 * 오리지네이터(Originator)는 시간이 지남에 따라 변경될 수 있는 중요한 상태를 보유합니다.
 * 또한 상태를 메멘토 안에 저장하는 메소드와 메멘토에서 상태를 복원하는 다른 메소드를 정의합니다.
 */
class Originator {
  /**
   * 단순함을 위해, 오리지네이터의 상태는 단일 변수 내에 저장됩니다.
   */
  private state: string;

  constructor(state: string) {
    this.state = state;
    console.log(`Originator: My initial state is: ${state}`); // 1번
  }

  /**
   * 오리지네이터의 비즈니스 로직은 내부 상태에 영향을 줄 수 있습니다.
   * 따라서 클라이언트는 비즈니스 로직의 메소드를 실행하기 전에 save() 메소드를 사용하여 상태를 백업해야 합니다.
   */
  public doSomething(): void {
    console.log("Originator: I'm doing something important.");
    this.state = this.generateRandomString(30);
    console.log(`Originator: and my state has changed to: ${this.state}`);
  }

  private generateRandomString(length: number = 10): string {
    const charSet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

    return Array.from({ length }, () =>
      charSet.charAt(Math.floor(Math.random() * charSet.length))
    ).join("");
  }

  /**
   * 현재 상태를 메멘토 안에 저장합니다.
   */
  public save(): Memento {
    return new ConcreteMemento(this.state);
  }

  /**
   * 메멘토 객체로부터 오리지네이터의 상태를 복원합니다.
   */
  public restore(memento: Memento): void {
    this.state = memento.getState();
    console.log(`Originator: My state has changed to: ${this.state}`);
  }
}

/**
 * 메멘토(Memento) 인터페이스는 생성 날짜나 이름과 같은 메멘토의 메타데이터를 검색할 수 있는 방법을 제공합니다.
 * 그러나 오리지네이터의 상태를 노출하지 않습니다.
 */
interface Memento {
  getState(): string;

  getName(): string;

  getDate(): string;
}

/**
 * 구상 메멘토는 오리지네이터의 상태를 저장하는 인프라를 포함합니다.
 */
class ConcreteMemento implements Memento {
  private state: string;

  private date: string;

  constructor(state: string) {
    this.state = state;
    this.date = new Date().toISOString().slice(0, 19).replace("T", " ");
  }

  /**
   * 오리지네이터는 자신의 상태를 복원할 때 이 메소드를 사용합니다.
   */
  public getState(): string {
    return this.state;
  }

  /**
   * 나머지 메소드들은 케어테이커(Caretaker)가 메타데이터를 표시하는 데 사용됩니다.
   */
  public getName(): string {
    return `${this.date} / (${this.state.substr(0, 9)}...)`;
  }

  public getDate(): string {
    return this.date;
  }
}

/**
 * 케어테이커는 구상 메멘토 클래스에 의존하지 않습니다.
 * 따라서 메멘토 안에 저장된 오리지네이터의 상태에 접근할 수 없습니다.
 * 모든 메멘토는 기본 Memento 인터페이스를 통해 작동합니다.
 */
class Caretaker {
  private mementos: Memento[] = [];

  private originator: Originator;

  constructor(originator: Originator) {
    this.originator = originator;
  }

  public backup(): void {
    console.log("\nCaretaker: Saving Originator's state...");
    this.mementos.push(this.originator.save());
  }

  public undo(): void {
    if (!this.mementos.length) {
      return;
    }
    const memento = this.mementos.pop();

    if (memento) {
      console.log(`Caretaker: Restoring state to: ${memento.getName()}`);
      this.originator.restore(memento);
    }
  }

  public showHistory(): void {
    console.log("Caretaker: Here's the list of mementos:");
    for (const memento of this.mementos) {
      console.log(memento.getName());
    }
  }
}

/**
 * 클라이언트 코드.
 */
// 1. 이부분에서 Originator: My initial state is: Super-duper-super-puper-super.
const originator = new Originator("Super-duper-super-puper-super.");
const caretaker = new Caretaker(originator);

// 2. Caretaker: Saving Originator's state...
caretaker.backup();
// 3. 이부분에서 작업을 수행하고 갑자기 state를 바꿈
// Originator: I'm doing something important.
// Originator: and my state has changed to: tBkHzwsEMmxcvMpEwZmSbaFJWzaNAd
originator.doSomething();

// 4.
caretaker.backup();
// 5.
originator.doSomething();

// 6.
caretaker.backup();
// 7.
originator.doSomething();

console.log("");
// 3개 작업을 백업하고 목록을 보면 처음에 super-duper... 이것 포함 3개가 들어가있죠?
caretaker.showHistory();

console.log("\nClient: Now, let's rollback!\n");
// 되돌려봅시다.
// 메멘토 배열에서 가장 최근의 것 하나 삭제하고 콘솔에 찍습니다.
caretaker.undo();

console.log("\nClient: Once more!\n");
// 한번더!
caretaker.undo();
