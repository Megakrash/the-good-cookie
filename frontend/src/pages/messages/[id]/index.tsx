import React from "react";
import LayoutFull from "@/components/layout/LayoutFull";
import { useRouter } from "next/router";
import Chat from "@/components/chat/Chat";

const ChatPage = (): React.ReactNode => {
  const router = useRouter();
  const { id, ad, receiver } = router.query;
  return (
    <LayoutFull title="TGC : Conversation">
      {id && ad && receiver && (
        <Chat
          conversationId={Number(id)}
          adId={Number(ad)}
          receiverId={Number(receiver)}
        />
      )}
    </LayoutFull>
  );
};

export default ChatPage;
