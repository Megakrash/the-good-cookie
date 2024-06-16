import Messages from "@/components/messages/Messages";
import LayoutFull from "@/components/layout/LayoutFull";

function MessagesPage(): React.ReactNode {
  return (
    <LayoutFull title="TGC : Messagerie">
      <Messages />
    </LayoutFull>
  );
}

export default MessagesPage;
