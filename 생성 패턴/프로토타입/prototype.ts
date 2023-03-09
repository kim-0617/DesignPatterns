// 클론 메서드를 정의하는 인터페이스
interface Cloneable {
  clone(): Person; // 보통은 clone메서드를 많이씁니다.
}

// Cloneable 인터페이스를 구현하는 실제 객체 (클론메서드 구현)
class Person implements Cloneable {
  // 사람 객체는 이름과 나이를 갖습니다. 즉 복제될 객체도 이름과 나이를 갖는 객체입니다.
  private name: string;
  private age: number;

  constructor(name: string, age: number) {
    this.name = name;
    this.age = age;
  }

  public getName(): string {
    return this.name;
  }

  public getAge(): number {
    return this.age;
  }

  // 클론 메서드 구현 : 단순히 사람 본인의 이름과 나이를 똑같이 갖는 즉, 동일한 속성값들을 갖는 객체 생성
  public clone(): Person {
    return new Person(this.name, this.age);
  }
}

const person1 = new Person("Alice", 30);
const person2 = person1.clone(); // 객체 복제

console.log(person1.getName()); // "Alice"
console.log(person1.getAge()); // 30
console.log(person2.getName()); // "Alice"
console.log(person2.getAge()); // 30
