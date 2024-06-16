import { useEffect, useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { queryAllMessages } from "@/graphql/messages/queryAllMessages";
import { mutationSendMessage } from "@/graphql/messages/mutationSendMessage";
import { useUserContext } from "@/context/UserContext";
import { MessagesTypes, MessageTypes } from "@/types/MessageTypes";
import { subscriptionMessage } from "@/graphql/messages/subscriptionMessage";

type ChatProps = {
  receiverId: number;
  adId: number;
};

const Chat = (props: ChatProps) => {
  const { user } = useUserContext();
  const [messageContent, setMessageContent] = useState("");
  const { data, loading, error, subscribeToMore } = useQuery<{
    items: MessagesTypes;
  }>(queryAllMessages, {
    variables: {
      data: {
        adId: Number(props.adId),
        userId1: Number(user.id),
        userId2: Number(props.receiverId),
      },
    },
  });

  const [conversation, setConversation] = useState<MessagesTypes>([]);

  useEffect(() => {
    if (data?.items) {
      setConversation(data.items);
    }
  }, [data]);

  useEffect(() => {
    const unsubscribe = subscribeToMore<{
      newMessage: MessageTypes;
    }>({
      document: subscriptionMessage,
      variables: { adId: Number(props.adId) },
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;
        const newMessage = subscriptionData.data.newMessage;
        return {
          ...prev,
          items: [...prev.items, newMessage],
        };
      },
      onError: (err) => {
        console.error(`Subscription error: ${err.message}`);
      },
    });

    return () => unsubscribe();
  }, [subscribeToMore, props.adId]);

  const [sendMessage] = useMutation(mutationSendMessage);

  const handleSendMessage = async () => {
    if (messageContent.trim() === "") return;

    const response = await sendMessage({
      variables: {
        data: {
          content: messageContent,
          receiver: { id: Number(props.receiverId) },
          adId: Number(props.adId),
        },
      },
    });

    // Assume response.data.sendMessage est le nouveau message
    const newMessage = response.data.sendMessage;

    if (newMessage && newMessage.content) {
      setConversation((prevMessages) => [...prevMessages, newMessage]);
    }

    setMessageContent("");
  };
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h1>Chat</h1>
      <div>
        {conversation.map((msg) => (
          <div key={msg.id}>
            <strong>{msg.sender.nickName}</strong>: {msg.content}
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
