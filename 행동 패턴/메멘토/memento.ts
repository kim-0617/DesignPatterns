class Originator {
  private state: string;

  constructor(state: string) {
    this.state = state;
    console.log(`Originator: My initial state is: ${state}`); // 1번
  }

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

  public save(): Memento {
    return new ConcreteMemento(this.state);
  }

  public restore(memento: Memento): void {
    this.state = memento.getState();
    console.log(`Originator: My state has changed to: ${this.state}`);
  }
}

interface Memento {
  getState(): string;

  getName(): string;

  getDate(): string;
}

class ConcreteMemento implements Memento {
  private state: string;

  private date: string;

  constructor(state: string) {
    this.state = state;
    this.date = new Date().toISOString().slice(0, 19).replace("T", " ");
  }

  public getState(): string {
    return this.state;
  }

  public getName(): string {
    return `${this.date} / (${this.state.substr(0, 9)}...)`;
  }

  public getDate(): string {
    return this.date;
  }
}

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
