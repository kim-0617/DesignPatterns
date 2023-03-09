// 최종적으로 반환될 제품
class Product {
  private name: string; // 제품의 이름
  private price: number; // 제품 가격
  private description: string; // 제품 사용 설명서

  // 생성자
  constructor(name: string, price: number, description: string) {
    this.name = name;
    this.price = price;
    this.description = description;
  }

  // getter 메서드들
  public getName(): string {
    return this.name;
  }

  public getPrice(): number {
    return this.price;
  }

  public getDescription(): string {
    return this.description;
  }
}

// 제품 빌더
// 다양한 조건과 순서에 맞게, 입맞게 맞게 제품을 빌드할 수 있다.
class ProductBuilder {
  private name: string;
  private price: number;
  private description: string;

  // 이름 초기화 : 제품의 이름은 있어야겠죠?
  constructor(name: string) {
    this.name = name;
  }

  // 모든 메서드들은 값을 할당 후 본인을 return 합니다. 그래야 메서드 체이닝 형식으로 제품을 빌드할 수 있기 때문입니다.

  // 제품의 가격정의
  public setPrice(price: number): ProductBuilder {
    this.price = price;
    return this;
  }

  // 제품 사용설명서
  public setDescription(description: string): ProductBuilder {
    this.description = description;
    return this;
  }

  // 모든 과정이 끝났다면 최종적으로 build 메서드를 호출에서 제품객체 생성!
  public build(): Product {
    return new Product(this.name, this.price, this.description);
  }
}

const product = new ProductBuilder("아이폰") // this.name = "아이폰"
  .setPrice(1500000) // this.price = 1500000
  .setDescription("Apple 사의 스마트폰입니다.") // this.description = "Apple 사의 스마트폰입니다."
  .build(); // 라는 제품을 만들었습니다!

console.log(product.getName()); // "아이폰"
console.log(product.getPrice()); // 1500000
console.log(product.getDescription()); // "Apple 사의 스마트폰입니다."
