/**
 * The Flyweight stores a common portion of the state (also called intrinsic
 * state) that belongs to multiple real business entities.
 * 플라이웨이트는 여러 실제 비즈니스 엔티티에 속하는 공통 상태 (내재(고유한) 상태라고도 함)를 저장합니다.
 * The Flyweight accepts the rest of the state (extrinsic state, unique for each entity)
 * via its method parameters.
 * 플라이웨이트는 메서드 매개변수를 통해 나머지 상태 (외부(공유한) 상태, 각 엔티티마다 고유한 상태)를 받습니다.
 */
 class Flyweight {
    private sharedState: any;

    constructor(sharedState: any) {
        this.sharedState = sharedState;
    }

    public operation(uniqueState: string[]): void {
        const s = JSON.stringify(this.sharedState);
        const u = JSON.stringify(uniqueState);
        console.log(`Flyweight: Displaying shared (${s}) and unique (${u}) state.`);
    }
}

/**
 * The Flyweight Factory creates and manages the Flyweight objects. It ensures
 * that flyweights are shared correctly. When the client requests a flyweight,
 * the factory either returns an existing instance or creates a new one, if it
 * doesn't exist yet.
 * 플라이웨이트 팩토리는 플라이웨이트 객체를 생성하고 관리합니다.
 * 플라이웨이트가 올바르게 공유되도록 보장합니다.
 * 클라이언트가 플라이웨이트를 요청하면, 팩토리는 이미 존재하는 인스턴스를 반환하거나 새 인스턴스를 생성하여 반환합니다.
 */
class FlyweightFactory {
    private flyweights: {[key: string]: Flyweight} = <any>{};

    constructor(initialFlyweights: string[][]) {
        for (const state of initialFlyweights) {
            this.flyweights[this.getKey(state)] = new Flyweight(state);
        }
    }

    /**
     * Returns a Flyweight's string hash for a given state.
     * 주어진 상태에 대한 플라이웨이트의 문자열 해시를 반환합니다.
     */
    private getKey(state: string[]): string {
        return state.join('_');
    }

    /**
     * Returns an existing Flyweight with a given state or creates a new one.
     * 주어진 상태를 갖는 기존의 플라이웨이트를 반환하거나 새로운 플라이웨이트를 생성하여 반환합니다.
     * 새로운 객체들 대신 캐싱 된 객체들을 반환하는 생성 메서드 => 플라이웨이트 식별 조건
     */
    public getFlyweight(sharedState: string[]): Flyweight {
        const key = this.getKey(sharedState);

        if (!(key in this.flyweights)) {
            console.log('FlyweightFactory: Can\'t find a flyweight, creating new one.');
            this.flyweights[key] = new Flyweight(sharedState);
        } else {
            console.log('FlyweightFactory: Reusing existing flyweight.');
        }

        return this.flyweights[key];
    }

    public listFlyweights(): void {
        const count = Object.keys(this.flyweights).length;
        console.log(`\nFlyweightFactory: I have ${count} flyweights:`);
        for (const key in this.flyweights) {
            console.log(key);
        }
    }
}

/**
 * The client code usually creates a bunch of pre-populated flyweights in the
 * initialization stage of the application.
 * 클라이언트 코드는 일반적으로 애플리케이션 초기화 단계에서 미리 채워진 플라이웨이트들을 생성합니다.
 */
const factory = new FlyweightFactory([
    ['Chevrolet', 'Camaro2018', 'pink'],
    ['Mercedes Benz', 'C300', 'black'],
    ['Mercedes Benz', 'C500', 'red'],
    ['BMW', 'M5', 'red'],
    ['BMW', 'X6', 'white'],
    // ...
]);
factory.listFlyweights();

// ...

function addCarToPoliceDatabase(
    ff: FlyweightFactory, plates: string, owner: string,
    brand: string, model: string, color: string,
) {
    console.log('\nClient: Adding a car to database.');
    const flyweight = ff.getFlyweight([brand, model, color]);

    // The client code either stores or calculates extrinsic state and passes it
    // to the flyweight's methods.
    // 클라이언트 코드는 외부(공유한) 상태를 저장하거나 계산하고, 이를 플라이웨이트의 메서드에 전달합니다.
    flyweight.operation([plates, owner]);
}

addCarToPoliceDatabase(factory, 'CL234IR', 'James Doe', 'BMW', 'M5', 'red');

addCarToPoliceDatabase(factory, 'CL234IR', 'James Doe', 'BMW', 'X1', 'red');

factory.listFlyweights();