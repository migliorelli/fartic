export enum MessageTypeEnum {
  SERVER = "SERVER",
  CONFIRM = "CONFIRM",
  WARNING = "WARNING",
  MESSAGE = "MESSAGE",
}

export interface Message {
  title: string;
  content: string;
  type: MessageTypeEnum;
}
