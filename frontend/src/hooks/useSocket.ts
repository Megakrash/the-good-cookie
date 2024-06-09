import { useEffect, useState } from "react";
import { API_URL } from "@/api/configApi";
import { io, Socket } from "socket.io-client";

const useSocket = () => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const socketIo = io(API_URL as string, {
      withCredentials: true,
    });

    setSocket(socketIo);

    function cleanup() {
      socketIo.disconnect();
    }

    return cleanup;
  }, []);

  return socket;
};

export default useSocket;
