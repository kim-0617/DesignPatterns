interface ChickenFactory {
  create후라이드(): 후라이드;
  create양념(): 양념;
}

class BBQ implements ChickenFactory {
  public create후라이드(): 후라이드 {
    return new BBQ후라이드();
  }

  public create양념(): 양념 {
    return new BBQ양념();
  }
}

class BHC implements ChickenFactory {
  public create후라이드(): 후라이드 {
    return new BHC후라이드();
  }

  public create양념(): 양념 {
    return new BHC양념();
  }
}

interface 후라이드 {
  crunch(): string;
}

class BHC후라이드 implements 후라이드 {
  public crunch(): string {
    return `BHC는 뿌링클이 맜있는데?`;
  }
}

class BBQ후라이드 implements 후라이드 {
  public crunch(): string {
    return `진리의 BBQ 황금올리브`;
  }
}

interface 양념 {
  spicy(): string;
}

class BHC양념 implements 양념 {
  public spicy(): string {
    return `BHC에 양념치킨 파나요?`;
  }
}

class BBQ양념 implements 양념 {
  public spicy(): string {
    return `황금올리브 양념도 맛있죠`;
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
