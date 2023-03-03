class Singleton {
  // 실제로 싱글턴에 접근하는 객체들이 이용할 멤버변수, 이걸로 비즈니스 로직 실행
  private static instance: Singleton;

  // 외부에서 인스턴스 생성 금지
  private constructor() {}

  public static getInstance(): Singleton {
    // 없으면 싱글턴 클래스의 유일한 인스턴스를 생성한다.
    if (!Singleton.instance) {
      Singleton.instance = new Singleton();
    }
    return Singleton.instance; // 있으면 있는거 return
  }

  // 실제 수행할 비즈니스 로직
  public doSomething(): void {
    console.log("Singleton instance is doing something.");
  }
}

// 2개를 생성하던 100개를 생성하던 싱글턴으로 만들어진 인스턴스는 모두 동일한 인스턴스이다.
const instance1 = Singleton.getInstance();
const instance2 = Singleton.getInstance();

console.log(instance1 === instance2); // true
instance1.doSomething(); // "Singleton instance is doing something."
instance2.doSomething(); // "Singleton instance is doing something."
