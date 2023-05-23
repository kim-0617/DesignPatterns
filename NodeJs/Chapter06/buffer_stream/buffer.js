/* 
Buffer & Stream

일정한 크기로 모아두는 데이터
- 일정한 크기가 되면 한 번에 처리
- 버퍼링 : 버퍼에 데이터가 찰 때까지 모으는 작업

스트림 : 데이터의 흐름
- 일정한 크기로 나눠서 여러 번에 걸쳐서 처리
- 버퍼(또는 청크)의 크기를 작게 만들어서 주기적으로 데이터를 전달
- 스트리밍 : 일정한 크기의 데이터를 지속적으로 전달하는 작업

*/

/* Buffer 사용하기 */
const buffer = Buffer.from("버퍼로 변환하기");
console.log(buffer); // <Buffer eb b2 84 ed 8d bc eb a1 9c 20 eb b3 80 ed 99 98 ed 95 98 ea b8 b0>
console.log(buffer.length); // 22 byte
console.log(buffer.toString());

const array = [
  Buffer.from("chunk1"),
  Buffer.from("chunk2"),
  Buffer.from("chunk3"),
];
console.log(Buffer.concat(array).toString());

console.log(Buffer.alloc(5));
