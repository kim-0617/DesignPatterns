// FlyWeight 객체
class TextEditor {
  private characters: { [key: string]: Character } = {}; // Flyweight 객체를 저장하는 객체

  // FlyWeight 객체의 메서드는 고유 속성을 인자로 받습니다.
  addCharacter(char: string, posX: number, posY: number) {
    // Flyweight 객체 생성 or 이미 생성된 Flyweight 객체 반환
    if (!this.characters[char]) {
      this.characters[char] = new Character(char);
    }

    // Flyweight 객체 상태 변경
    this.characters[char].setPos(posX, posY);
  }

  public listFlyweights(): void {
    const count = Object.keys(this.characters).length;
    console.log(`\nFlyweightFactory: I have ${count} flyweights:`);
    for (const key in this.characters) {
        console.log(key);
    }
}
}

// 객체만의 고유 속성
class Character {
  private char: string;
  private posX: number = 0;
  private posY: number = 0;

  constructor(char: string) {
    this.char = char;
  }

  setPos(posX: number, posY: number) {
    this.posX = posX;
    this.posY = posY;
    console.log(
      `Character "${this.char}" is now at position (${this.posX}, ${this.posY})`
    );
  }
}

// 클라이언트 코드 (FlyWeight 객체 생성)
const editor = new TextEditor();

// 같은 문자열을 공유하여 사용
editor.addCharacter("a", 0, 0);
editor.addCharacter("b", 10, 0);
editor.addCharacter("a", 20, 0);
editor.addCharacter("c", 30, 0);
editor.addCharacter("b", 40, 0);

// (JM) 케이스 추가 후 리스트 확인
console.log('---')
editor.addCharacter("b", 10, 1);
editor.addCharacter("d", 20, 2);
editor.addCharacter("c", 30, 3);
editor.addCharacter("e", 40, 4);
editor.addCharacter("c", 10, 0);
editor.addCharacter("d", 20, 0);
editor.addCharacter("c", 30, 0);
editor.addCharacter("e", 40, 0);
editor.listFlyweights();