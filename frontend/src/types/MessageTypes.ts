export type MessageTypes = {
  id: number;
  adId: number;
  content: string;
  createdAt: string;
  receiver: {
    id: number;
    nickName: string;
  };
  sender: {
    id: number;
    nickName: string;
  };
};

export type MessagesTypes = MessageTypes[];
