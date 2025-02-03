export interface IMessage {
  channel: string;
  sender: string;
  content: string;
  isReply: boolean;
}

export interface IChannel {
  name: string;
  messages: IMessage[];
}
