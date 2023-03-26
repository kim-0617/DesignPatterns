// Command interface
interface Command {
  execute(): void;
}

// Receiver : 거의 모든 객체가 리시버가 될 수 있습니다.
// 클라이언트의 요청을 받아서 처리하는 객체, 비즈니스 로직이 포함되어 있습니다.
class Light {
  on(): void {
    console.log("Light is on");
  }

  off(): void {
    console.log("Light is off");
  }
}

// Concrete Command
class LightOnCommand implements Command {
  private light: Light;

  constructor(light: Light) {
    this.light = light;
  }

  execute(): void {
    this.light.on();
  }
}

// Concrete Command
class LightOffCommand implements Command {
  private light: Light;

  constructor(light: Light) {
    this.light = light;
  }

  execute(): void {
    this.light.off();
  }
}

// Invoker : 커맨드를  실행하는 발송자 객체
class RemoteControl {
  private commands: Command[] = [];

  // 요청을 받구요
  setCommand(command: Command): void {
    this.commands.push(command);
  }

  // 요청을 처리합니다.
  executeCommands(): void {
    this.commands.forEach((command) => {
      command.execute();
    });
  }
}

// Client code
const livingRoomLight = new Light();
const kitchenLight = new Light();

const livingRoomLightOnCommand = new LightOnCommand(livingRoomLight);
const livingRoomLightOffCommand = new LightOffCommand(livingRoomLight);
const kitchenLightOnCommand = new LightOnCommand(kitchenLight);
const kitchenLightOffCommand = new LightOffCommand(kitchenLight);

const remoteControl = new RemoteControl();

remoteControl.setCommand(livingRoomLightOnCommand);
remoteControl.setCommand(livingRoomLightOffCommand);
remoteControl.setCommand(kitchenLightOnCommand);
remoteControl.setCommand(kitchenLightOffCommand);

remoteControl.executeCommands();
