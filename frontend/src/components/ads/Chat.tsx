// pages/chat.tsx
import { useState } from "react";
import { useQuery, useMutation, useSubscription, gql } from "@apollo/client";

const GET_CONVERSATION_MESSAGES = gql`
  query GetConversationMessages($userId1: ID!, $userId2: ID!) {
    getConversationMessages(userId1: $userId1, userId2: $userId2) {
      id
      content
      sender {
        id
        nickName
      }
      receiver {
        id
        nickName
      }
      createdAt
    }
  }
`;

const SEND_MESSAGE = gql`
  mutation SendMessage($data: MessageCreateInput!) {
    sendMessage(data: $data) {
      id
      content
      sender {
        id
        nickName
      }
      receiver {
        id
        nickName
      }
      createdAt
    }
  }
`;

const NEW_MESSAGE_SUBSCRIPTION = gql`
  subscription NewMessage {
    newMessage {
      id
      content
      sender {
        id
        nickName
      }
      receiver {
        id
        nickName
      }
      createdAt
    }
  }
`;

const Chat = () => {
  const userId1 = 5; // Replace with the current user's ID
  const userId2 = 2; // Replace with the other user's ID
  const [messageContent, setMessageContent] = useState("");

  const { data, loading, error, refetch } = useQuery(
    GET_CONVERSATION_MESSAGES,
    {
      variables: { userId1, userId2 },
    },
  );

  const [sendMessage] = useMutation(SEND_MESSAGE);

  useSubscription(NEW_MESSAGE_SUBSCRIPTION, {
    onData: ({ client, data }) => {
      console.log("Subscription data received:", data);
      refetch();
    },
    onError: (error) => {
      console.error("Subscription error:", error);
    },
  });

  const handleSendMessage = async () => {
    if (messageContent.trim() === "") return;

    await sendMessage({
      variables: {
        data: {
          content: messageContent,
          receiver: { id: userId2 },
        },
      },
    });

    setMessageContent("");
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h1>Chat</h1>
      <div>
        {data.getConversationMessages.map((msg) => (
          <div key={msg.id}>
            <strong>{msg.sender.nickName}:</strong> {msg.content}
          </div>
        ))}
      </div>
      <div>
        <input
          type="text"
          value={messageContent}
          onChange={(e) => setMessageContent(e.target.value)}
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Chat;
