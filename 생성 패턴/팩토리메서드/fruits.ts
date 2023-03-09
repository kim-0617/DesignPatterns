// 과일을 생성하는 팩토리메서드 패턴

interface Fruit {
  yummy(): string;
}

abstract class Tree {
  abstract createFruit(): Fruit;

  public eat(): string {
    const fruit = this.createFruit();

    return `I'm the fruit Creator. ${fruit.yummy()}`;
  }
}

class PeachTree extends Tree {
  createFruit(): Fruit {
    return new Peach();
  }
}

class AppleTree extends Tree {
  createFruit(): Fruit {
    return new Apple();
  }
}

class GrapeTree extends Tree {
  createFruit(): Fruit {
    return new Grape();
  }
}

class Peach implements Fruit {
  public yummy(): string {
    return `Peach is Yummy!`;
  }
}

class Apple implements Fruit {
  public yummy(): string {
    return `Apple is Yummy!`;
  }
}

class Grape implements Fruit {
  public yummy(): string {
    return `Grape is Yummy!`;
  }
}

function hungryPerson(tree: Tree) {
  console.log("I don't know how fruits are made, but I want to eat!");

  console.log(tree.eat());
}

console.log("Peach");
hungryPerson(new PeachTree());
console.log("==================================");

console.log("Apple");
hungryPerson(new AppleTree());
console.log("==================================");

console.log("Grape");
hungryPerson(new GrapeTree());
