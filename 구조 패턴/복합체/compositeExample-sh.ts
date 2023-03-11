// 파일과 폴더 모두 다룰 수 있는 복합체 객체 선언
abstract class FileSystemObject {
  constructor(public name: string) {}

  // 아마도 이게 클라이언트가 요구하는 동작이겠죠?
  // 구루의 예를 들자면 모든 제품의 가격을 계산하는거요 그래서 복합체 객체는 concreate한 제품이 뭔지 상관없이
  // 이 getSize를 호출하여 요구한 답을 도출할 수 있을 것 입니다.
  abstract getSize(): number;
}

// File 하니까 중복된 선언이라고 해서 s 붙였습니다. 아마도 File 객체랑 겹쳐서 그런것 같습니다.
class Files extends FileSystemObject {
  constructor(name: string, private size: number) {
    super(name);
  }

  getSize(): number {
    return this.size;
  }
}

// 폴더나 파일을 자식으로 갖는 폴더시스템
class Folder extends FileSystemObject {
  private children: FileSystemObject[] = [];

  constructor(name: string) {
    super(name);
  }

  add(child: FileSystemObject): void {
    this.children.push(child);
  }

  getSize(): number {
    let totalSize = 0;
    for (const child of this.children) {
      totalSize += child.getSize();
    }
    return totalSize;
  }
}

// 루트폴더 생성
const rootFolder = new Folder("root");

// 폴더 1 생성
const folder1 = new Folder("folder1");
folder1.add(new Files("file1-1", 10)); // 크기가 10인 file1-1
folder1.add(new Files("file1-2", 20)); // 크기가 20인 file1-2
rootFolder.add(folder1); // root 폴더에 추가

// 마찬가지의 과정
const folder2 = new Folder("folder2");
folder2.add(new Files("file2-1", 30));
folder2.add(new Files("file2-2", 40));
folder2.add(new Files("file2-3", 50));
rootFolder.add(folder2);

//                         구조는
//                          root
//               folder1             folder2
//          file1-1 file1-2  file2-1 file2-2 file2-3

// 크기를 구하면 재귀적으로 root 폴더 부터 시작해서 쭉 타고들어가서 getsize를 착착 진행하겠죠?
console.log(rootFolder.getSize()); // 150
