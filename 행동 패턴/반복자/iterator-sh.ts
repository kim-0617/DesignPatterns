interface Iterator<T> {
  next(): IteratorResult<T>;
  hasNext(): boolean;
}

class Collection<T> {
  private items: T[];

  constructor(items: T[] = []) {
    this.items = items;
  }

  addItem(item: T) {
    this.items.push(item);
  }

  getItem(index: number): T {
    return this.items[index];
  }

  getItems(): T[] {
    return this.items;
  }

  getLength(): number {
    return this.items.length;
  }

  createIterator(): Iterator<T> {
    return new CollectionIterator(this);
  }
}

class CollectionIterator<T> implements Iterator<T> {
  private collection: Collection<T>;
  private currentIndex = 0;

  constructor(collection: Collection<T>) {
    this.collection = collection;
  }

  next(): IteratorResult<T> {
    if (this.hasNext()) {
      return {
        value: this.collection.getItem(this.currentIndex++),
        done: false,
      };
    }
    return { value: null, done: true };
  }

  hasNext(): boolean {
    return this.currentIndex < this.collection.getLength();
  }
}

const collection = new Collection<number>([1, 2, 3, 4, 5]);
const iterator = collection.createIterator();

while (iterator.hasNext()) {
  console.log(iterator.next().value);
}
