import React, { createContext, useEffect, useState } from "react";

export const NewsContext = createContext();

export const NewsProvider = ({ children }) => {
  const [query, setQuery] = useState("");
  const [searchHistory, setSearchHistory] = useState([]);
  const [history, setHistory] = useState(() => {
    const storedHistory = localStorage.getItem("newsHistory");
    return storedHistory ? JSON.parse(storedHistory) : [];
  });

  useEffect(() => {
    localStorage.setItem("newsHistory", JSON.stringify(history));
  }, [history]);

  const addToHistory = (item) => {
    setHistory((prevHistory) => [item, ...prevHistory]);
  };
  const removeAllHistory = () => {
    setHistory([]);
    localStorage.removeItem("newsHistory");
  };

  return (
    <NewsContext.Provider
      value={{
        searchHistory,
        setSearchHistory,
        addToHistory,
        history,
        query,
        setQuery,
        removeAllHistory,
      }}
    >
      {children}
    </NewsContext.Provider>
  );
};
