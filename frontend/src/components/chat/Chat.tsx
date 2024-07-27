import { useEffect, useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { queryAllMessages } from "@/graphql/messages/queryAllMessages";
import { mutationSendMessage } from "@/graphql/messages/mutationSendMessage";
import { useUserContext } from "@/context/UserContext";
import { MessageTypes } from "@/types/MessageTypes";
import { subscriptionMessage } from "@/graphql/messages/subscriptionMessage";
import LoadingApp from "@/styles/LoadingApp";
import { showToast } from "../utils/toastHelper";
import ChatCard from "./ChatCard";

type ChatProps = {
  receiverId: string;
  adId: string;
  conversationId?: string;
};

const Chat = (props: ChatProps): React.ReactNode => {
  const { user } = useUserContext();
  const [messageContent, setMessageContent] = useState("");
  const { data, loading, error, subscribeToMore, refetch } = useQuery<{
    items: MessageTypes[];
  }>(queryAllMessages, {
    variables: {
      data: {
        ad: props.adId ? { id: props.adId } : null,
        conversation: props.conversationId
          ? { id: props.conversationId }
          : null,
        userId1: user?.id,
        userId2: props.receiverId ? props.receiverId : null,
      },
    },
  });

  const [conversation, setConversation] = useState<MessageTypes[]>([]);
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
      variables: { ad: props.adId },
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
          receiver: { id: props.receiverId },
          ad: { id: props.adId },
        },
      },
    });

    const newMessage = response.data.sendMessage;

    if (newMessage && newMessage.content) {
      refetch();
    }

    setMessageContent("");
  };
  if (loading) return <LoadingApp />;
  if (error) {
    showToast("error", "Erreur pendant la récupération de votre conversation");
  }

  return (
    <>
      {user && (
        <ChatCard
          conversation={conversation}
          user={user}
          messageContent={messageContent}
          setMessageContent={setMessageContent}
          handleSendMessage={handleSendMessage}
        />
      )}
    </>
  );
};

export default Chat;
