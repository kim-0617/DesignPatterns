class Singleton {
  private static instance: Singleton;

  private constructor() {} // 생성자는 항상 private

  public static getInstance(): Singleton {
    // 싱글턴 객체 생성 메서드
    if (!Singleton.instance) {
      Singleton.instance = new Singleton();
    }

    return Singleton.instance;
  }

  // 비즈니스 로직
  public someBusinessLogic() {
    // ...
  }
}

function clientCode() {
  const s1 = Singleton.getInstance();
  const s2 = Singleton.getInstance();

  // 싱글턴 패턴을 따르는 클래스의 getInstance 메서드를 통해 생성된 객체는 항상 동일한 객체를 공유하게 된다.
  if (s1 === s2) {
    console.log("Singleton works, both variables contain the same instance.");
  } else {
    console.log("Singleton failed, variables contain different instances.");
  }
}

clientCode();
