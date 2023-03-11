// 모든 객체들이 구현해야할 인터페이스
interface Post {
  publish(): void;
  getTitle(): string;
}

// 이미지 유형, 동영상 유형 이런게 아니라 그냥 추상화된 게시물
class BasicPost implements Post {
  protected title: string;

  constructor(title: string) {
    this.title = title;
  }

  public publish(): void {
    console.log(`Publishing post with title "${this.title}"`);
  }

  public getTitle(): string {
    return this.title;
  }
}

// 게시물을 래핑하는 이미지 데코레이터 => 이미지 유형의 포스트를 만들겠죠?
class ImagePostDecorator implements Post {
  protected post: Post;
  protected imageUrl: string;

  constructor(post: Post, imageUrl: string) {
    this.post = post;
    this.imageUrl = imageUrl;
  }

  public publish(): void {
    this.post.publish();
    console.log(`Image url: ${this.imageUrl}`);
  }

  public getTitle(): string {
    return this.post.getTitle();
  }
}

let post: Post = new BasicPost("My First Post");
post.publish(); // 그냥 게시물, 베이직 포스트

post = new ImagePostDecorator(post, "https://example.com/image.jpg");
post.publish(); // 이미지 유형의 게시물이 나왔네요?
