export interface IUpdateMessage {
  to: string;
  from: string;
  content: string;
  categoryId: number;
}

export interface IMessage extends IUpdateMessage {
  id: number;
  isPublished: boolean;
  resolvedAt: string;
  type: string;
}

export interface IUpdateMessageCategory {
  categoryId: number;
}

export interface IUpdateMessageSeen {
  isPublished: boolean;
  type: string;
  resolvedAt: string;
}
