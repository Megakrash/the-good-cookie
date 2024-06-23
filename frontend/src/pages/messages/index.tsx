import React from "react";
import LayoutFull from "@/components/layout/LayoutFull";
import ConversationsPage from "@/components/messages/ConversationsPage";
import { useQuery } from "@apollo/client";
import { queryConversationGetAll } from "@/graphql/conversations/queryConversationGetAll";
import { ConversationsTypes } from "@/types/ConversationTypes";
import LoadingApp from "@/styles/LoadingApp";

const MessagesPage = (): React.ReactNode => {
  const { data, loading } = useQuery<{ items: ConversationsTypes }>(
    queryConversationGetAll,
  );
  if (loading) return <LoadingApp />;
  const conversations = data ? data.items : null;
  return (
    <LayoutFull title="TGC : Messagerie">
      {conversations && conversations !== null && (
        <ConversationsPage conversations={conversations} />
      )}
    </LayoutFull>
  );
};

export default MessagesPage;
