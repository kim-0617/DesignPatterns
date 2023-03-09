// 추상 팩토리(AbstractFactory)
interface ChickenFactory {
  create후라이드(): 후라이드;
  create양념(): 양념;
  create후라이드양념반반(): 후라이드양념반반;
}

// 구상 팩토리1(ConcreteFactory1 === BBQ)
class BBQ implements ChickenFactory {
  public create후라이드(): 후라이드 {
    return new BBQ후라이드();
  }

  public create양념(): 양념 {
    return new BBQ양념();
  }

  public create후라이드양념반반(): 후라이드양념반반 {
    return new BBQ후라이드양념반반();
  }
}

// 구상 팩토리2(ConcreteFactory2 === BHC)
class BHC implements ChickenFactory {
  public create후라이드(): 후라이드 {
    return new BHC후라이드();
  }

  public create양념(): 양념 {
    return new BHC양념();
  }

  public create후라이드양념반반(): 후라이드양념반반 {
    return new BHC후라이드양념반반();
  }
}

// 추상 제품A(AbstractProductA === 후라이드)
interface 후라이드 {
  crunch(): string;
}

// 구상 제품A1(ConcreteProductA1 === BHC후라이드)
class BHC후라이드 implements 후라이드 {
  public crunch(): string {
    return `BHC는 뿌링클이 맜있는데?`;
  }
}

// 구상 제품A2(ConcreteProductA2 === BBQ후라이드)
class BBQ후라이드 implements 후라이드 {
  public crunch(): string {
    return `진리의 BBQ 황금올리브`;
  }
}

// 추상 제품B(AbstractProductB === 양념)
interface 양념 {
  spicy(): string;
}

// 구상 제품B1(ConcreteProductB1 === BHC양념)
class BHC양념 implements 양념 {
  public spicy(): string {
    return `BHC에 양념치킨 파나요?`;
  }
}

// 구상 제품B2(ConcreteProductB2 === BBQ양념)
class BBQ양념 implements 양념 {
  public spicy(): string {
    return `황금올리브 양념도 맛있죠`;
  }
}

// 추상 제품C(AbstractProductC === 후라이드양념반반)
interface 후라이드양념반반 {
  spicy(): string;
  halfCrunch(collaborator: 후라이드): string;
}

// 구상 제품C2(ConcreteProductC2 === BHC후라이드양념반반)
class BHC후라이드양념반반 implements 후라이드양념반반 {
  public spicy(): string {
    return `황금올리브 양념도 맛있죠`;
  }

  public halfCrunch(collaborator: 후라이드): string {
    const result = collaborator.crunch();
    return `황올 후라이드 양념 반반으로 할래요`;
  }
}

// 구상 제품C2(ConcreteProductC2 === BBQ후라이드양념반반)
class BBQ후라이드양념반반 implements 후라이드양념반반 {
  public spicy(): string {
    return `황금올리브 양념도 맛있죠`;
  }

  public halfCrunch(collaborator: 후라이드): string {
    const result = collaborator.crunch();
    return `황올 후라이드 양념 반반으로 할래요`;
  }
}

function 배달(치킨집: ChickenFactory) {
  const 후라이드 = 치킨집.create후라이드();
  const 양념 = 치킨집.create양념();

  console.log(후라이드.crunch());
  console.log(양념.spicy());
}

console.log("오늘은 어떤 집에 시켜볼까?");
배달(new BBQ());
console.log("==================== BBQ =====================");

배달(new BHC());
console.log("==================== BHC =====================");

// (JM) add function and execute
function 오늘의치킨메뉴는양념반반(치킨집: ChickenFactory) {
  const 후라이드 = 치킨집.create후라이드();
  const 후라이드양념반반 = 치킨집.create후라이드양념반반();

  console.log(후라이드양념반반.spicy());
  console.log(후라이드양념반반.halfCrunch(후라이드));
}

console.log("오늘은 어떤 집에서 양념반반을 시켜볼까?");
오늘의치킨메뉴는양념반반(new BBQ());
console.log("==================== BBQ 양념반반 =====================");