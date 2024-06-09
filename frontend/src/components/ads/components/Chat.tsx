import { useState, useEffect } from "react";
import useSocket from "@/hooks/useSocket";
import { useUserContext } from "@/context/UserContext";
import { MessageTypes } from "@/types/MessageTypes";

type ChatProps = {
  receiverId: number;
};

const Chat = (props: ChatProps) => {
  const socket = useSocket();
  const { user } = useUserContext();
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const [receiverId, setReceiverId] = useState<number>(0);

  useEffect(() => {
    // Remplace cela par une méthode pour obtenir l'utilisateur actuel (ex: depuis le contexte ou une requête)
    setReceiverId(props.receiverId);
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on("message", (message: string) => {
        setMessages((prevMessages) => [...prevMessages, message]);
      });
    }

    // Nettoyage lorsque le composant est démonté
    return () => {
      if (socket) {
        socket.off("message");
      }
    };
  }, [socket]);

  const sendMessage = () => {
    if (socket && input.trim() && user) {
      const messageData: MessageTypes = {
        content: input,
        sender: { id: user.id as unknown as number },
        receiver: { id: receiverId },
      };
      socket.emit("message", messageData);
      setInput("");
    }
  };

  return (
    <div>
      <div>
        {messages.map((msg, index) => (
          <div key={index}>{msg.content}</div>
        ))}
      </div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default Chat;
