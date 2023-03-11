// 데이터베이스 연결 기능을 추상화한 인터페이스
interface DatabaseConnector {
  connect(): void;
}

// MySQL 데이터베이스와 연결하는 클래스
class MySQLConnector implements DatabaseConnector {
  connect(): void {
    console.log("MySQL에 연결합니다.");
  }
}

// MongoDB 데이터베이스와 연결하는 클래스
class MongoDBConnector implements DatabaseConnector {
  connect(): void {
    console.log("MongoDB에 연결합니다.");
  }
}

// 데이터베이스 연결 기능을 추상화한 추상 클래스
abstract class DatabaseConnection {
  protected connector: DatabaseConnector;

  constructor(connector: DatabaseConnector) {
    this.connector = connector;
  }

  abstract connect(): void;
}

// MySQL 데이터베이스와 연결하는 클래스를 상속받는 클래스
class MySQLConnection extends DatabaseConnection {
  constructor(connector: MySQLConnector) {
    super(connector);
  }

  connect(): void {
    this.connector.connect();
    console.log("MySQL에 연결되었습니다.");
  }
}

// MongoDB 데이터베이스와 연결하는 클래스를 상속받는 클래스
class MongoDBConnection extends DatabaseConnection {
  constructor(connector: MongoDBConnector) {
    super(connector);
  }

  connect(): void {
    this.connector.connect();
    console.log("MongoDB에 연결되었습니다.");
  }
}

const myConnector = new MySQLConnector();
const myConnection = new MySQLConnection(myConnector);
myConnection.connect();

const moConnector = new MongoDBConnector();
const moConnection = new MongoDBConnection(moConnector);
moConnection.connect();
