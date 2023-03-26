/**
 * Iterator Design Pattern
 *
 * Intent: Lets you traverse elements of a collection without exposing its
 * underlying representation (list, stack, tree, etc.).
 * 의도: 컬렉션(list, stack, tree 등)의 내부 구조를 노출하지 않고, 컬렉션의 요소를 순회할 수 있는 방법을 제공합니다.
 */

interface IteratorEx<T> {
    // Return the current element.
    // 현재 요소를 반환합니다.
    current(): T;

    // Return the current element and move forward to next element.
    // 현재 요소를 반환하고, 다음 요소로 이동합니다.
    next(): T;

    // Return the key of the current element.
    // 현재 요소의 키를 반환합니다.
    key(): number;

    // Checks if current position is valid.
    // 현재 위치가 유효한지 확인합니다.
    valid(): boolean;

    // Rewind the Iterator to the first element.
    // 이터레이터를 첫 번째 요소로 되감습니다.
    rewind(): void;
}

interface Aggregator {
    // Retrieve an external iterator.
    // 외부 이터레이터를 가져옵니다.
    getIterator(): IteratorEx<string>;
}

/**
 * Concrete Iterators implement various traversal algorithms. These classes
 * store the current traversal position at all times.
 * Concrete Iterators는 다양한 순회 알고리즘을 구현합니다.
 * 이 클래스들은 항상 현재 순회 위치를 저장합니다.
 */

class AlphabeticalOrderIterator implements IteratorEx<string> {
    private collection: WordsCollection;

    /**
     * Stores the current traversal position. An iterator may have a lot of
     * other fields for storing iteration state, especially when it is supposed
     * to work with a particular kind of collection.
     * 현재 순회 위치를 저장합니다.
     * 이터레이터는 특정 종류의 컬렉션과 함께 사용되도록 설정된 경우,
     * 순회 상태를 저장하기 위해 다른 필드를 가지고 있을 수 있습니다.
     */
    private position: number = 0;

    /**
     * This variable indicates the traversal direction.
     * 이 변수는 순회 방향을 나타냅니다.
     */
    private reverse: boolean = false;

    constructor(collection: WordsCollection, reverse: boolean = false) {
        this.collection = collection;
        this.reverse = reverse;

        if (reverse) {
            this.position = collection.getCount() - 1;
        }
    }

    public rewind() {
        this.position = this.reverse ?
            this.collection.getCount() - 1 :
            0;
    }

    public current(): string {
        return this.collection.getItems()[this.position];
    }

    public key(): number {
        return this.position;
    }

    public next(): string {
        const item = this.collection.getItems()[this.position];
        this.position += this.reverse ? -1 : 1;
        return item;
    }

    public valid(): boolean {
        if (this.reverse) {
            return this.position >= 0;
        }

        return this.position < this.collection.getCount();
    }
}

/**
 * Concrete Collections provide one or several methods for retrieving fresh
 * iterator instances, compatible with the collection class.
 * Concrete Collections는 컬렉션 클래스와 호환되는 새로운 이터레이터 인스턴스를 하나 이상 제공합니다.
 */
class WordsCollection implements Aggregator {
    private items: string[] = [];

    public getItems(): string[] {
        return this.items;
    }

    public getCount(): number {
        return this.items.length;
    }

    public addItem(item: string): void {
        this.items.push(item);
    }

    public getIterator(): IteratorEx<string> {
        return new AlphabeticalOrderIterator(this);
    }

    public getReverseIterator(): IteratorEx<string> {
        return new AlphabeticalOrderIterator(this, true);
    }
}

/**
 * The client code may or may not know about the Concrete Iterator or Collection
 * classes, depending on the level of indirection you want to keep in your
 * program.
 * 클라이언트 코드는 Concrete Iterator 또는 Collection 클래스에 대해 알고 있을 수도 있고,
 * 프로그램에서 유지할 수준에 따라 간접적으로 알고 있을 수도 있습니다.
 */
const collectionIterEx = new WordsCollection();
collectionIterEx.addItem('First');
collectionIterEx.addItem('Second');
collectionIterEx.addItem('Third');

const iteratorIterEx = collectionIterEx.getIterator();

console.log('Straight traversal:');
while (iteratorIterEx.valid()) {
    console.log(iteratorIterEx.next());
}

console.log('');
console.log('Reverse traversal:');
const reverseIterator = collectionIterEx.getReverseIterator();
while (reverseIterator.valid()) {
    console.log(reverseIterator.next());
}