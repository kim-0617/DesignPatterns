// 대상 객체의 인터페이스
interface Subject {
  doSomething(): void;
}

// 대상 객체
class RealSubject implements Subject {
  // 시간이 많이 걸리는 작업!
  public doSomething(): void {
    console.log("RealSubject: doing something");
  }
}

// 프록시 객체
class Proxys implements Subject {
  // 프록시 객체
  private realSubject: RealSubject;

  public doSomething(): void {
    // realSubjectrk 없으면 만듭니다.
    // 왜? 이후에 doSomething이 호출 되더라도 미리 만들어둔 객체를 사용해서 효율성을 높이려고
    if (!this.realSubject) {
      this.realSubject = new RealSubject();
    }
    console.log("Proxy: doing something before the real subject");
    this.realSubject.doSomething();
    console.log("Proxy: doing something after the real subject");
  }
}

// 클라이언트 코드
const subject: Subject = new Proxys();
subject.doSomething();
