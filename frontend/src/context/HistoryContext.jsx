// HistoryContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const HistoryContext = createContext();

export const HistoryProvider = ({ children }) => {
  const [historyStack, setHistoryStack] = useState([]);
  const location = useLocation();

  useEffect(() => {
    setHistoryStack((prev) => [...prev, location.pathname]);
  }, [location]);

  return (
    <HistoryContext.Provider value={{ historyStack }}>
      {children}
    </HistoryContext.Provider>
  );
};

export const useHistoryStack = () => useContext(HistoryContext);
