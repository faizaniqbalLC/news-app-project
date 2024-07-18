import { useState, useEffect, useCallback, useMemo, useRef, useContext } from "react";
import { v4 as uuidv4 } from "uuid";
import axiosInstance from "../utils/axiosInstance";
import { NewsContext } from "../contextApi/NewsContext";
import { showNotification } from "../utils/showNotifications";

const apiKey = import.meta.env.VITE_API_KEY;

const useNews = (category) => {
  const { addToHistory } = useContext(NewsContext);

  // States to manage loading, error, and articles
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [articles, setArticles] = useState([]);
  const [searchedArticles, setSearchedArticles] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState();
  const [searchHistory, setSearchHistory] = useState(() => {
    const storedHistory = localStorage.getItem("searchHistory");
    return storedHistory ? JSON.parse(storedHistory) : [];
  });
  const [showSearchHistory, setShowSearchHistory] = useState(false);
  const [isError, setIsError] = useState(false);
  const [retryFunction, setRetryFunction] = useState(null);

  // Refs for input and history list
  const inputRef = useRef(null);
  const historyListRef = useRef(null);
  const newsEndRef = useRef(null);
  const debounceTimer = useRef(null);

  // Function to update search history
  const updateSearchHistory = useCallback(
    (term) => {
      const updatedHistory = [term, ...searchHistory.slice(0, 3)];
      setSearchHistory(updatedHistory);
      localStorage.setItem("searchHistory", JSON.stringify(updatedHistory));
    },
    [searchHistory],
  );

  // Function to fetch articles based on search term or category
  const fetchArticles = useCallback(
    async (term) => {
      setLoading(true);
      setIsError(false);

      const executeFetch = async () => {
        if (term.trim() === "") {
          // Fetching top headlines if no search term is provided
          const cachedArticles = localStorage.getItem(`articles_${category}`);
          const cachedTimestamp = localStorage.getItem(`timestamp_${category}`);
          const oneHour = 60 * 60 * 1000;

          if (cachedArticles && cachedTimestamp && Date.now() - cachedTimestamp < oneHour) {
            setTotalResults(JSON.parse(localStorage.getItem("totalResults")));
            setArticles(JSON.parse(cachedArticles));
            setLoading(false);
          } else {
            try {
              const response = await axiosInstance.get(
                `/top-headlines?apiKey=${apiKey}&country=us&category=${category}&pageSize=10&page=1`,
              );
              if (response?.data?.status === "ok") {
                setArticles(response?.data.articles);
                setTotalResults(response?.data?.totalResults);
                localStorage.setItem("totalResults", response?.data?.totalResults);
                localStorage.setItem(`articles_${category}`, JSON.stringify(response?.data.articles));
                localStorage.setItem(`timestamp_${category}`, Date.now());
                setLoading(false);
              } else {
                showNotification("error", response?.data?.message || "Something Went Wrong!");
              }
            } catch (error) {
              showNotification("error", error?.message || "Something Went Wrong!");
              setIsError(true);
              setRetryFunction(() => () => fetchArticles(term));
            }
          }
        } else {
          // Fetching articles based on search term
          try {
            const response = await axiosInstance.get(
              `/everything?q=${term}&apiKey=${apiKey}&pageSize=10&page=1`,
            );
            if (response?.data?.status === "ok") {
              setSearchedArticles(response?.data.articles);
              setTotalResults(response?.data?.totalResults);
              setLoading(false);

              const newItem = {
                title: term,
                description: "",
                timeToVisit: new Date().toLocaleString(),
                id: uuidv4(),
              };

              addToHistory(newItem);
              updateSearchHistory(term);
            } else {
              showNotification("error", response?.data?.message || "Something Went Wrong!");
            }
          } catch (error) {
            showNotification("error", error?.message || "Something Went Wrong!");
            setIsError(true);
            setRetryFunction(() => () => fetchArticles(term));
          }
        }
      };

      executeFetch();
    },
    [category, updateSearchHistory],
  );

  // Debounced search handling
  const handleSearchDebounced = useCallback(
    (term) => {
      setLoading(true);
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }

      debounceTimer.current = setTimeout(() => {
        fetchArticles(term);
      }, 500);
    },
    [fetchArticles],
  );

  // Handling search input changes
  const handleSearchChange = (e) => {
    const { value } = e.target;
    setSearchTerm(value);
    handleSearchDebounced(value);
  };

  // Fetching articles on component mount
  useEffect(() => {
    document.title = `NewsApp - Top Articles`;
    fetchArticles("");
  }, [fetchArticles]);

  // Fetching more articles for pagination
  const fetchMoreArticles = useCallback(async () => {
    setIsLoading(true);
    setIsError(false);
    const nextPage = page + 1;

    const executeFetch = async () => {
      if (searchTerm.trim() === "") {
        if (articles.length === totalResults) {
          setIsLoading(false);
          showNotification("error", "You have already fetched all articles!");
          return;
        }
        try {
          const response = await axiosInstance.get(
            `/top-headlines?apiKey=${apiKey}&country=us&category=${category}&pageSize=10&page=${nextPage}`,
          );
          if (response?.data?.status === "ok") {
            const newData = [...articles, ...response?.data.articles];
            setArticles(newData);
            setTotalResults(response?.data?.totalResults);
            localStorage.setItem(`articles_${category}`, JSON.stringify(newData));
            setIsLoading(false);
          } else {
            showNotification("error", response?.data?.message || "Something Went Wrong!");
          }
        } catch (error) {
          showNotification("error", error?.message || "Something Went Wrong!");
          setIsError(true);
          setRetryFunction(() => () => fetchMoreArticles());
        }
      } else {
        if (searchedArticles.length === totalResults) {
          setIsLoading(false);
          showNotification("error", "You have already fetched all articles!");
          return;
        }
        try {
          const response = await axiosInstance.get(
            `/everything?q=${searchTerm}&apiKey=${apiKey}&pageSize=10&page=${nextPage}`,
          );
          if (response?.data?.status === "ok") {
            const newData = [...searchedArticles, ...response?.data.articles];
            setSearchedArticles(newData);
            setTotalResults(response?.data?.totalResults);
            setIsLoading(false);
          } else {
            showNotification("error", response?.data?.message || "Something Went Wrong");
          }
        } catch (error) {
          showNotification("error", error?.message || "Something Went Wrong");
          setIsError(true);
          setRetryFunction(() => () => fetchMoreArticles());
        }
      }

      setPage(nextPage);
    };

    executeFetch();
  }, [page, searchTerm, category, articles, searchedArticles]);

  // Function to scroll to top
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Load more articles handler
  const loadMoreArticles = () => {
    fetchMoreArticles();
  };

  // Show search history on input focus
  const handleInputFocus = () => {
    setShowSearchHistory(true);
  };

  // Hide search history when clicking outside
  const handleClickOutside = (e) => {
    if (
      inputRef.current &&
      !inputRef.current.contains(e.target) &&
      historyListRef.current &&
      !historyListRef.current.contains(e.target)
    ) {
      setShowSearchHistory(false);
    }
  };

  // Clear search history
  const clearSearchHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem("searchHistory");
  };

  // Handle search history item click
  const handleHistoryItemClick = (term) => {
    setSearchTerm(term);
    handleSearchDebounced(term);
    setShowSearchHistory(false);
  };

  // Adding event listener to handle clicks outside of search input
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return {
    loading,
    isLoading,
    articles,
    searchedArticles,
    searchTerm,
    searchHistory,
    showSearchHistory,
    isError,
    retryFunction,
    inputRef,
    historyListRef,
    newsEndRef,
    handleSearchChange,
    loadMoreArticles,
    scrollToTop,
    handleInputFocus,
    clearSearchHistory,
    handleHistoryItemClick,
  };
};

export default useNews;
