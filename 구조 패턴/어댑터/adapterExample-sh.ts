// 새로운 사각형 클래스가 정의 되었는데 기존의 서비스와는 맞지 않는 속성들을 갖고 있네요?
// 그런데 요구사항은 레거시 사각형을 이 새로운 사각형으로 바꾸고 싶어요
class Rectangle {
  public width: number;
  public height: number;

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
  }
}

// 기존의 쓰던 레거시 스퀘어(사각형) 입니다. sideLength속성 하나만 갖고 있네요
class LegacySquare {
  public sideLength: number;

  constructor(sideLength: number) {
    this.sideLength = sideLength;
  }
}

// 그렇다면 새로운 사각형 서비스와 호환이 될 수 있도록 없는 속성들을 포함하고 있는 인터페이스를 정의해 줄게요!
interface IRectangle {
  width: number;
  height: number;
}

// 어댑터 클래스입니다.
// 새로운 사각형의 속성들을 상속받고있네요
class SquareAdapter implements IRectangle {
  private square: LegacySquare;

  // 기존 레거시 사각형을 받아서
  constructor(square: LegacySquare) {
    this.square = square;
  }

  // 새로운 사각형이 갖고있는 속성을 반환할 수 있어야 새로운 사각형으로 서비스를 전환할 수 있겠죠?
  get width(): number {
    return this.square.sideLength;
  }

  get height(): number {
    return this.square.sideLength;
  }
}

// 사용 예시
const legacySquare = new LegacySquare(5);
const shAdapter = new SquareAdapter(legacySquare); // 여기 넣는순간 sideLength = 5 가 width height 값으로 변환되겠죠?

console.log(shAdapter.width); // 5
console.log(shAdapter.height); // 5
