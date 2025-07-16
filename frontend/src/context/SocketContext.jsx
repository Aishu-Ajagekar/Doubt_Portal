import { createContext, useContext, useEffect } from "react";
import socket from "../utils/socket"; // singleton

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  useEffect(() => {
    console.log("🔌 SocketProvider mounted");

    // ✅ When socket connects (even after refresh)
    socket.on("connect", () => {
      console.log("✅ Socket connected:", socket.id);


      if (sessionStorage.getItem("userId")) {
        console.log("♻ Re-registering user after refresh", sessionStorage.getItem("userId"));
        socket.emit("connect-user", {
          user_id: sessionStorage.getItem("userId"),
          role: sessionStorage.getItem("role"),
        });
      }
    });

    return () => {
      socket.off("connect"); // cleanup
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
